[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [Parameter(Mandatory = $true)]
    [string]$PlanPath,

    [Parameter(Mandatory = $true)]
    [string]$StatePath,

    [string]$RunsRoot = ".ai/workflow/runs",

    [switch]$OpenPullRequest,

    [switch]$NoPush,

    [switch]$SmokeTest
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$gitCleanlinessHelper = Join-Path (Split-Path -Parent $PSScriptRoot) ".ai\workflow\git-cleanliness.ps1"
if (-not (Test-Path -LiteralPath $gitCleanlinessHelper -PathType Leaf)) {
    throw "Required workflow file not found: $gitCleanlinessHelper"
}
. $gitCleanlinessHelper

$script:ProviderRegistry = @{
    orchestrator = @{
        "claude-code" = [pscustomobject]@{
            Id = "claude-code"
            DisplayName = "Claude Code"
            Command = "claude"
        }
    }
    worker = @{
        "codex-cli" = [pscustomobject]@{
            Id = "codex-cli"
            DisplayName = "Codex CLI"
            Command = "codex"
        }
    }
}

$script:RequiredWorkflowFiles = @(
    ".ai/workflow/orchestrator-prompt.md",
    ".ai/workflow/batch-result.schema.json",
    ".ai/workflow/git-cleanliness.ps1"
)

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

function Assert-WorkflowFilesExist {
    param([Parameter(Mandatory = $true)][string[]]$Paths)

    foreach ($path in $Paths) {
        if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
            throw "Required workflow file not found: $path"
        }
    }
}

function Resolve-ProviderConfiguration {
    param([Parameter(Mandatory = $true)]$Plan)

    if (-not $Plan.PSObject.Properties.Name.Contains("providers")) {
        throw "Master plan is missing required 'providers' configuration. Expected orchestrator 'claude-code' and worker 'codex-cli'."
    }

    foreach ($role in @("orchestrator", "worker")) {
        if (-not $Plan.providers.PSObject.Properties.Name.Contains($role)) {
            throw "Master plan providers configuration is missing '$role'."
        }

        $providerId = [string]$Plan.providers.$role
        if ([string]::IsNullOrWhiteSpace($providerId)) {
            throw "Master plan provider '$role' must not be empty."
        }

        $supported = $script:ProviderRegistry[$role]
        if (-not $supported.ContainsKey($providerId)) {
            $supportedIds = @($supported.Keys | Sort-Object) -join ", "
            throw "Unsupported $role provider '$providerId'. Supported values: $supportedIds."
        }
    }

    return [pscustomobject]@{
        Orchestrator = $script:ProviderRegistry.orchestrator[[string]$Plan.providers.orchestrator]
        Worker = $script:ProviderRegistry.worker[[string]$Plan.providers.worker]
    }
}

function Get-RequiredCommandNames {
    param(
        [Parameter(Mandatory = $true)]$Providers,
        [switch]$IncludeGitHubCli
    )

    $names = @("git", $Providers.Orchestrator.Command, $Providers.Worker.Command)
    if ($IncludeGitHubCli) {
        $names += "gh"
    }
    return @($names | Sort-Object -Unique)
}

function Assert-CommandsAvailable {
    param([Parameter(Mandatory = $true)][string[]]$Names)

    $missing = @($Names | Where-Object { -not (Get-Command $_ -ErrorAction SilentlyContinue) })
    if ($missing.Count -gt 0) {
        throw "Required commands were not found on PATH: $($missing -join ', ')."
    }
}

