import express from "express";
import cors from "cors";
import http from "http";
import path from "path";

import fileRoutes from "./routes/fileRoutes.js";
import executeRoutes from "./routes/executeRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import projectRunRoutes from "./routes/projectRun.js";

import { setupTerminalServer } from "./terminalServer.js";
import { startContainerReaper } from "./sandbox/containerReaper.js";

const app = express();

app.use(cors());
app.use(express.json());

startContainerReaper();

/* ================= API ROUTES ================= */

app.use("/api/files", fileRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/workspace", workspaceRoutes);

/* ✅ PHASE 3 PROJECT RUNNER ONLY */
app.use("/api/project", projectRunRoutes);

/* ================= STATIC PREVIEW ================= */

app.use("/preview/:userId/:workspaceId", (req, res, next) => {
  const { userId, workspaceId } = req.params;
  const wsPath = path.join(process.cwd(), "workspaces", userId, workspaceId);
  express.static(wsPath)(req, res, next);
});

/* ================= SERVER ================= */

const server = http.createServer(app);
setupTerminalServer(server);

server.listen(5000, () =>
  console.log("Backend running on http://localhost:5000")
);
export default app;