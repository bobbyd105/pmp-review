[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [Parameter(Mandatory = $true)]
    [string]$PlanPath,

    [Parameter(Mandatory = $true)]
    [string]$StatePath,

    [string]$RunsRoot = ".ai/workflow/runs",

    [switch]$OpenPullRequest,

    [switch]$NoPush
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Invoke-CheckedCommand {
    param(
        [Parameter(Mandatory = $true)][string]$Command,
        [switch]$Capture
    )

    Write-Host "> $Command"
    if ($Capture) {
        $output = & cmd.exe /d /s /c $Command 2>&1
        $exitCode = $LASTEXITCODE
        if ($exitCode -ne 0) {
            throw "Command failed with exit code $exitCode`: $Command`n$($output -join [Environment]::NewLine)"
        }
        return ($output -join [Environment]::NewLine).Trim()
    }

    & cmd.exe /d /s /c $Command
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code $LASTEXITCODE`: $Command"
    }
}

function Assert-ToolAvailable {
    param([Parameter(Mandatory = $true)][string]$Name)

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found on PATH."
    }
}

function Read-JsonFile {
    param([Parameter(Mandatory = $true)][string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Required JSON file not found: $Path"
    }
    return Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json -Depth 100
}

function Write-JsonFile {
    param(
        [Parameter(Mandatory = $true)]$Value,
        [Parameter(Mandatory = $true)][string]$Path
    )

    $directory = Split-Path -Parent $Path
    if ($directory) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }
    $Value | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $Path -Encoding utf8
}

function Convert-GlobToRegex {
    param([Parameter(Mandatory = $true)][string]$Pattern)

    $normalized = $Pattern.Replace("\", "/")
    $escaped = [Regex]::Escape($normalized)
    $escaped = $escaped.Replace("\*\*", ".*").Replace("\*", "[^/]*").Replace("\?", ".")
    return "^$escaped$"
}

function Test-PathMatchesAny {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][object[]]$Patterns
    )

    $normalized = $Path.Replace("\", "/")
    foreach ($pattern in $Patterns) {
        if ($normalized -match (Convert-GlobToRegex ([string]$pattern))) {
            return $true
        }
    }
    return $false
}

function Get-ChangedPaths {
    $lines = & git status --porcelain=v1 --untracked-files=all
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to read Git working tree status."
    }

    $paths = @()
    foreach ($line in $lines) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        $path = $line.Substring(3).Trim()
        if ($path.Contains(" -> ")) {
            $path = ($path -split " -> ")[-1]
        }
        $paths += $path.Replace("\", "/")
    }
    return @($paths | Sort-Object -Unique)
}

function Assert-CleanStart {
    $dirty = Get-ChangedPaths
    if ($dirty.Count -gt 0) {
        throw "Workflow must start from a clean working tree. Uncommitted paths: $($dirty -join ', ')"
    }
}

function Assert-Branch {
    param([Parameter(Mandatory = $true)][string]$ExpectedBranch)

    $actual = (& git branch --show-current).Trim()
    if ($LASTEXITCODE -ne 0 -or -not $actual) {
        throw "Unable to determine the current Git branch."
    }
    if ($actual -ne $ExpectedBranch) {
        throw "Current branch '$actual' does not match approved feature branch '$ExpectedBranch'."
    }
    if ($actual -eq "main") {
        throw "The workflow may not run directly on main."
    }
}

function Assert-ChangedPathsAllowed {
    param(
        [Parameter(Mandatory = $true)][object[]]$Allowed,
        [Parameter(Mandatory = $true)][object[]]$Forbidden,
        [Parameter(Mandatory = $true)][string]$ResultPath
    )

    $changed = Get-ChangedPaths
    $allowedWithResult = @($Allowed) + @($ResultPath.Replace("\", "/"), $StatePath.Replace("\", "/"))

    foreach ($path in $changed) {
        if (Test-PathMatchesAny -Path $path -Patterns $Forbidden) {
            throw "Forbidden path changed: $path"
        }
        if (-not (Test-PathMatchesAny -Path $path -Patterns $allowedWithResult)) {
            throw "Path changed outside the approved batch scope: $path"
        }
    }

    return $changed
}

function Assert-BatchResult {
    param(
        [Parameter(Mandatory = $true)]$Result,
        [Parameter(Mandatory = $true)][string]$FeatureId,
        [Parameter(Mandatory = $true)][string]$BatchId
    )

    $required = @("feature_id", "batch_id", "status", "summary", "changed_paths", "validation", "review_findings", "codex_attempts", "next_action")
    foreach ($name in $required) {
        if (-not $Result.PSObject.Properties.Name.Contains($name)) {
            throw "Batch result is missing required property '$name'."
        }
    }

    if ($Result.feature_id -ne $FeatureId -or $Result.batch_id -ne $BatchId) {
        throw "Batch result identity does not match the active plan."
    }
    if ($Result.status -ne "BATCH_COMPLETE" -or $Result.next_action -ne "checkpoint") {
        throw "Claude did not approve the batch for checkpoint. Status: $($Result.status); next action: $($Result.next_action)"
    }
    if (@($Result.review_findings | Where-Object { -not $_.resolved -and $_.severity -in @("critical", "high") }).Count -gt 0) {
        throw "Batch result contains unresolved critical or high-severity findings."
    }
}

function Invoke-ClaudeBatch {
    param(
        [Parameter(Mandatory = $true)]$Plan,
        [Parameter(Mandatory = $true)]$State,
        [Parameter(Mandatory = $true)]$Batch,
        [Parameter(Mandatory = $true)][string]$ResultPath
    )

    $basePrompt = Get-Content -LiteralPath ".ai/workflow/orchestrator-prompt.md" -Raw
    $payload = [ordered]@{
        master_plan_path = (Resolve-Path -LiteralPath $PlanPath).Path
        state_path = (Resolve-Path -LiteralPath $StatePath).Path
        result_path = [IO.Path]::GetFullPath($ResultPath)
        feature = [ordered]@{
            id = $Plan.feature_id
            title = $Plan.title
            branch = $Plan.branch
        }
        batch = $Batch
    } | ConvertTo-Json -Depth 100

    $prompt = "$basePrompt`n`n## Controller payload`n```json`n$payload`n```"
    Write-Host "Starting fresh Claude session for batch $($Batch.id)..."
    $output = & claude -p $prompt 2>&1
    $exitCode = $LASTEXITCODE
    $output | ForEach-Object { Write-Host $_ }
    if ($exitCode -ne 0) {
        throw "Claude Code exited with code $exitCode for batch $($Batch.id)."
    }
    if (-not (Test-Path -LiteralPath $ResultPath)) {
        throw "Claude did not write the required batch result: $ResultPath"
    }
}

function Invoke-ValidationCommands {
    param([Parameter(Mandatory = $true)][object[]]$Commands)

    foreach ($command in $Commands) {
        Invoke-CheckedCommand -Command ([string]$command)
    }
}

function New-CheckpointCommit {
    param(
        [Parameter(Mandatory = $true)]$Batch,
        [Parameter(Mandatory = $true)]$State
    )

    Invoke-CheckedCommand -Command "git add --all"
    $staged = (& git diff --cached --name-only)
    if ($LASTEXITCODE -ne 0 -or -not $staged) {
        throw "No staged changes exist for checkpoint $($Batch.id)."
    }

    $message = "checkpoint($($Batch.id)): $($Batch.title)"
    Invoke-CheckedCommand -Command "git commit -m `"$message`""
    $sha = (& git rev-parse HEAD).Trim()

    if (-not $NoPush) {
        Invoke-CheckedCommand -Command "git push -u origin $($State.branch)"
    }
    return $sha
}

Assert-ToolAvailable "git"
Assert-ToolAvailable "claude"
Assert-ToolAvailable "codex"
if ($OpenPullRequest) { Assert-ToolAvailable "gh" }

$plan = Read-JsonFile $PlanPath
$state = Read-JsonFile $StatePath

if ($plan.status -ne "approved") {
    throw "Master plan status must be 'approved' before automation begins."
}
if ($plan.branch -ne $state.branch) {
    throw "Plan and state branch values do not match."
}
if (@($plan.batches).Count -gt [int]$plan.max_total_batches) {
    throw "Plan exceeds max_total_batches."
}

Assert-Branch $plan.branch
Assert-CleanStart

$runDirectory = Join-Path $RunsRoot $plan.feature_id
$resultDirectory = Join-Path $runDirectory "results"
New-Item -ItemType Directory -Path $resultDirectory -Force | Out-Null

foreach ($batch in $plan.batches) {
    if (@($state.completed_batches) -contains $batch.id) {
        Write-Host "Skipping completed batch $($batch.id)."
        continue
    }
    if ($state.next_batch -and $state.next_batch -ne $batch.id) {
        continue
    }

    $resultPath = Join-Path $resultDirectory "$($batch.id)-result.json"
    if (Test-Path -LiteralPath $resultPath) {
        Remove-Item -LiteralPath $resultPath -Force
    }

    try {
        Invoke-ClaudeBatch -Plan $plan -State $state -Batch $batch -ResultPath $resultPath
        $result = Read-JsonFile $resultPath
        Assert-BatchResult -Result $result -FeatureId $plan.feature_id -BatchId $batch.id
        Invoke-ValidationCommands -Commands @($batch.validation_commands)
        $changed = Assert-ChangedPathsAllowed -Allowed @($batch.allowed_paths) -Forbidden @($batch.forbidden_paths) -ResultPath $resultPath

        $state.status = "checkpointing"
        $state.attempts_for_current_batch = [int]$result.codex_attempts
        $state.updated_at = (Get-Date).ToUniversalTime().ToString("o")
        Write-JsonFile -Value $state -Path $StatePath

        $sha = New-CheckpointCommit -Batch $batch -State $state
        $state.last_completed_batch = $batch.id
        $state.last_checkpoint_commit = $sha
        $state.completed_batches = @($state.completed_batches) + @($batch.id)
        $next = @($plan.batches | Where-Object { @($state.completed_batches) -notcontains $_.id } | Select-Object -First 1)
        $state.next_batch = if ($next.Count -gt 0) { $next[0].id } else { $null }
        $state.status = if ($state.next_batch) { "ready" } else { "batches_complete" }
        $state.open_blockers = @()
        $state.updated_at = (Get-Date).ToUniversalTime().ToString("o")
        Write-JsonFile -Value $state -Path $StatePath

        # Persist post-commit state as its own workflow checkpoint.
        Invoke-CheckedCommand -Command "git add `"$StatePath`""
        if (& git diff --cached --quiet) {
            # no state delta
        } else {
            Invoke-CheckedCommand -Command "git commit -m `"chore(workflow): advance after $($batch.id)`""
            if (-not $NoPush) { Invoke-CheckedCommand -Command "git push origin $($state.branch)" }
        }

        Write-Host "Batch $($batch.id) checkpointed at $sha."
    }
    catch {
        $state.status = "blocked"
        $state.open_blockers = @($_.Exception.Message)
        $state.updated_at = (Get-Date).ToUniversalTime().ToString("o")
        Write-JsonFile -Value $state -Path $StatePath
        Write-Error "Batch $($batch.id) stopped: $($_.Exception.Message)"
        exit 1
    }
}

if ($state.status -ne "batches_complete") {
    Write-Host "No eligible batch was run. Current next batch: $($state.next_batch)"
    exit 0
}

Write-Host "Running final feature gate..."
Invoke-ValidationCommands -Commands @($plan.final_validation_commands)
Assert-CleanStart

if ($OpenPullRequest -and -not $state.pull_request_url) {
    $bodyPath = Join-Path $runDirectory "pull-request.md"
    if (-not (Test-Path -LiteralPath $bodyPath)) {
        $completed = (@($state.completed_batches) | ForEach-Object { "- $_" }) -join [Environment]::NewLine
        @"
## Feature
$($plan.feature_id) — $($plan.title)

## Completed batches
$completed

## Final validation
$((@($plan.final_validation_commands) | ForEach-Object { "- ``$_``: passed" }) -join [Environment]::NewLine)

## Review status
Created as a draft. The User remains the final approval and merge authority.
"@ | Set-Content -LiteralPath $bodyPath -Encoding utf8
    }

    $draftFlag = if ($plan.pull_request.open_as_draft) { "--draft" } else { "" }
    $url = Invoke-CheckedCommand -Capture -Command "gh pr create $draftFlag --base $($plan.base_branch) --head $($plan.branch) --title `"$($plan.pull_request.title)`" --body-file `"$bodyPath`""
    $state.pull_request_url = $url
    $state.status = "pr_open"
    $state.updated_at = (Get-Date).ToUniversalTime().ToString("o")
    Write-JsonFile -Value $state -Path $StatePath
    Write-Host "Draft PR opened: $url"
}

Write-Host "Workflow complete. All batches and final validation passed."
