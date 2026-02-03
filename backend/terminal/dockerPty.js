import pty from "node-pty";

export function createDockerPty(containerId) {
  const shell = process.platform === "win32" ? "cmd.exe" : "bash";

  const args =
    process.platform === "win32"
      ? ["/c", `docker exec -it ${containerId} bash`]
      : ["-c", `docker exec -it ${containerId} bash`];

  return pty.spawn(shell, args, {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    env: process.env,
  });
}
