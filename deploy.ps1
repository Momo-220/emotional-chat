#!/usr/bin/env pwsh

# Emotion Chat Deployment Script
Write-Host "🚀 Emotion Chat Deployment Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Function to check if command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Check prerequisites
Write-Host "`n🔍 Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "git")) {
    Write-Host "❌ Git not found. Please install Git." -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "dotnet")) {
    Write-Host "❌ .NET SDK not found. Please install .NET 8 SDK." -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js not found. Please install Node.js 18+." -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "python")) {
    Write-Host "❌ Python not found. Please install Python 3.10+." -ForegroundColor Red
    exit 1
}

Write-Host "✅ All prerequisites found!" -ForegroundColor Green

# Deployment options
Write-Host "`n📋 Deployment Options:" -ForegroundColor Cyan
Write-Host "1. Backend (Render)" -ForegroundColor White
Write-Host "2. Frontend (Vercel)" -ForegroundColor White
Write-Host "3. AI Service (Hugging Face Spaces)" -DesiredColor White
Write-Host "4. All Services" -ForegroundColor White
Write-Host "5. Local Testing" -ForegroundColor White

$choice = Read-Host "`nSelect deployment option (1-5)"

switch ($choice) {
    "1" {
        Write-Host "`n🖥️ Backend Deployment (Render)" -ForegroundColor Yellow
        Write-Host "1. Go to https://render.com" -ForegroundColor White
        Write-Host "2. Create new Web Service" -ForegroundColor White
        Write-Host "3. Connect your GitHub repository" -ForegroundColor White
        Write-Host "4. Use these settings:" -ForegroundColor White
        Write-Host "   - Build Command: cd backend && dotnet restore && dotnet publish -c Release -o ./publish" -ForegroundColor Gray
        Write-Host "   - Start Command: cd backend/publish && dotnet EmotionChat.API.dll" -ForegroundColor Gray
        Write-Host "   - Environment: .NET" -ForegroundColor Gray
        Write-Host "5. Add environment variables from DEPLOYMENT_GUIDE.md" -ForegroundColor White
    }
    
    "2" {
        Write-Host "`n🌐 Frontend Deployment (Vercel)" -ForegroundColor Yellow
        Write-Host "1. Go to https://vercel.com" -ForegroundColor White
        Write-Host "2. Create new project" -ForegroundColor White
        Write-Host "3. Connect your GitHub repository" -ForegroundColor White
        Write-Host "4. Use these settings:" -ForegroundColor White
        Write-Host "   - Framework: Create React App" -ForegroundColor Gray
        Write-Host "   - Build Command: npm run build" -ForegroundColor Gray
        Write-Host "   - Output Directory: build" -ForegroundColor Gray
        Write-Host "5. Add REACT_APP_API_URL environment variable" -ForegroundColor White
    }
    
    "3" {
        Write-Host "`n🤖 AI Service Deployment (Hugging Face Spaces)" -ForegroundColor Yellow
        Write-Host "1. Go to https://huggingface.co/spaces" -ForegroundColor White
        Write-Host "2. Create new Space" -ForegroundColor White
        Write-Host "3. Use these settings:" -ForegroundColor White
        Write-Host "   - SDK: Docker" -ForegroundColor Gray
        Write-Host "   - Hardware: CPU Basic" -ForegroundColor Gray
        Write-Host "4. Copy files from deployment/ai-service/ to your Space" -ForegroundColor White
        Write-Host "5. Commit and push to deploy" -ForegroundColor White
    }
    
    "4" {
        Write-Host "`n🚀 Full Deployment Guide" -ForegroundColor Yellow
        Write-Host "Follow the complete deployment guide:" -ForegroundColor White
        Write-Host "1. Deploy Backend to Render (see option 1)" -ForegroundColor Gray
        Write-Host "2. Deploy Frontend to Vercel (see option 2)" -ForegroundColor Gray
        Write-Host "3. Deploy AI Service to Hugging Face (see option 3)" -ForegroundColor Gray
        Write-Host "4. Update environment variables" -ForegroundColor Gray
        Write-Host "5. Test all services" -ForegroundColor Gray
        Write-Host "`n📖 For detailed instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
    }
    
    "5" {
        Write-Host "`n🧪 Local Testing" -ForegroundColor Yellow
        Write-Host "Starting local services for testing..." -ForegroundColor White
        
        # Test backend
        Write-Host "`nTesting Backend..." -ForegroundColor Cyan
        cd backend
        dotnet build
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Backend build successful" -ForegroundColor Green
        } else {
            Write-Host "❌ Backend build failed" -ForegroundColor Red
        }
        cd ..
        
        # Test frontend
        Write-Host "`nTesting Frontend..." -ForegroundColor Cyan
        cd frontend-web
        npm install
        npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Frontend build successful" -ForegroundColor Green
        } else {
            Write-Host "❌ Frontend build failed" -ForegroundColor Red
        }
        cd ..
        
        # Test AI service
        Write-Host "`nTesting AI Service..." -ForegroundColor Cyan
        cd ai-service
        if (Test-Path "venv") {
            .\venv\Scripts\Activate.ps1
            python -c "import fastapi; print('FastAPI available')"
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ AI Service dependencies OK" -ForegroundColor Green
            } else {
                Write-Host "❌ AI Service dependencies missing" -ForegroundColor Red
            }
        } else {
            Write-Host "⚠️ AI Service virtual environment not found" -ForegroundColor Yellow
        }
        cd ..
        
        Write-Host "`n🎉 Local testing complete!" -ForegroundColor Green
        Write-Host "Run .\start.ps1 to start all services locally" -ForegroundColor White
    }
    
    default {
        Write-Host "❌ Invalid option. Please select 1-5." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n📚 Additional Resources:" -ForegroundColor Cyan
Write-Host "- README.md: Complete documentation" -ForegroundColor White
Write-Host "- DEPLOYMENT_GUIDE.md: Detailed deployment instructions" -ForegroundColor White
Write-Host "- ARCHITECTURE_CLEAN.md: Architecture overview" -ForegroundColor White

Write-Host "`n🎉 Deployment preparation complete!" -ForegroundColor Green
