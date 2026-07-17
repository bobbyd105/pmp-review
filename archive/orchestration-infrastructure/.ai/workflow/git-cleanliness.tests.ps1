[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "git-cleanliness.ps1")

function Invoke-TestGit {
    param(
        [Parameter(Mandatory = $true)][string]$Repository,
        [Parameter(Mandatory = $true)][string[]]$Arguments
    )

    & git -C $Repository @Arguments | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Test Git command failed: git -C $Repository $($Arguments -join ' ')"
    }
}

function Assert-TestPasses {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][scriptblock]$Action
    )

    & $Action
    Write-Host "[PASS] $Name"
}

function Assert-TestBlocks {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$ExpectedPath,
        [Parameter(Mandatory = $true)][scriptblock]$Action
    )

    try {
        & $Action
    }
    catch {
        if ($_.Exception.Message -notlike "*$ExpectedPath*") {
            throw "Test '$Name' blocked without naming '$ExpectedPath': $($_.Exception.Message)"
        }
        Write-Host "[PASS] $Name"
        return
    }

    throw "Test '$Name' did not block as expected."
}

$tempRoot = [IO.Path]::GetFullPath((Join-Path ([IO.Path]::GetTempPath()) ("pmp-workflow-cleanliness-" + [Guid]::NewGuid().ToString("N"))))
$systemTemp = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
if (-not $tempRoot.StartsWith($systemTemp, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to create the test repository outside the system temporary directory."
}

try {
    New-Item -ItemType Directory -Path $tempRoot | Out-Null
    Invoke-TestGit -Repository $tempRoot -Arguments @("init", "--quiet")
    Invoke-TestGit -Repository $tempRoot -Arguments @("config", "user.name", "Workflow Test")
    Invoke-TestGit -Repository $tempRoot -Arguments @("config", "user.email", "workflow-test@example.invalid")
    Set-Content -LiteralPath (Join-Path $tempRoot "README.md") -Value "baseline" -Encoding utf8
    Invoke-TestGit -Repository $tempRoot -Arguments @("add", "README.md")
    Invoke-TestGit -Repository $tempRoot -Arguments @("commit", "--quiet", "-m", "test baseline")

    Push-Location $tempRoot
    try {
        Assert-TestPasses -Name "clean repository succeeds" -Action { Assert-CleanStart }

        $workflowRoot = Join-Path $tempRoot ".ai\workflow"
        New-Item -ItemType Directory -Path $workflowRoot -Force | Out-Null
        Set-Content -LiteralPath (Join-Path $workflowRoot "master-plan.smoke-live.json") -Value "{}" -Encoding utf8
        Set-Content -LiteralPath (Join-Path $workflowRoot "current-state.smoke-live.json") -Value "{}" -Encoding utf8
        Assert-TestPasses -Name "runtime state files only succeeds" -Action { Assert-CleanStart }

        Set-Content -LiteralPath (Join-Path $tempRoot "README.md") -Value "modified" -Encoding utf8
        Assert-TestBlocks -Name "unrelated modified file fails" -ExpectedPath "README.md" -Action { Assert-CleanStart }
        Invoke-TestGit -Repository $tempRoot -Arguments @("restore", "README.md")

        Set-Content -LiteralPath (Join-Path $tempRoot "unrelated.tmp") -Value "untracked" -Encoding utf8
        Assert-TestBlocks -Name "unrelated untracked file fails" -ExpectedPath "unrelated.tmp" -Action { Assert-CleanStart }
    }
    finally {
        Pop-Location
    }
}
finally {
    if (Test-Path -LiteralPath $tempRoot) {
        $resolvedTempRoot = [IO.Path]::GetFullPath($tempRoot)
        if (-not $resolvedTempRoot.StartsWith($systemTemp, [StringComparison]::OrdinalIgnoreCase)) {
            throw "Refusing to remove a test directory outside the system temporary directory."
        }
        Remove-Item -LiteralPath $resolvedTempRoot -Recurse -Force
    }
}

Write-Host "All Git cleanliness regression tests passed."
