import pty from "node-pty";

export function createDockerPty(containerId) {
  return pty.spawn("docker", [
    "exec",
    "-it",
    containerId,
    "bash"
  ], {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    env: process.env,
  });
}
