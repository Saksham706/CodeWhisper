import Docker from "dockerode";
import { getImageForWorkspace } from "./imageResolver.js";
import {
  registerContainer,
  getContainerEntry,
  touchContainer,
  removeContainer,
} from "./containerRegistry.js";

const docker = new Docker();

export async function getOrCreateContainer({ workspaceId, workspacePath }) {
  const existing = getContainerEntry(workspaceId);
  if (existing) {
    touchContainer(workspaceId);
    return existing.container;
  }

  const image = getImageForWorkspace();

  const container = await docker.createContainer({
    Image: image,
    Tty: true,
    OpenStdin: true,
    Cmd: ["bash"],
    WorkingDir: "/workspace",
    HostConfig: {
      Binds: [`${workspacePath}:/workspace`],
      Memory: 1024 * 1024 * 1024,
      CpuShares: 512,
      PidsLimit: 256,
    },
  });

  await container.start();
  registerContainer(workspaceId, container);

  return container;
}

export async function stopAndRemoveContainer(workspaceId) {
  const entry = getContainerEntry(workspaceId);
  if (!entry) return;

  try { await entry.container.stop({ t: 5 }); } catch {}
  try { await entry.container.remove({ force: true }); } catch {}

  removeContainer(workspaceId);
}
