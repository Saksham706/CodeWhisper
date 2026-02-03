import fs from "fs";
import path from "path";

export const setWorkspaceType = (req, res) => {
  const { userId, workspaceId, type } = req.body;

  const wsPath = path.join(
    process.cwd(),
    "workspaces",
    userId,
    workspaceId
  );

  const metaPath = path.join(wsPath, ".workspace.json");

  fs.writeFileSync(
    metaPath,
    JSON.stringify({ type }, null, 2)
  );

  res.json({ success: true });
};
