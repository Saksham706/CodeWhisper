const BASE = "http://localhost:5000/api/files";

/* ================= AUTH HELPERS ================= */

function getAuthHeaders(isJson = true) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not authenticated");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

/* ================= LOAD TREE ================= */

export async function loadTree(workspaceId) {
  const res = await fetch(
    `${BASE}/tree?workspaceId=${workspaceId}`,
    {
      headers: getAuthHeaders(false),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load workspace tree");
  }

  return res.json();
}

/* ================= CREATE FILE / FOLDER ================= */
/* Backend uses ONE route: POST /api/files/create */

export async function createFile(userId, workspaceId, path) {
  const res = await fetch(`${BASE}/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      workspaceId,
      path,
      type: "file",
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create file");
  }

  return res.json();
}

export async function createFolder(userId, workspaceId, path) {
  const res = await fetch(`${BASE}/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      workspaceId,
      path,
      type: "folder",
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create folder");
  }

  return res.json();
}

/* ================= READ FILE ================= */

export async function readFile(userId, workspaceId, path) {
  const res = await fetch(
    `${BASE}/read?workspaceId=${workspaceId}&path=${encodeURIComponent(
      path
    )}`,
    {
      headers: getAuthHeaders(false),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to read file");
  }

  const data = await res.json();
  return data.content ?? "";
}

/* ================= SAVE FILE ================= */

export async function saveFile(userId, workspaceId, path, content) {
  const res = await fetch(`${BASE}/save`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      workspaceId,
      path,
      content,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to save file");
  }

  return res.json();
}

/* ================= RENAME FILE / FOLDER ================= */

export async function renameNode(
  userId,
  workspaceId,
  oldPath,
  newPath
) {
  const res = await fetch(`${BASE}/rename`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      workspaceId,
      oldPath,
      newPath,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to rename node");
  }

  return res.json();
}

/* ================= DELETE FILE / FOLDER ================= */

export async function deleteNode(userId, workspaceId, path) {
  const res = await fetch(`${BASE}/delete`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      workspaceId,
      path,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete node");
  }

  return res.json();
}
