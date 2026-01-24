import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import fileRoutes from "./routes/fileRoutes.js";
import executeRoutes from "./routes/executeRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import processRoutes from "./routes/processRoutes.js";
import { setupTerminalServer } from "./terminalServer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- API ROUTES ---------------- */

app.use("/api/files", fileRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/process", processRoutes);
/* ---------------- STATIC WEB PREVIEW ---------------- */
/*
  Allows:
  http://localhost:5000/preview/index.html
  http://localhost:5000/preview/style.css
  http://localhost:5000/preview/script.js
*/
app.use(
  "/preview",
  express.static(path.join(__dirname, "workspace", "default"))
);

/* ---------------- SERVER + TERMINAL ---------------- */

const server = http.createServer(app);

// WebSocket terminal (node-pty)
setupTerminalServer(server);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
