import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* ---------------- ES MODULE DIRNAME FIX ---------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- WORKSPACE ROOT ---------------- */

const WORKSPACE_ROOT = path.join(__dirname, "..", "workspace", "default");

/* ---------------- ENSURE ROOT EXISTS (ONLY ONCE) ---------------- */

if (!fs.existsSync(WORKSPACE_ROOT)) {
  fs.mkdirSync(WORKSPACE_ROOT, { recursive: true });
}

/* ---------------- READ WORKSPACE TREE ---------------- */

export function readWorkspace(dir = WORKSPACE_ROOT) {
  if (!fs.existsSync(dir)) {
    return {
      name: "root",
      type: "folder",
      children: [],
    };
  }

  const stats = fs.statSync(dir);
  const name = dir === WORKSPACE_ROOT ? "root" : path.basename(dir);

  if (stats.isFile()) {
    return { name, type: "file" };
  }

  return {
    name,
    type: "folder",
    children: fs.readdirSync(dir).map((child) =>
      readWorkspace(path.join(dir, child))
    ),
  };
}

/* ---------------- CREATE FILE ---------------- */

export function createFile(relativePath) {
  const fullPath = path.join(WORKSPACE_ROOT, relativePath);

  // ✅ create parent folders ONLY
  const parentDir = path.dirname(fullPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, "");
  }
}

/* ---------------- CREATE FOLDER ---------------- */

export function createFolder(relativePath) {
  const fullPath = path.join(WORKSPACE_ROOT, relativePath);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
}

/* ---------------- SAVE FILE ---------------- */

export function saveFile(relativePath, content) {
  const fullPath = path.join(WORKSPACE_ROOT, relativePath);

  const parentDir = path.dirname(fullPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  fs.writeFileSync(fullPath, content);
}

/* ---------------- DELETE NODE ---------------- */

export function deleteNode(relativePath) {
  const fullPath = path.join(WORKSPACE_ROOT, relativePath);

  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
}

/* ---------------- RENAME NODE ---------------- */

export function renameNode(oldPath, newPath) {
  fs.renameSync(
    path.join(WORKSPACE_ROOT, oldPath),
    path.join(WORKSPACE_ROOT, newPath)
  );
}

export function readFile(relativePath) {
  const fullPath = path.join(WORKSPACE_ROOT, relativePath);

  if (!fs.existsSync(fullPath)) return "";

  return fs.readFileSync(fullPath, "utf-8");
}
