import express from "express";
import path from "path";
import { execInWorkspace } from "../sandbox/execService.js";
import { detectProject } from "../projects/projectDetector.js";
import { auth } from "../middleware/auth.js";
import { syncWorkspaceToDB } from "../services/syncService.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { workspaceId } = req.body;

    if (!workspaceId) {
      return res.status(400).json({
        error: "workspaceId is required",
      });
    }

    const workspacePath = path.join(
      process.cwd(),
      "workspaces",
      req.user.id,
      workspaceId
    );

    const detected = detectProject(workspacePath);

    if (!detected) {
      return res.status(400).json({
        error: "No runnable project detected",
      });
    }

    const result = await execInWorkspace({
      userId: req.user.id,
      workspaceId,
      workspacePath,
      command: detected.run,
    });

    // 🔥 Sync filesystem changes (npm install, etc.)
    await syncWorkspaceToDB(req.user.id, workspaceId);

    res.json({
      success: true,
      output: result.output || "",
      preview: detected.port
        ? `http://localhost:${detected.port}`
        : null,
    });

  } catch (err) {
    console.error("RUN PROJECT ERROR:", err);
    res.status(500).json({
      error: "Failed to run project",
    });
  }
});

export default router;
