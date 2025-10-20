# 🏗️ Clean Architecture - Emotion Chat

## 📁 **Project Structure**

```
emontional chat/
├── 📁 ai-service/              # Python FastAPI AI Service
│   ├── 🐍 main-advanced.py     # Main AI application
│   ├── 📋 requirements.txt     # Python dependencies
│   ├── 🐳 Dockerfile          # Docker configuration
│   └── 📁 venv/               # Python virtual environment
│
├── 📁 backend/                 # .NET Core 8 API
│   ├── 🎯 Program.cs          # Application entry point
│   ├── 📁 Controllers/        # API controllers
│   │   ├── MessagesController.cs
│   │   ├── UsersController.cs
│   │   ├── AnalysisController.cs
│   │   └── HealthController.cs
│   ├── 📁 Models/             # Data models
│   │   ├── Message.cs
│   │   ├── User.cs
│   │   └── 📁 DTOs/
│   ├── 📁 Services/           # Business logic
│   ├── 📁 Data/               # Database context
│   ├── 🐳 Dockerfile
│   └── 📊 emotionchat.db      # SQLite database
│
├── 📁 frontend-web/           # React.js Web Application
│   ├── ⚛️ src/
│   │   ├── App.tsx
│   │   ├── 📁 components/     # UI components
│   │   ├── 📁 hooks/          # Custom React hooks
│   │   ├── 📁 services/       # API services
│   │   └── 📁 types/          # TypeScript types
│   ├── 🐳 Dockerfile
│   └── 📋 package.json
│
├── 📁 frontend-mobile/        # React Native Mobile App
│   ├── ⚛️ src/
│   │   ├── 📁 screens/        # Mobile screens
│   │   ├── 📁 components/     # Mobile components
│   │   ├── 📁 hooks/          # Custom hooks
│   │   ├── 📁 services/       # API services
│   │   └── 📁 types/          # TypeScript types
│   └── 📋 package.json
│
├── 📁 deployment/             # Deployment configurations
│   ├── 🐳 docker-compose.yml
│   ├── ⚙️ render.yaml
│   └── ⚙️ vercel.json
│
├── 🐳 docker-compose.yml      # Local development
├── 📋 setup.ps1              # Setup script
├── 🚀 start.ps1              # Startup script
└── 📖 README.md              # Documentation
```

## 🎯 **Core Components**

### **AI Service (Python)**
- **Purpose**: Emotion analysis using FastAPI
- **Port**: 8000
- **Features**: Real-time sentiment analysis
- **Dependencies**: FastAPI, Transformers, PyTorch

### **Backend API (.NET Core)**
- **Purpose**: REST API for chat functionality
- **Port**: 5000
- **Features**: User management, message handling, AI integration
- **Database**: SQLite (dev) / PostgreSQL (prod)

### **Frontend Web (React.js)**
- **Purpose**: Web chat interface
- **Port**: 3000
- **Features**: Real-time chat, user switching, responsive UI
- **Tech**: TypeScript, TailwindCSS, React Query

### **Frontend Mobile (React Native)**
- **Purpose**: Mobile chat application
- **Features**: Native mobile experience, offline support
- **Tech**: TypeScript, React Native, AsyncStorage

## 🚀 **Quick Start**

### **Setup**
```powershell
.\setup.ps1
```

### **Start All Services**
```powershell
.\start.ps1
```

### **Access Points**
- **Web App**: http://localhost:3000
- **API**: http://localhost:5000
- **AI Service**: http://localhost:8000

## ✨ **Key Features**

### **Real-time Chat**
- Instant message delivery
- Live sentiment analysis
- User presence indicators

### **Active User Switching**
- Switch between user identities
- Visual user status indicators
- Persistent user sessions

### **Multi-platform Support**
- Web application (React.js)
- Mobile application (React Native)
- Responsive design

### **AI Integration**
- Emotion analysis for each message
- Confidence scoring
- Multiple sentiment categories

## 🛠️ **Development**

### **Backend Development**
```powershell
cd backend
dotnet run
```

### **Frontend Web Development**
```powershell
cd frontend-web
npm start
```

### **AI Service Development**
```powershell
cd ai-service
.\venv\Scripts\Activate.ps1
python main-advanced.py
```

## 📦 **Dependencies**

### **Backend**
- .NET Core 8
- Entity Framework Core
- Swagger/OpenAPI

### **Frontend Web**
- React 18
- TypeScript
- TailwindCSS
- React Query

### **Frontend Mobile**
- React Native
- TypeScript
- AsyncStorage

### **AI Service**
- Python 3.10+
- FastAPI
- Transformers
- PyTorch

## 🚀 **Deployment**

### **Production Deployment**
- **Backend**: Render (PostgreSQL)
- **Frontend**: Vercel
- **AI Service**: Hugging Face Spaces

### **Docker Deployment**
```powershell
docker-compose up
```

## 📊 **Architecture Benefits**

### **Clean Structure**
- ✅ Minimal files and folders
- ✅ Clear separation of concerns
- ✅ Easy to navigate and maintain

### **Scalability**
- ✅ Microservices architecture
- ✅ Independent service deployment
- ✅ Horizontal scaling support

### **Developer Experience**
- ✅ Simple setup process
- ✅ Clear documentation
- ✅ Consistent code structure

### **Production Ready**
- ✅ Docker containerization
- ✅ Environment configurations
- ✅ Deployment automation

## 🎉 **Summary**

The Emotion Chat application now has a clean, minimal architecture with:
- **7 core folders** (down from 10+)
- **Essential files only** (removed 15+ documentation files)
- **Simple setup** (2 scripts instead of 8+)
- **Clear structure** (easy to understand and maintain)

**The application is now production-ready with a professional, clean architecture!** 🚀
