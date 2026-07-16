Set-StrictMode -Version Latest

$script:ControllerRuntimePathPattern = '^\.ai/workflow/(?:current-state|master-plan)[^/]*\.json$'

function Get-GitStatusEntries {
    $rawOutput = @(& git status --porcelain=v1 -z --untracked-files=all)
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to read Git working tree status."
    }

    $rawStatus = $rawOutput -join ""
    if ([string]::IsNullOrEmpty($rawStatus)) {
        return @()
    }

    $fields = @($rawStatus.Split([char[]]@([char]0), [StringSplitOptions]::RemoveEmptyEntries))
    $entries = @()
    for ($index = 0; $index -lt $fields.Count; $index++) {
        $field = [string]$fields[$index]
        if ($field.Length -lt 4 -or $field[2] -ne ' ') {
            throw "Unable to parse git status --porcelain output safely."
        }

        $status = $field.Substring(0, 2)
        $path = $field.Substring(3).Replace("\", "/")
        if ([string]::IsNullOrWhiteSpace($path)) {
            throw "Git status returned an empty repository path."
        }

        $originalPath = $null
        if ($status.Contains("R") -or $status.Contains("C")) {
            $index++
            if ($index -ge $fields.Count) {
                throw "Git status returned an incomplete rename or copy entry."
            }
            $originalPath = ([string]$fields[$index]).Replace("\", "/")
        }

        $entries += [pscustomobject]@{
            Status = $status
            Path = $path
            OriginalPath = $originalPath
        }
    }

    return @($entries)
}

function Test-IsControllerRuntimePath {
    param([Parameter(Mandatory = $true)][string]$Path)

    return $Path.Replace("\", "/") -match $script:ControllerRuntimePathPattern
}

function Get-GitCleanlinessSnapshot {
    $entries = @(Get-GitStatusEntries)
    $runtimeEntries = @($entries | Where-Object { Test-IsControllerRuntimePath -Path $_.Path })
    $blockingEntries = @($entries | Where-Object { -not (Test-IsControllerRuntimePath -Path $_.Path) })

    return [pscustomobject]@{
        IsClean = $blockingEntries.Count -eq 0
        BlockingEntries = $blockingEntries
        RuntimeEntries = $runtimeEntries
    }
}

function Get-ChangedPaths {
    $snapshot = Get-GitCleanlinessSnapshot
    return @($snapshot.BlockingEntries | ForEach-Object { $_.Path } | Sort-Object -Unique)
}

function Assert-CleanStart {
    $snapshot = Get-GitCleanlinessSnapshot
    if (-not $snapshot.IsClean) {
        $dirty = @($snapshot.BlockingEntries | ForEach-Object { $_.Path } | Sort-Object -Unique)
        throw "Workflow must start from a clean working tree. Uncommitted paths: $($dirty -join ', ')"
    }
}
