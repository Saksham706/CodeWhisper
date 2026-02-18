import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import path from "path";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import executeRoutes from "./routes/executeRoutes.js";
import runRoutes from "./routes/runRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

import { setupTerminalServer } from "./terminalServer.js";
import { startContainerReaper } from "./sandbox/containerReaper.js";

const app = express();

/* ================= CORS (FIXED) ================= */

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);

app.use(express.json());

/* ================= INIT ================= */

connectDB();
startContainerReaper();

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/run", runRoutes);
app.use(
  "/preview",
  express.static(
    path.join(process.cwd(), "workspaces"),
    { extensions: ["html"] }
  )
);


app.use("/api/stats", statsRoutes);


/* ================= SERVER ================= */

const server = http.createServer(app);
setupTerminalServer(server);

server.listen(5000, () =>
  console.log("Backend running on http://localhost:5000")
);
