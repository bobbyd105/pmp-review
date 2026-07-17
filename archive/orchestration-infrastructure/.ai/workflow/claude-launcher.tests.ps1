[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "claude-launcher.ps1")

function Assert-Equal {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        $Actual,
        $Expected
    )

    if ($Actual -ne $Expected) {
        throw "$Name expected '$Expected' but received '$Actual'."
    }
}

function Assert-Throws {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][scriptblock]$Action,
        [Parameter(Mandatory = $true)][string]$ExpectedMessage
    )

    try {
        & $Action
    }
    catch {
        if ($_.Exception.Message -notlike "*$ExpectedMessage*") {
            throw "$Name failed with an unexpected message: $($_.Exception.Message)"
        }
        Write-Host "[PASS] $Name"
        return
    }
    throw "$Name did not fail as expected."
}

$commandCandidates = @(
    [pscustomobject]@{ CommandType = "ExternalScript"; Path = "C:\npm\claude.ps1"; Source = "C:\npm\claude.ps1" },
    [pscustomobject]@{ CommandType = "Application"; Path = "C:\npm\claude.cmd"; Source = "C:\npm\claude.cmd" }
)
$selectedCommand = Select-ClaudeLaunchCommand -Candidates $commandCandidates -IsWindows $true
Assert-Equal -Name "Windows launcher entry point" -Actual $selectedCommand -Expected "C:\npm\claude.cmd"
Write-Host "[PASS] Windows launcher avoids the terminating PowerShell shim"

$modernHelp = @"
Usage: claude [options] [prompt]
  -p, --print       Print response and exit
  -v, --version     Output the version number
  --tools <tools>   Specify available tools
"@
$modern = New-ClaudeLaunchSpec -Command "claude" -HelpText $modernHelp -Version "2.1.208"
Assert-Equal -Name "modern print flag" -Actual $modern.PrintFlag -Expected "--print"
Assert-Equal -Name "modern version flag" -Actual $modern.VersionFlag -Expected "--version"
Assert-Equal -Name "detected version retained" -Actual $modern.Version -Expected "2.1.208"
Write-Host "[PASS] modern Claude flags are preferred"

$legacyHelp = @"
Usage: claude [options] [prompt]
  -p     Print response and exit
  -v     Output the version number
"@
$legacy = New-ClaudeLaunchSpec -Command "claude" -HelpText $legacyHelp -Version "1.0.0"
Assert-Equal -Name "legacy print flag" -Actual $legacy.PrintFlag -Expected "-p"
Assert-Equal -Name "legacy version flag" -Actual $legacy.VersionFlag -Expected "-v"
Write-Host "[PASS] short-flag fallback remains supported"

$promptWithOptionText = "Run validation: git diff --check"
$launch = New-ClaudeLaunchCommand -LaunchSpec $modern
Assert-Equal -Name "normal argument count" -Actual @($launch.Arguments).Count -Expected 1
Assert-Equal -Name "normal print argument" -Actual @($launch.Arguments)[0] -Expected "--print"
if (@($launch.Arguments) -contains "--check" -or @($launch.Arguments) -contains $promptWithOptionText) {
    throw "Prompt content leaked into Claude CLI arguments."
}
Assert-Equal -Name "prompt transport" -Actual $launch.PromptTransport -Expected "stdin"
Write-Host "[PASS] prompt text and '--check' remain outside argv"

$transportRoot = [IO.Path]::GetFullPath((Join-Path ([IO.Path]::GetTempPath()) ("pmp-claude-launcher-" + [Guid]::NewGuid().ToString("N"))))
$systemTemp = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
if (-not $transportRoot.StartsWith($systemTemp, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to create the launcher transport test outside the system temporary directory."
}
try {
    New-Item -ItemType Directory -Path $transportRoot | Out-Null
    $fakeClaude = Join-Path $transportRoot "fake-claude.cmd"
    [IO.File]::WriteAllText($fakeClaude, "@echo off`r`nmore`r`n")
    $transportSpec = [pscustomobject]@{
        Command = $fakeClaude
        Version = "test"
        PrintFlag = "--print"
        VersionFlag = "--version"
        ToolsFlag = "--tools"
        PromptTransport = "stdin"
    }
    $transportPrompt = "Transport this literal command: git diff --check"
    $transportResult = Invoke-ClaudePrompt -LaunchSpec $transportSpec -Prompt $transportPrompt
    $transportOutput = (($transportResult.Output | ForEach-Object { [string]$_ }) -join [Environment]::NewLine).Trim()
    Assert-Equal -Name "transport exit code" -Actual $transportResult.ExitCode -Expected 0
    Assert-Equal -Name "stdin prompt round trip" -Actual $transportOutput -Expected $transportPrompt
    Write-Host "[PASS] stdin transport preserves prompt option text"
}
finally {
    if (Test-Path -LiteralPath $transportRoot) {
        $resolvedTransportRoot = [IO.Path]::GetFullPath($transportRoot)
        if (-not $resolvedTransportRoot.StartsWith($systemTemp, [StringComparison]::OrdinalIgnoreCase)) {
            throw "Refusing to remove a launcher test directory outside the system temporary directory."
        }
        Remove-Item -LiteralPath $resolvedTransportRoot -Recurse -Force
    }
}

$probeLaunch = New-ClaudeLaunchCommand -LaunchSpec $modern -DisableTools
Assert-Equal -Name "probe argument count" -Actual @($probeLaunch.Arguments).Count -Expected 2
Assert-Equal -Name "probe tools argument" -Actual @($probeLaunch.Arguments)[1] -Expected "--tools="
Write-Host "[PASS] tool-disabled probe uses advertised flags only"

$allowedToolsLaunch = New-ClaudeLaunchCommand -LaunchSpec $modern -AllowedTools @("Bash(codex *)", "Edit(.ai/workflow/runs/feature/results/B01-result.json)")
Assert-Equal -Name "allowedTools argument count" -Actual @($allowedToolsLaunch.Arguments).Count -Expected 4
Assert-Equal -Name "allowedTools flag position" -Actual @($allowedToolsLaunch.Arguments)[1] -Expected "--allowedTools"
Assert-Equal -Name "allowedTools first entry" -Actual @($allowedToolsLaunch.Arguments)[2] -Expected "Bash(codex *)"
Assert-Equal -Name "allowedTools second entry" -Actual @($allowedToolsLaunch.Arguments)[3] -Expected "Edit(.ai/workflow/runs/feature/results/B01-result.json)"
Write-Host "[PASS] allowedTools are appended as a single flag with each entry as its own argument"

Assert-Throws -Name "unsupported Claude CLI fails closed" -ExpectedMessage "non-interactive print flag" -Action {
    $null = New-ClaudeLaunchSpec -Command "claude" -HelpText "Usage: claude [prompt]" -Version "unknown"
}

Write-Host "All Claude launcher construction tests passed."
