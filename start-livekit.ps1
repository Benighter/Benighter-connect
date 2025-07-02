# LiveKit Video Conferencing Startup Script
# This script starts the LiveKit Meet application

Write-Host "🚀 Starting LiveKit Video Conferencing Solution..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Navigate to the LiveKit Meet directory
if (Test-Path "livekit-meet") {
    Set-Location "livekit-meet"
    Write-Host "📁 Changed to livekit-meet directory" -ForegroundColor Yellow
} else {
    Write-Host "❌ livekit-meet directory not found!" -ForegroundColor Red
    exit 1
}

# Check if dependencies are installed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Check if .env.local exists
if (!(Test-Path ".env.local")) {
    Write-Host "⚙️ Creating environment configuration..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    
    # Update the .env.local with demo settings
    $envContent = @"
# LiveKit Meet Environment Configuration
# Using LiveKit Cloud demo server for quick setup

# REQUIRED SETTINGS
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
LIVEKIT_URL=wss://meet.livekit.io

# OPTIONAL SETTINGS
NEXT_PUBLIC_SHOW_SETTINGS_MENU=true
NEXT_PUBLIC_LK_RECORD_ENDPOINT=/api/record
"@
    
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ Environment configuration created" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎬 Starting LiveKit Meet application..." -ForegroundColor Cyan
Write-Host "📱 The app will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🛑 Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the development server
npm run dev
