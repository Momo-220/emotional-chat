#!/usr/bin/env pwsh

# Simple setup script for Emotion Chat
Write-Host "🔧 Setting up Emotion Chat..." -ForegroundColor Cyan

# Check prerequisites
Write-Host "`nChecking prerequisites..." -ForegroundColor Yellow

# Check .NET
try {
    $dotnetVersion = dotnet --version
    Write-Host "✅ .NET: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ .NET not found. Please install .NET 8 SDK" -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check Python
try {
    $pythonVersion = python --version
    Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.10+" -ForegroundColor Red
    exit 1
}

# Setup Backend
Write-Host "`nSetting up Backend..." -ForegroundColor Yellow
cd backend
dotnet restore
Write-Host "✅ Backend setup complete" -ForegroundColor Green

# Setup Frontend
Write-Host "`nSetting up Frontend..." -ForegroundColor Yellow
cd ../frontend-web
npm install
Write-Host "✅ Frontend setup complete" -ForegroundColor Green

# Setup AI Service
Write-Host "`nSetting up AI Service..." -ForegroundColor Yellow
cd ../ai-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Write-Host "✅ AI Service setup complete" -ForegroundColor Green

cd ..

Write-Host "`n🎉 Setup complete!" -ForegroundColor Green
Write-Host "`nTo start the application, run:" -ForegroundColor Cyan
Write-Host "   .\start.ps1" -ForegroundColor White