function Assert-WorkflowConfiguration {
    param(
        [Parameter(Mandatory = $true)]$Plan,
        [Parameter(Mandatory = $true)]$State,
        [switch]$RequirePullRequest
    )

    foreach ($name in @("feature_id", "title", "branch", "base_branch", "status", "max_total_batches", "batches", "final_validation_commands")) {
        if (-not $Plan.PSObject.Properties.Name.Contains($name)) {
            throw "Master plan is missing required property '$name'."
        }
    }
    foreach ($name in @("feature_id", "branch", "status", "completed_batches")) {
        if (-not $State.PSObject.Properties.Name.Contains($name)) {
            throw "Workflow state is missing required property '$name'."
        }
    }

    if ($Plan.status -ne "approved") {
        throw "Master plan status must be 'approved' before automation begins."
    }
    if ($Plan.feature_id -ne $State.feature_id) {
        throw "Plan and state feature_id values do not match."
    }
    if ($Plan.branch -ne $State.branch) {
        throw "Plan and state branch values do not match."
    }
    if (@($Plan.batches).Count -gt [int]$Plan.max_total_batches) {
        throw "Plan exceeds max_total_batches."
    }
    if ($RequirePullRequest) {
        if (-not $Plan.PSObject.Properties.Name.Contains("pull_request")) {
            throw "Master plan is missing required property 'pull_request' for -OpenPullRequest."
        }
        foreach ($name in @("open_as_draft", "title")) {
            if (-not $Plan.pull_request.PSObject.Properties.Name.Contains($name)) {
                throw "Master plan pull_request configuration is missing '$name'."
            }
        }
    }
}

function Get-GitSnapshot {
    $branch = (& git branch --show-current).Trim()
    if ($LASTEXITCODE -ne 0 -or -not $branch) {
        throw "Unable to determine the current Git branch."
    }

    $cleanliness = Get-GitCleanlinessSnapshot

    return [pscustomobject]@{
        Branch = $branch
        IsClean = $cleanliness.IsClean
        BlockingEntries = $cleanliness.BlockingEntries
        RuntimeEntries = $cleanliness.RuntimeEntries
    }
}

