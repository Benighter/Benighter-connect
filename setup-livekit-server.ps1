# LiveKit Server Setup Script for Windows
# This script downloads and sets up a local LiveKit server

Write-Host "🚀 Setting up LiveKit Server..." -ForegroundColor Green

# Create server directory
$serverDir = "livekit-server"
if (!(Test-Path $serverDir)) {
    New-Item -ItemType Directory -Path $serverDir
    Write-Host "📁 Created server directory" -ForegroundColor Yellow
}

Set-Location $serverDir

# Download LiveKit server binary for Windows
$downloadUrl = "https://github.com/livekit/livekit/releases/download/v1.9.0/livekit_1.9.0_windows_amd64.tar.gz"
$fileName = "livekit-server.tar.gz"

Write-Host "📥 Downloading LiveKit server..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $downloadUrl -OutFile $fileName -UseBasicParsing
    Write-Host "✅ Download completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Download failed. Trying alternative method..." -ForegroundColor Red
    
    # Try using curl if available
    try {
        curl -L -o $fileName $downloadUrl
        Write-Host "✅ Download completed with curl" -ForegroundColor Green
    } catch {
        Write-Host "❌ Could not download LiveKit server" -ForegroundColor Red
        Write-Host "Please download manually from: https://github.com/livekit/livekit/releases" -ForegroundColor Yellow
        exit 1
    }
}

# Extract the archive (requires tar or 7-zip)
Write-Host "📦 Extracting server..." -ForegroundColor Yellow
try {
    tar -xzf $fileName
    Write-Host "✅ Extraction completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Extraction failed. Please extract manually." -ForegroundColor Red
    Write-Host "You can use 7-Zip or WinRAR to extract the .tar.gz file" -ForegroundColor Yellow
}

# Create configuration file
$configContent = @"
port: 7880
rtc:
  tcp_port: 7881
  port_range_start: 50000
  port_range_end: 60000
  use_external_ip: false
redis:
  address: localhost:6379
turn:
  enabled: false
keys:
  devkey: secret
development: true
log_level: info
"@

$configContent | Out-File -FilePath "livekit.yaml" -Encoding UTF8
Write-Host "⚙️ Configuration file created" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 LiveKit server setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the server:" -ForegroundColor Cyan
Write-Host "  cd livekit-server" -ForegroundColor White
Write-Host "  ./livekit-server --config livekit.yaml" -ForegroundColor White
Write-Host ""
Write-Host "The server will run on:" -ForegroundColor Cyan
Write-Host "  WebSocket: ws://localhost:7880" -ForegroundColor White
Write-Host "  RTC: localhost:7881" -ForegroundColor White

Set-Location ..
