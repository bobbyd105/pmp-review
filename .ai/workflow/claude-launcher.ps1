Set-StrictMode -Version Latest

function Select-ClaudeLaunchCommand {
    param(
        [Parameter(Mandatory = $true)][object[]]$Candidates,
        [bool]$IsWindows = ($env:OS -eq "Windows_NT")
    )

    if ($Candidates.Count -eq 0) {
        throw "Claude CLI command could not be resolved."
    }

    if ($IsWindows) {
        $applications = @($Candidates | Where-Object { [string]$_.CommandType -eq "Application" })
        $preferred = @($applications | Where-Object { [string]$_.Path -match '\.exe$' } | Select-Object -First 1)
        if ($preferred.Count -eq 0) {
            $preferred = @($applications | Where-Object { [string]$_.Path -match '\.cmd$' } | Select-Object -First 1)
        }
        if ($preferred.Count -eq 0) {
            $preferred = @($applications | Select-Object -First 1)
        }
        if ($preferred.Count -gt 0) {
            return [string]$preferred[0].Path
        }
    }

    $candidate = $Candidates | Select-Object -First 1
    $resolved = if ($candidate.Path) { [string]$candidate.Path } else { [string]$candidate.Source }
    if ([string]::IsNullOrWhiteSpace($resolved)) {
        throw "Claude CLI command resolved without an executable path."
    }
    return $resolved
}

function Resolve-ClaudeLaunchCommand {
    param([Parameter(Mandatory = $true)][string]$Command)

    $candidates = @(Get-Command $Command -All -ErrorAction Stop)
    return Select-ClaudeLaunchCommand -Candidates $candidates
}

function Test-ClaudeHelpFlag {
    param(
        [Parameter(Mandatory = $true)][string]$HelpText,
        [Parameter(Mandatory = $true)][string]$Flag
    )

    $escaped = [Regex]::Escape($Flag)
    return [Regex]::IsMatch($HelpText, "(?m)(?<![\w-])$escaped(?![\w-])")
}

function New-ClaudeLaunchSpec {
    param(
        [Parameter(Mandatory = $true)][string]$Command,
        [Parameter(Mandatory = $true)][string]$HelpText,
        [Parameter(Mandatory = $true)][string]$Version
    )

    $printFlag = if (Test-ClaudeHelpFlag -HelpText $HelpText -Flag "--print") {
        "--print"
    }
    elseif (Test-ClaudeHelpFlag -HelpText $HelpText -Flag "-p") {
        "-p"
    }
    else {
        throw "Claude CLI does not advertise a supported non-interactive print flag ('--print' or '-p')."
    }

    $versionFlag = if (Test-ClaudeHelpFlag -HelpText $HelpText -Flag "--version") {
        "--version"
    }
    elseif (Test-ClaudeHelpFlag -HelpText $HelpText -Flag "-v") {
        "-v"
    }
    else {
        throw "Claude CLI does not advertise a supported version flag ('--version' or '-v')."
    }

    $toolsFlag = if (Test-ClaudeHelpFlag -HelpText $HelpText -Flag "--tools") { "--tools" } else { $null }

    return [pscustomobject]@{
        Command = $Command
        Version = $Version
        PrintFlag = $printFlag
        VersionFlag = $versionFlag
        ToolsFlag = $toolsFlag
        PromptTransport = "stdin"
    }
}

function Get-ClaudeCliCapabilities {
    param([Parameter(Mandatory = $true)][string]$Command)

    $launchCommand = Resolve-ClaudeLaunchCommand -Command $Command
    $helpOutput = @(& $launchCommand --help 2>&1)
    $helpExitCode = $LASTEXITCODE
    if ($helpExitCode -ne 0) {
        throw "Unable to inspect Claude CLI capabilities; '$launchCommand --help' exited with code $helpExitCode."
    }
    $helpText = ($helpOutput | ForEach-Object { [string]$_ }) -join [Environment]::NewLine

    $unversioned = New-ClaudeLaunchSpec -Command $launchCommand -HelpText $helpText -Version "unresolved"
    $versionOutput = @(& $launchCommand $unversioned.VersionFlag 2>&1)
    $versionExitCode = $LASTEXITCODE
    if ($versionExitCode -ne 0) {
        throw "Unable to detect Claude CLI version; '$launchCommand $($unversioned.VersionFlag)' exited with code $versionExitCode."
    }
    $version = (($versionOutput | ForEach-Object { [string]$_ }) -join [Environment]::NewLine).Trim()
    if ([string]::IsNullOrWhiteSpace($version)) {
        throw "Claude CLI returned an empty version string."
    }

    return New-ClaudeLaunchSpec -Command $launchCommand -HelpText $helpText -Version $version
}

function New-ClaudeLaunchCommand {
    param(
        [Parameter(Mandatory = $true)]$LaunchSpec,
        [switch]$DisableTools
    )

    $arguments = @([string]$LaunchSpec.PrintFlag)
    if ($DisableTools) {
        if ([string]::IsNullOrWhiteSpace([string]$LaunchSpec.ToolsFlag)) {
            throw "Claude CLI does not advertise '--tools'; a tool-disabled prompt probe cannot run safely."
        }
        $arguments += @("$($LaunchSpec.ToolsFlag)=")
    }

    return [pscustomobject]@{
        Command = [string]$LaunchSpec.Command
        Arguments = $arguments
        PromptTransport = "stdin"
        Version = [string]$LaunchSpec.Version
    }
}

function Invoke-ClaudePrompt {
    param(
        [Parameter(Mandatory = $true)]$LaunchSpec,
        [Parameter(Mandatory = $true)][string]$Prompt,
        [switch]$DisableTools
    )

    $launch = New-ClaudeLaunchCommand -LaunchSpec $LaunchSpec -DisableTools:$DisableTools
    $arguments = @($launch.Arguments)
    $displayArguments = @($arguments | ForEach-Object { if ($_ -eq "") { '""' } else { $_ } }) -join " "
    Write-Host "> $($launch.Command) $displayArguments <prompt via stdin>"

    $output = @($Prompt | & $launch.Command @arguments 2>&1)
    $exitCode = $LASTEXITCODE
    return [pscustomobject]@{
        Command = $launch
        ExitCode = $exitCode
        Output = $output
    }
}
