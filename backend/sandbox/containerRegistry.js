const containers = new Map();
/*
  workspaceId -> {
    container,
    lastUsed: number,
    type: string
  }
*/

export function registerContainer(workspaceId, container, type) {
  containers.set(workspaceId, {
    container,
    type,
    lastUsed: Date.now(),
  });
}

export function touchContainer(workspaceId) {
  const entry = containers.get(workspaceId);
  if (entry) entry.lastUsed = Date.now();
}

export function getContainerEntry(workspaceId) {
  return containers.get(workspaceId);
}

export function removeContainer(workspaceId) {
  containers.delete(workspaceId);
}

export function getAllContainers() {
  return containers;
}
