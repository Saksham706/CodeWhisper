 import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKSPACE = path.join(__dirname, "..", "workspace", "default");
const isWindows = os.platform() === "win32";

/* ---------------- Prompt Sanitizer ---------------- */

function sanitizePrompts(code, language) {
  const patterns = {
    cpp: /^\s*(cout\s*<<.*"(Enter|enter|input|Input).*)/i,
    c: /^\s*(printf\s*\(.*"(Enter|enter|input|Input).*)/i,
    java: /^\s*(System\.out\.print.*"(Enter|enter|input|Input).*)/i,
    python: /^\s*(print\s*\(.*"(Enter|enter|input|Input).*)/i,
  };

  const regex = patterns[language];
  if (!regex) return code;

  return code
    .split("\n")
    .map((line) => (regex.test(line) ? `// ${line}` : line))
    .join("\n");
}

/* ---------------- Run Command ---------------- */

function runCommand(command, args, cwd, stdin = "") {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd });

    let stdout = "";
    let stderr = "";

    if (stdin) child.stdin.write(stdin);
    child.stdin.end();

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("close", () => resolve({ stdout, stderr }));
  });
}

/* ---------------- Execute ---------------- */

export async function execute(language, filePath, stdin = "") {
  const fullPath = path.join(WORKSPACE, filePath);
  const dir = path.dirname(fullPath);
  const fileName = path.basename(filePath);
  const baseName = fileName.split(".")[0];

  const originalCode = fs.readFileSync(fullPath, "utf8");
  const sanitizedCode = sanitizePrompts(originalCode, language);

  let tempFile = null;
  let result;

  try {
    /* ---------- C++ ---------- */
    if (language === "cpp") {
      tempFile = path.join(dir, `__temp_${Date.now()}_${fileName}`);
      fs.writeFileSync(tempFile, sanitizedCode);

      const compile = await runCommand(
        "g++",
        [path.basename(tempFile), "-o", "program.exe"],
        dir
      );
      if (compile.stderr) return compile;

      result = await runCommand(
        isWindows ? "program.exe" : "./program",
        [],
        dir,
        stdin
      );
    }

    /* ---------- C ---------- */
    else if (language === "c") {
      tempFile = path.join(dir, `__temp_${Date.now()}_${fileName}`);
      fs.writeFileSync(tempFile, sanitizedCode);

      const compile = await runCommand(
        "gcc",
        [path.basename(tempFile), "-o", "program.exe"],
        dir
      );
      if (compile.stderr) return compile;

      result = await runCommand(
        isWindows ? "program.exe" : "./program",
        [],
        dir,
        stdin
      );
    }

    /* ---------- JAVA (SPECIAL HANDLING) ---------- */
    else if (language === "java") {
      // Java requires filename = public class name
      fs.writeFileSync(fullPath, sanitizedCode);

      const compile = await runCommand("javac", [fileName], dir);

      // Restore original code immediately
      fs.writeFileSync(fullPath, originalCode);

      if (compile.stderr) return compile;

      result = await runCommand("java", [baseName], dir, stdin);
    }

    /* ---------- NODE.JS ---------- */
    else if (language === "node") {
      result = await runCommand(
        "node",
        [fileName],
        dir,
        stdin
      );
    }
    
    /* ---------- PYTHON ---------- */
    else if (language === "python") {
      tempFile = path.join(dir, `__temp_${Date.now()}_${fileName}`);
      fs.writeFileSync(tempFile, sanitizedCode);

      result = await runCommand("python", [path.basename(tempFile)], dir, stdin);
    }
  } finally {
    // Clean up temp file (Java does not use temp files)
    if (tempFile && fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }

  

  return result;
}
 