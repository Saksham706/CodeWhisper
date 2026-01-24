import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const WORKSPACE = path.join(process.cwd(), "workspace", "default");

export function createMERNProject(name) {
  const projectPath = path.join(WORKSPACE, name);
  fs.mkdirSync(projectPath, { recursive: true });

  execSync(`npm init -y`, { cwd: projectPath });

  // Server
  execSync(`npm install express mongoose cors`, { cwd: projectPath });
  fs.mkdirSync(path.join(projectPath, "server"));

  // Client
  execSync(`npm create vite@latest client -- --template react`, {
    cwd: projectPath,
    stdio: "inherit",
  });
}
