diff --git a/README.md b/README.md
index f5125474481528bb672b2cb4ccf0a59da5ad3f72..455b632bceebb0b57fcb22173439f652bae966b5 100644
--- a/README.md
+++ b/README.md
@@ -1,2 +1,76 @@
-# NeuroCode.AI
-To create an AI-powered, voice-driven coding platform that allows complete hands-free programming with real-time code execution and project management.
+# NeuroCode.AI 🤖🎙️
+
+NeuroCode.AI is a voice-driven, AI-assisted coding workspace that pairs a web-based IDE with a Node.js execution backend. The platform is designed for hands-free programming, real-time code execution, and project management workflows.
+
+## Features ✨
+
+- **Voice-first workflow** for controlling the coding environment.
+- **Web-based IDE** powered by React, Monaco, and xterm.js.
+- **Execution backend** built with Express and Docker tooling for running code.
+- **Workspace management** for project files and terminals.
+
+## Project Structure 🧭
+
+```
+.
+├── backend/   # Express API, terminal, sandbox, and workspace services
+└── frontend/  # Vite + React client UI
+```
+
+## Prerequisites ✅
+
+- Node.js (see `backend/package.json` and `frontend/package.json` for supported versions)
+- npm
+- Docker (required by the backend sandbox services)
+
+## Getting Started 🚀
+
+### 1. Install dependencies
+
+```bash
+cd backend
+npm install
+
+cd ../frontend
+npm install
+```
+
+### 2. Run the backend
+
+```bash
+cd backend
+npm run start
+```
+
+### 3. Run the frontend
+
+```bash
+cd frontend
+npm run dev
+```
+
+### 4. Open the app
+
+Visit the Vite dev server URL shown in the terminal output (typically `http://localhost:5173`).
+
+## Available Scripts 🛠️
+
+### Backend
+
+- `npm run start` — starts the backend with Nodemon.
+
+### Frontend
+
+- `npm run dev` — starts the Vite dev server.
+- `npm run build` — builds the production bundle.
+- `npm run preview` — previews the production build.
+- `npm run lint` — runs ESLint.
+
+## Notes 📌
+
+- The backend integrates with Docker for execution and sandboxed environments. Ensure Docker is installed and running before starting backend services that rely on containers.
+- This repository contains a Vite + React UI with Monaco Editor and xterm.js for terminal access.
+
+## License 📄
+
+[MIT](LICENSE)
