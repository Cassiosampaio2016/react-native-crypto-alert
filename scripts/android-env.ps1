# Dot-source this script before running Expo commands:
# . .\scripts\android-env.ps1
param(
    [string]$JdkHome,
    [string]$SdkHome,
    [string]$NodeHome
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$toolsRoot = Join-Path $projectRoot '.android-tools'

# Native Node/Android tools can corrupt non-ASCII paths on Windows.
# SUBST exposes the same files without moving or copying the workspace.
if ($projectRoot -match '[^\x00-\x7F]') {
    $drive = 'S:'
    $mappedRoot = Split-Path -Parent $projectRoot
    if (Test-Path "$drive\") {
        & node -e "const fs = require('fs'); process.exit(fs.realpathSync.native(process.argv[1]).toLowerCase() === fs.realpathSync.native(process.argv[2]).toLowerCase() ? 0 : 1)" "$drive\" $mappedRoot
        if ($LASTEXITCODE -ne 0) {
            throw 'S: is already in use by another location. Choose a free drive before mapping the workspace.'
        }
    } else {
        & subst $drive $mappedRoot
        if ($LASTEXITCODE -ne 0) { throw 'Could not map the workspace to S:.' }
    }
    Set-Location (Join-Path "$drive\" (Split-Path -Leaf $projectRoot))
    Write-Host 'Workspace available under S: (the original files stay in place).'
}

if (-not $JdkHome) {
    $portableJdk = Get-ChildItem -LiteralPath $toolsRoot -Directory -Filter 'jdk-17*' -ErrorAction SilentlyContinue |
        Select-Object -First 1
    $JdkHome = if ($portableJdk) { $portableJdk.FullName } else { $env:JAVA_HOME }
}
if (-not $JdkHome -or -not (Test-Path -LiteralPath (Join-Path $JdkHome 'bin\javac.exe'))) {
    throw 'JDK 17 not found. Pass -JdkHome with the path to a JDK 17 installation.'
}
$javaVersion = (& (Join-Path $JdkHome 'bin\javac.exe') -version 2>&1 | Out-String).Trim()
if ($javaVersion -notmatch 'javac 17\.') {
    throw "Use JDK 17 for this project. Found: $javaVersion"
}

if (-not $SdkHome) {
    $SdkHome = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
}
if (-not (Test-Path -LiteralPath (Join-Path $SdkHome 'platform-tools\adb.exe'))) {
    throw 'Android SDK not found. Pass -SdkHome with its installation path.'
}
if (-not $NodeHome) {
    $portableNode = Get-ChildItem -LiteralPath $toolsRoot -Directory -Filter 'node-v22*' -ErrorAction SilentlyContinue |
        Sort-Object Name -Descending | Select-Object -First 1
    if ($portableNode) { $NodeHome = $portableNode.FullName }
}
if ($NodeHome -and -not (Test-Path -LiteralPath (Join-Path $NodeHome 'node.exe'))) {
    throw 'Node executable not found at -NodeHome.'
}

$env:JAVA_HOME = $JdkHome
$env:ANDROID_HOME = $SdkHome
$env:PATH = "$JdkHome\bin;$SdkHome\platform-tools;$env:PATH"
if ($NodeHome) { $env:PATH = "$NodeHome;$env:PATH" }
$maestroBin = Join-Path $toolsRoot 'maestro-cli\maestro\bin'
if (Test-Path -LiteralPath (Join-Path $maestroBin 'maestro.bat')) {
    $env:PATH = "$maestroBin;$env:PATH"
}
# Gradle's Node subprocesses emit UTF-8 paths, including accented directory names.
if ($env:JAVA_TOOL_OPTIONS -notmatch '(?:^|\s)-Dfile.encoding=') {
    $env:JAVA_TOOL_OPTIONS = "$env:JAVA_TOOL_OPTIONS -Dfile.encoding=UTF-8".Trim()
}
Write-Host "Android environment ready: $javaVersion; Node $(& node --version)"
Write-Host "SDK: $SdkHome"
