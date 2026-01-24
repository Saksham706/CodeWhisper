import { spawn } from "child_process";

const processes = new Map();

export function startProcess({ id, command, cwd, onData, onPort }) {
  if (processes.has(id)) {
    throw new Error("Process already running");
  }

  const child = spawn(command, {
    cwd,
    shell: true,
    env: process.env,
  });

  const handleData = (data) => {
    const text = data.toString();
    onData(text);

    // 🔥 PORT DETECTION (React, Vite, Angular, Express)
    const portMatch =
      text.match(/localhost:(\d+)/) ||
      text.match(/127\.0\.0\.1:(\d+)/);

    if (portMatch && onPort) {
      onPort(portMatch[1]);
    }
  };

  child.stdout.on("data", handleData);
  child.stderr.on("data", handleData);

  child.on("close", () => {
    processes.delete(id);
    onData(`\n[${id}] process exited\n`);
  });

  processes.set(id, child);
}

export function stopProcess(id) {
  const proc = processes.get(id);
  if (proc) {
    proc.kill("SIGTERM");
    processes.delete(id);
  }
}

export function isRunning(id) {
  return processes.has(id);
}
