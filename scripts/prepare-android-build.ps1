# Creates a fresh physical ASCII build copy; never moves/deletes the workspace.
param(
    [string]$Destination = (Join-Path $env:USERPROFILE 'crypto-alert-android')
)

$sourceRoot = Split-Path -Parent $PSScriptRoot
$buildRoot = [System.IO.Path]::GetFullPath($Destination)
if ($buildRoot -match '[^\x00-\x7F]') { throw 'Choose a destination without accented/non-ASCII characters.' }
if ($buildRoot.StartsWith($sourceRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'The build copy must be outside the source workspace.'
}
if (Test-Path -LiteralPath $buildRoot) { throw 'Destination already exists. Choose a new directory; nothing was overwritten.' }

# Keep the source toolchain active after changing to the build copy.
. (Join-Path $PSScriptRoot 'android-env.ps1')
New-Item -ItemType Directory -Path $buildRoot -ErrorAction Stop | Out-Null
& robocopy $sourceRoot $buildRoot /E /XD .git node_modules .android-tools .expo coverage android ios /XF '.env*' /R:1 /W:1 /NFL /NDL /NJH /NJS /NP
if ($LASTEXITCODE -gt 7) { throw "Robocopy failed with exit code $LASTEXITCODE" }
Set-Location -LiteralPath $buildRoot
Write-Host "Physical build copy ready at $buildRoot"
Write-Host 'Next: npm ci; npx expo prebuild --platform android; npx expo run:android'
