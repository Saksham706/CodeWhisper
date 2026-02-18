import express from "express";
import path from "path";
import { execInWorkspace } from "../sandbox/execService.js";
import { auth } from "../middleware/auth.js";
import { syncWorkspaceToDB } from "../services/syncService.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { workspaceId, command } = req.body;

    const workspacePath = path.join(
      process.cwd(),
      "workspaces",
      req.user.id,
      workspaceId
    );

    const result = await execInWorkspace({
      userId: req.user.id,
      workspaceId,
      workspacePath,
      command,
    });

    // 🔥 IMPORTANT: Sync filesystem → DB
    await syncWorkspaceToDB(req.user.id, workspaceId);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
