#!/usr/bin/env pwsh

# Simple startup script for Emotion Chat
Write-Host "🚀 Starting Emotion Chat Application..." -ForegroundColor Cyan

# Function to start a service
function Start-Service {
    param($Name, $Path, $Command)
    
    Write-Host "Starting $Name..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Path'; $Command"
    Start-Sleep -Seconds 2
}

# Start AI Service
Start-Service -Name "AI Service" -Path "ai-service" -Command ".\venv\Scripts\Activate.ps1; python main-advanced.py"

# Start Backend
Start-Service -Name "Backend API" -Path "backend" -Command "dotnet run"

# Start Frontend
Start-Service -Name "Frontend Web" -Path "frontend-web" -Command "npm start"

Write-Host "`n✅ All services started!" -ForegroundColor Green
Write-Host "`n📱 Access the application:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   AI Service: http://localhost:8000" -ForegroundColor White
Write-Host "`nPress Ctrl+C to stop all services" -ForegroundColor Yellow
