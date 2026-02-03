import express from "express";
import path from "path";
import { execInWorkspace } from "../sandbox/execService.js";
import { ensureProjectServices, loadProject } from "../projects/projectManager.js";

const router = express.Router();

router.post("/run", async (req, res) => {
  const { userId, projectName } = req.body;

  const project = ensureProjectServices(userId, projectName);

  for (const service of project.services) {
    const workspacePath = path.join(
      "workspaces",
      userId,
      projectName,
      service.path
    );

    execInWorkspace({
      workspaceId: `${projectName}-${service.name}`,
      workspacePath,
      command: service.run,
    });
  }

  res.json({ success: true });
});

export default router;
