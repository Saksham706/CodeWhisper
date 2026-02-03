import { getOrCreateContainer } from "./containerManager.js";

export async function execInWorkspace({
  workspaceId,
  workspacePath,
  command,
}) {
  const container = await getOrCreateContainer({
    workspaceId,
    workspacePath,
  });

  const exec = await container.exec({
    Cmd: ["bash", "-lc", command],
    AttachStdout: true,
    AttachStderr: true,
    WorkingDir: "/workspace",
  });

  return await exec.start({ hijack: true });
}
