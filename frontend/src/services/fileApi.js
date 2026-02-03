const BASE = "http://localhost:5000/api/files";

/* ================= LOAD WORKSPACE ================= */

export async function loadWorkspace(userId, workspaceId) {
  const res = await fetch(
    `${BASE}/load?userId=${userId}&workspaceId=${workspaceId}`
  );
  if (!res.ok) throw new Error("Failed to load workspace");
  return res.json();
}

/* ================= CREATE ================= */

export async function createFile(userId, workspaceId, path) {
  return fetch(`${BASE}/file`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, workspaceId, path }),
  });
}

export async function createFolder(userId, workspaceId, path) {
  return fetch(`${BASE}/folder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, workspaceId, path }),
  });
}

/* ================= READ ================= */

export async function readFile(userId, workspaceId, path) {
  const res = await fetch(
    `${BASE}/read?userId=${userId}&workspaceId=${workspaceId}&path=${encodeURIComponent(
      path
    )}`
  );
  if (!res.ok) throw new Error("Failed to read file");
  return res.text();
}

/* ================= SAVE ================= */

export async function saveFile(userId, workspaceId, path, content) {
  return fetch(`${BASE}/save`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, workspaceId, path, content }),
  });
}

/* ================= RENAME ================= */

export async function renameNode(userId, workspaceId, oldPath, newPath) {
  return fetch(`${BASE}/rename`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, workspaceId, oldPath, newPath }),
  });
}

/* ================= DELETE (🔥 THIS FIXES YOUR ERROR) ================= */

export async function deleteNode(userId, workspaceId, path) {
  return fetch(`${BASE}/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, workspaceId, path }),
  });
}
