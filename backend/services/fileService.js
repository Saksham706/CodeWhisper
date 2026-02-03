import fs from "fs";
import path from "path";

const WORKSPACES_ROOT = path.join(process.cwd(), "workspaces");

/* ---------------- ENSURE WORKSPACE ---------------- */

export function ensureWorkspace(userId, workspaceId) {
  const wsPath = path.join(WORKSPACES_ROOT, userId, workspaceId);

  if (!fs.existsSync(wsPath)) {
    fs.mkdirSync(wsPath, { recursive: true });
  }

  return wsPath;
}

/* ---------------- READ WORKSPACE TREE ---------------- */

export function readWorkspace(userId, workspaceId, dir = null) {
  const root = ensureWorkspace(userId, workspaceId);
  const current = dir || root;

  const stats = fs.statSync(current);
  const name = current === root ? workspaceId : path.basename(current);

  if (stats.isFile()) {
    return { name, type: "file" };
  }

  return {
    name,
    type: "folder",
    children: fs.readdirSync(current).map((child) =>
      readWorkspace(userId, workspaceId, path.join(current, child))
    ),
  };
}

/* ---------------- CREATE FILE ---------------- */

export function createFile(userId, workspaceId, relativePath) {
  const wsPath = ensureWorkspace(userId, workspaceId);
  const fullPath = path.join(wsPath, relativePath);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  if (!fs.existsSync(fullPath)) fs.writeFileSync(fullPath, "");
}

/* ---------------- CREATE FOLDER ---------------- */

export function createFolder(userId, workspaceId, relativePath) {
  const wsPath = ensureWorkspace(userId, workspaceId);
  const fullPath = path.join(wsPath, relativePath);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
}

/* ---------------- SAVE FILE ---------------- */

export function saveFile(userId, workspaceId, relativePath, content) {
  const wsPath = ensureWorkspace(userId, workspaceId);
  const fullPath = path.join(wsPath, relativePath);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

/* ---------------- READ FILE ---------------- */

export function readFile(userId, workspaceId, relativePath) {
  const wsPath = ensureWorkspace(userId, workspaceId);
  const fullPath = path.join(wsPath, relativePath);

  if (!fs.existsSync(fullPath)) return "";
  return fs.readFileSync(fullPath, "utf-8");
}

/* ---------------- DELETE ---------------- */

export function deleteNode(userId, workspaceId, relativePath) {
  const wsPath = ensureWorkspace(userId, workspaceId);
  const fullPath = path.join(wsPath, relativePath);

  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
}

/* ---------------- RENAME ---------------- */

export function renameNode(userId, workspaceId, oldPath, newPath) {
  const wsPath = ensureWorkspace(userId, workspaceId);

  fs.renameSync(
    path.join(wsPath, oldPath),
    path.join(wsPath, newPath)
  );
}