function Invoke-SmokeTest {
    param(
        [Parameter(Mandatory = $true)]$Plan,
        [Parameter(Mandatory = $true)]$State,
        [Parameter(Mandatory = $true)]$Providers,
        [Parameter(Mandatory = $true)][string[]]$RequiredCommands
    )

    Write-Host "=== Claude-Codex workflow smoke test ==="
    Write-Host "[PASS] Master plan parsed: $((Resolve-Path -LiteralPath $PlanPath).Path)"
    Write-Host "[PASS] Workflow state parsed: $((Resolve-Path -LiteralPath $StatePath).Path)"
    foreach ($path in $script:RequiredWorkflowFiles) {
        Write-Host "[PASS] Required workflow file exists: $path"
    }
    Write-Host "[PASS] Orchestrator provider: $($Providers.Orchestrator.Id) -> $($Providers.Orchestrator.Command)"
    Write-Host "[PASS] Worker provider: $($Providers.Worker.Id) -> $($Providers.Worker.Command)"

    foreach ($name in $RequiredCommands) {
        $resolved = Get-Command $name -ErrorAction Stop
        Write-Host "[PASS] Required command found: $name -> $($resolved.Source)"
    }

    $git = Get-GitSnapshot
    Write-Host "[INFO] Current Git branch: $($git.Branch)"
    Write-Host "[INFO] Configured feature branch: $($Plan.branch)"
    if ($git.Branch -ne $Plan.branch) {
        Write-Warning "Normal execution will stop until the current branch matches '$($Plan.branch)'."
    }
    foreach ($entry in $git.RuntimeEntries) {
        Write-Host "[INFO] Controller runtime file excluded from cleanliness validation: $($entry.Path)"
    }
    if ($git.IsClean) {
        Write-Host "[PASS] Git working tree has no blocking changes."
    }
    else {
        Write-Warning "Git working tree contains blocking changes. Normal execution will stop."
        $git.BlockingEntries | ForEach-Object { Write-Host "       $($_.Status) $($_.Path)" }
    }

    Write-Host ""
    Write-Host "Planned actions (preview only; nothing below is executed):"
    foreach ($batch in @($Plan.batches)) {
        if (@($State.completed_batches) -contains $batch.id) {
            Write-Host "- Skip completed batch $($batch.id): $($batch.title)"
            continue
        }

        Write-Host "- Batch $($batch.id): $($batch.title)"
        Write-Host "  > $($Providers.Orchestrator.Command) -p <generated prompt for $($batch.id)>"
        Write-Host "    $($Providers.Orchestrator.DisplayName) delegates implementation to $($Providers.Worker.DisplayName) using '$($Providers.Worker.Command)'."
        foreach ($command in @($batch.validation_commands)) {
            Write-Host "  > $command"
        }
        Write-Host "  > git add --all"
        Write-Host "  > git commit -m `"checkpoint($($batch.id)): $($batch.title)`""
        if (-not $NoPush) {
            Write-Host "  > git push -u origin $($State.branch)"
        }
        Write-Host "  > git commit -m `"chore(workflow): advance after $($batch.id)`" (only when state changed)"
    }

    Write-Host "- Final feature gate"
    foreach ($command in @($Plan.final_validation_commands)) {
        Write-Host "  > $command"
    }
    if ($OpenPullRequest) {
        $draftFlag = if ($Plan.pull_request.open_as_draft) { "--draft" } else { "" }
        Write-Host "  > gh pr create $draftFlag --base $($Plan.base_branch) --head $($Plan.branch) --title `"$($Plan.pull_request.title)`" --body-file <generated pull-request.md>"
    }

    Write-Host ""
    Write-Host "SMOKE TEST PASSED: configuration and required commands are available. No actions were performed."
}

function Read-JsonFile {
    param([Parameter(Mandatory = $true)][string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Required JSON file not found: $Path"
    }
    return Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json
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
        [Parameter(Mandatory = $true)][string]$ResultPath,
        [Parameter(Mandatory = $true)]$Providers
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
        providers = [ordered]@{
            orchestrator = [ordered]@{
                id = $Providers.Orchestrator.Id
                command = $Providers.Orchestrator.Command
            }
            worker = [ordered]@{
                id = $Providers.Worker.Id
                command = $Providers.Worker.Command
            }
        }
        batch = $Batch
    } | ConvertTo-Json -Depth 100

    $prompt = $basePrompt + [Environment]::NewLine + [Environment]::NewLine +
        "## Controller payload" + [Environment]::NewLine +
        '```json' + [Environment]::NewLine + $payload + [Environment]::NewLine + '```'
    Write-Host "Starting fresh $($Providers.Orchestrator.DisplayName) session for batch $($Batch.id)..."
    $orchestratorCommand = $Providers.Orchestrator.Command
    $output = & $orchestratorCommand -p $prompt 2>&1
    $exitCode = $LASTEXITCODE
    $output | ForEach-Object { Write-Host $_ }
    if ($exitCode -ne 0) {
        throw "$($Providers.Orchestrator.DisplayName) exited with code $exitCode for batch $($Batch.id)."
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

try {
    Assert-WorkflowFilesExist -Paths (@($PlanPath, $StatePath) + $script:RequiredWorkflowFiles)
    $plan = Read-JsonFile $PlanPath
    $state = Read-JsonFile $StatePath
    $null = Read-JsonFile ".ai/workflow/batch-result.schema.json"
    Assert-WorkflowConfiguration -Plan $plan -State $state -RequirePullRequest:$OpenPullRequest
    $providers = Resolve-ProviderConfiguration -Plan $plan
    $requiredCommands = Get-RequiredCommandNames -Providers $providers -IncludeGitHubCli:$OpenPullRequest
    Assert-CommandsAvailable -Names $requiredCommands
}
catch {
    if ($SmokeTest) {
        Write-Error "SMOKE TEST FAILED: $($_.Exception.Message)" -ErrorAction Continue
        exit 1
    }
    throw
}

if ($SmokeTest) {
    try {
        Invoke-SmokeTest -Plan $plan -State $state -Providers $providers -RequiredCommands $requiredCommands
        exit 0
    }
    catch {
        Write-Error "SMOKE TEST FAILED: $($_.Exception.Message)" -ErrorAction Continue
        exit 1
    }
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
        Invoke-ClaudeBatch -Plan $plan -State $state -Batch $batch -ResultPath $resultPath -Providers $providers
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
