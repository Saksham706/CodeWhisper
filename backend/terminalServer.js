import { WebSocketServer } from "ws";
import path from "path";
import { getOrCreateContainer } from "./sandbox/containerManager.js";
import { touchContainer } from "./sandbox/containerRegistry.js";
import { createDockerPty } from "./terminal/dockerPty.js";

export function setupTerminalServer(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    const terminals = new Map();

    ws.on("message", async (raw) => {
      const msg = JSON.parse(raw.toString());

      /* ================= CREATE TERMINAL ================= */
      if (msg.type === "create") {
        const { terminalId, userId, workspaceId } = msg;

        const workspacePath = path.join(
          process.cwd(),
          "workspaces",
          userId,
          workspaceId
        );

        const container = await getOrCreateContainer({
          workspaceId,
          workspacePath,
        });

        touchContainer(workspaceId);

        // 🔥 IMPORTANT: force shell to start in /workspace
        const ptyProcess = createDockerPty(container.id, "/workspace");

        terminals.set(terminalId, ptyProcess);

        ptyProcess.onData((data) => {
          ws.send(
            JSON.stringify({
              type: "output",
              terminalId,
              data,
            })
          );
        });

        ws.send(
          JSON.stringify({
            type: "created",
            terminalId,
          })
        );
      }

      /* ================= USER INPUT ================= */
      if (msg.type === "input") {
        const term = terminals.get(msg.terminalId);
        if (term) {
          term.write(msg.data);
        }
      }

      /* ================= KILL TERMINAL ================= */
      if (msg.type === "kill") {
        const term = terminals.get(msg.terminalId);
        if (term) {
          term.kill();
          terminals.delete(msg.terminalId);
        }
      }
    });

    ws.on("close", () => {
      terminals.forEach((t) => t.kill());
      terminals.clear();
    });
  });
}
