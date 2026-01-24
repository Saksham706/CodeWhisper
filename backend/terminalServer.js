import { WebSocketServer, WebSocket } from "ws";
import pty from "node-pty";
import os from "os";
import path from "path";

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

export const terminalClients = new Set();

export function setupTerminalServer(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    terminalClients.add(ws);

    const terminals = new Map(); // terminalId -> pty

    ws.on("message", (raw) => {
      const msg = JSON.parse(raw.toString());

      /* -------- CREATE TERMINAL -------- */
      if (msg.type === "create") {
        const id = msg.terminalId; // 🔥 frontend controls ID

        if (terminals.has(id)) {
          ws.send(JSON.stringify({ type: "created", terminalId: id }));
          return;
        }

        const ptyProcess = pty.spawn(shell, [], {
          name: "xterm-color",
          cwd: path.join(process.cwd(), "workspace", "default"),
          env: process.env,
        });

        terminals.set(id, ptyProcess);

        ptyProcess.onData((data) => {
          ws.send(
            JSON.stringify({
              type: "output",
              terminalId: id,
              data,
            })
          );
        });

        ws.send(
          JSON.stringify({
            type: "created",
            terminalId: id,
          })
        );
      }

      /* -------- INPUT -------- */
      if (msg.type === "input") {
        const term = terminals.get(msg.terminalId);
        if (term) term.write(msg.data);
      }

      /* -------- KILL -------- */
      if (msg.type === "kill") {
        const term = terminals.get(msg.terminalId);
        if (term) {
          term.kill();
          terminals.delete(msg.terminalId);
        }
      }
    });

    ws.on("close", () => {
      terminalClients.delete(ws);
      terminals.forEach((t) => t.kill());
      terminals.clear();
    });
  });
}
