import express from "express";
import path from "path";
import { execInWorkspace } from "../sandbox/execService.js";
import { detectProject } from "../projects/projectDetector.js";

const router = express.Router();

/**
 * POST /api/project/run
 * Body: { userId, projectName }
 */
router.post("/run", async (req, res) => {
  try {
    const { userId, projectName } = req.body;

    if (!userId || !projectName) {
      return res.status(400).json({
        error: "Missing userId or projectName",
      });
    }

    // 📁 Absolute workspace path
    const workspacePath = path.join(
      process.cwd(),
      "workspaces",
      userId,
      projectName
    );

    // 🔍 Auto-detect project
    const detected = detectProject(workspacePath);

    if (!detected) {
      return res.status(400).json({
        error: "No runnable project detected in workspace",
      });
    }

    // ▶️ Run detected project command
    await execInWorkspace({
      workspaceId: projectName,
      workspacePath,
      command: detected.run,
    });

    // 🌐 Send preview info (if any)
    res.json({
      success: true,
      previews: detected.preview
        ? [
            {
              name: detected.type,
              url: detected.preview,
            },
          ]
        : [],
    });
  } catch (err) {
    console.error("PROJECT RUN ERROR:", err);
    res.status(500).json({
      error: err.message || "Failed to run project",
    });
  }
});

export default router;
