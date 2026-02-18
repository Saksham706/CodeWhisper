import { WebSocketServer } from "ws";
import path from "path";
import jwt from "jsonwebtoken";

import { getOrCreateContainer } from "./sandbox/containerManager.js";
import { touchContainer } from "./sandbox/containerRegistry.js";
import { createDockerPty } from "./terminal/dockerPty.js";

export function setupTerminalServer(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    /* ================= AUTH ================= */

    const params = new URLSearchParams(
      req.url.replace("/?", "")
    );
    const token = params.get("token");

    let userId = null;

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
      userId = decoded.id;
    } catch (err) {
      ws.close();
      return;
    }

    /* ================= TERMINALS ================= */

    const terminals = new Map();

    ws.on("message", async (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }

      /* ---------- CREATE TERMINAL ---------- */
      if (msg.type === "create") {
        const { terminalId, workspaceId } = msg;

        if (!workspaceId || !terminalId) return;

        const workspacePath = path.join(
          process.cwd(),
          process.env.WORKSPACES_ROOT || "workspaces",
          userId,
          workspaceId
        );

        const container = await getOrCreateContainer({
          workspaceId: `${userId}-${workspaceId}`,
          workspacePath,
        });

        touchContainer(`${userId}-${workspaceId}`);

        const ptyProcess = createDockerPty(container.id);
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

      /* ---------- INPUT ---------- */
      if (msg.type === "input") {
        terminals.get(msg.terminalId)?.write(msg.data);
      }

      /* ---------- KILL ---------- */
      if (msg.type === "kill") {
        terminals.get(msg.terminalId)?.kill();
        terminals.delete(msg.terminalId);
      }
    });

    ws.on("close", () => {
      terminals.forEach((t) => t.kill());
      terminals.clear();
    });
  });
}
