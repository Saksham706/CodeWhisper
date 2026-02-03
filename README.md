# NeuroCode.AI 🤖🎙️

NeuroCode.AI is a revolutionary voice-driven, AI-assisted coding workspace that combines a web-based IDE with a secure Node.js execution backend. Designed for hands-free programming, it enables real-time code execution, project management, and seamless workflow control through voice commands.

## ✨ Features

- **Voice-first coding** - Control your entire coding environment with natural voice commands
- **Web-based IDE** - Powered by React, Monaco Editor, and xterm.js terminal
- **Secure execution** - Docker sandboxed environments for safe code execution
- **Real-time collaboration** - Workspace management and project synchronization
- **AI assistance** - Intelligent code suggestions and voice-driven automation

## 🧭 Project Structure

.
├── backend/ # Express API, Docker sandbox, terminal services
│ ├── src/ # Core backend logic
│ ├── package.json # Backend dependencies
│ └── docker/ # Container configurations
└── frontend/ # Vite + React + TypeScript client
├── src/ # React components and hooks
├── public/ # Static assets
└── package.json # Frontend dependencies

text

## 📋 Prerequisites

- **Node.js** v18+ (check `package.json` for exact versions)
- **npm** or **yarn**
- **Docker** (required for sandboxed code execution)
- **Git** for version control

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd NeuroCode.AI
2. Backend Setup
bash
cd backend
npm install
npm run start
3. Frontend Setup
bash
cd ../frontend
npm install
npm run dev
4. Open the App
Visit http://localhost:5173 (or the URL shown in your terminal)

🛠️ Development Scripts
Backend
bash
npm run start      # Start with nodemon (development)
npm run build      # Build for production
npm run test       # Run tests
npm run lint       # Lint code
Frontend
text
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
🔌 Architecture Overview
text
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │◄──►│   Express API    │◄──►│  Docker Sandbox │
│  (React/Vite)   │    │  (Node.js)       │    │   Containers    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                     │                        │
    Voice Commands      WebSocket       Secure Code    Isolated Env
         │              Connections      Execution
⚙️ Environment Variables


🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing-feature)

Open Pull Request

📄 License
This project is MIT licensed.

🚀 Roadmap
 Real-time multiplayer coding sessions

 Advanced AI code completion

 Plugin marketplace

 Mobile voice interface

 Cloud deployment templates
