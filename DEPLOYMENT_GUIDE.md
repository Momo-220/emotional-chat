# 🚀 Deployment Guide - Emotion Chat

## 📋 Overview

This guide provides step-by-step instructions for deploying Emotion Chat to production using free cloud services.

## 🎯 Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   AI Service    │
│   (Vercel)      │───▶│   (Render)      │───▶│ (Hugging Face)  │
│   React.js      │    │   .NET Core     │    │   FastAPI       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Database      │
                       │  (PostgreSQL)   │
                       │   (Render)      │
                       └─────────────────┘
```

## 🖥️ Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your repository

### Step 2: Create Database
1. Click **"New +"** → **"PostgreSQL"**
2. Configure database:
   ```yaml
   Name: emotionchat-db
   Database: emotionchat
   User: postgres
   Plan: Free
   ```
3. **Save** and note the connection string

### Step 3: Deploy Backend Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure service:
   ```yaml
   Name: emotion-chat-api
   Environment: .NET
   Build Command: cd backend && dotnet restore && dotnet publish -c Release -o ./publish
   Start Command: cd backend/publish && dotnet EmotionChat.API.dll
   Plan: Free
   ```

### Step 4: Environment Variables
Add these environment variables in Render dashboard:
```bash
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=postgresql://postgres:password@dpg-xxxxx-a.oregon-postgres.render.com/emotionchat
HuggingFaceUrl=https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english
HuggingFaceToken=your-hugging-face-token-here
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Note the service URL (e.g., `https://emotion-chat-api.onrender.com`)

## 🌐 Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Connect your repository

### Step 2: Deploy Frontend
1. Click **"New Project"**
2. Import your GitHub repository
3. Configure build settings:
   ```json
   Framework Preset: Create React App
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

### Step 3: Environment Variables
Add environment variable:
```bash
REACT_APP_API_URL=https://your-api.onrender.com
```

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Note the frontend URL (e.g., `https://emotion-chat.vercel.app`)

## 🤖 AI Service Deployment (Hugging Face Spaces)

### Step 1: Create Hugging Face Account
1. Go to [huggingface.co](https://huggingface.co)
2. Sign up and verify email
3. Go to [Hugging Face Spaces](https://huggingface.co/spaces)

### Step 2: Create New Space
1. Click **"Create new Space"**
2. Configure space:
   ```yaml
   Space name: emotion-chat-ai
   License: MIT
   SDK: Docker
   Hardware: CPU Basic
   Visibility: Public
   ```

### Step 3: Add Files
Create these files in your Space:

**`Dockerfile`**
```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY main-advanced.py .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main-advanced:app", "--host", "0.0.0.0", "--port", "8000"]
```

**`requirements.txt`**
```txt
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
requests==2.31.0
```

**`main-advanced.py`** (copy from your project)

### Step 4: Deploy
1. Commit and push files to the Space
2. Wait for automatic deployment (3-5 minutes)
3. Note the Space URL (e.g., `https://huggingface.co/spaces/yourusername/emotion-chat-ai`)

## 🔧 Final Configuration

### Step 1: Update Backend Configuration
1. Go to Render dashboard
2. Update environment variable:
   ```bash
   HuggingFaceUrl=https://your-ai-service-url.hf.space
   ```

### Step 2: Update Frontend Configuration
1. Go to Vercel dashboard
2. Update environment variable:
   ```bash
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

### Step 3: Redeploy Services
1. **Backend**: Redeploy from Render dashboard
2. **Frontend**: Redeploy from Vercel dashboard

## 🧪 Testing Deployment

### Test Backend API
```bash
curl https://your-api.onrender.com/api/health
```

### Test AI Service
```bash
curl https://your-ai-service.hf.space/health
```

### Test Frontend
1. Open your frontend URL
2. Create a user account
3. Send test messages
4. Verify sentiment analysis works

## 📊 Monitoring

### Render Monitoring
- **Logs**: Available in Render dashboard
- **Metrics**: CPU, memory, and request metrics
- **Health**: Automatic health checks

### Vercel Monitoring
- **Analytics**: Built-in analytics dashboard
- **Performance**: Core Web Vitals monitoring
- **Functions**: Serverless function logs

### Hugging Face Monitoring
- **Logs**: Available in Space logs
- **Usage**: API usage statistics
- **Performance**: Response time metrics

## 🔒 Security Considerations

### Environment Variables
- Never commit sensitive data to repository
- Use environment variables for all secrets
- Rotate tokens regularly

### HTTPS
- All services use HTTPS by default
- No additional SSL configuration needed

### CORS
- Backend CORS configured for production domains
- Update CORS policy if needed

## 🚨 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check logs in Render dashboard
# Verify environment variables
# Check database connection
```

#### Frontend Build Fails
```bash
# Check Vercel build logs
# Verify Node.js version
# Check for missing dependencies
```

#### AI Service Errors
```bash
# Check Hugging Face Space logs
# Verify Python dependencies
# Check model loading
```

### Performance Issues

#### Slow Response Times
- Check Render service logs
- Monitor database performance
- Optimize AI service calls

#### High Memory Usage
- Monitor Render metrics
- Optimize .NET application
- Check for memory leaks

## 📈 Scaling

### Backend Scaling
- Upgrade Render plan for more resources
- Add Redis caching
- Implement connection pooling

### Frontend Scaling
- Vercel automatically scales
- Add CDN for static assets
- Implement service worker caching

### AI Service Scaling
- Upgrade Hugging Face hardware
- Implement request queuing
- Add response caching

## 💰 Cost Estimation

### Free Tier Limits
- **Render**: 750 hours/month free
- **Vercel**: Unlimited static hosting
- **Hugging Face**: Basic CPU free

### Upgrade Costs
- **Render**: $7/month for always-on
- **Vercel**: $20/month for Pro
- **Hugging Face**: $0.06/hour for GPU

## 🎉 Success!

Your Emotion Chat application is now deployed and ready for production use!

### Access URLs
- **Frontend**: https://your-frontend.vercel.app
- **Backend**: https://your-backend.onrender.com
- **AI Service**: https://your-ai-service.hf.space

### Next Steps
1. Set up custom domain (optional)
2. Configure monitoring alerts
3. Set up automated backups
4. Implement CI/CD pipeline
