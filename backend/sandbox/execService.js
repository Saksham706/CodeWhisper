import { getOrCreateContainer } from "./containerManager.js";
import { touchContainer } from "./containerRegistry.js";

function buildKey(userId, workspaceId) {
  return `${userId}-${workspaceId}`;
}

export async function execInWorkspace({
  userId,
  workspaceId,
  workspacePath,
  command,
  detach = false,
}) {
  const key = buildKey(userId, workspaceId);

  const container = await getOrCreateContainer({
    workspaceKey: key,
    workspacePath,
  });

  touchContainer(key);

  const exec = await container.exec({
    Cmd: ["bash", "-lc", command],
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    WorkingDir: "/workspace",
  });

  const stream = await exec.start({ hijack: true, stdin: false });

  return new Promise((resolve, reject) => {
    let output = "";

    stream.on("data", (chunk) => {
      output += chunk.toString();
    });

    stream.on("end", () => {
      resolve({ output });
    });

    stream.on("error", reject);
  });
}
