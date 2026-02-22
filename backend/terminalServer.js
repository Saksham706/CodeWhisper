import { WebSocketServer } from "ws";
import path from "path";
import jwt from "jsonwebtoken";
import chokidar from "chokidar";

import { getOrCreateContainer } from "./sandbox/containerManager.js";
import { touchContainer } from "./sandbox/containerRegistry.js";
import { createDockerPty } from "./terminal/dockerPty.js";
import { syncWorkspaceToDB } from "./services/syncService.js";

export function setupTerminalServer(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    /* ================= AUTH ================= */

    const params = new URLSearchParams(req.url.replace("/?", ""));
    const token = params.get("token");

    let userId;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      ws.close();
      return;
    }

    /* ================= STATE ================= */

    const terminals = new Map();        // terminalId -> pty
    const workspaceMap = new Map();     // terminalId -> workspaceId
    const watchers = new Map();         // workspaceId -> chokidar watcher

    /* ================= MESSAGE HANDLER ================= */

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

        if (!terminalId || !workspaceId) return;

        try {
          const workspacePath = path.join(
            process.cwd(),
            process.env.WORKSPACES_ROOT || "workspaces",
            userId,
            workspaceId
          );

          const container = await getOrCreateContainer({
            workspaceKey: `${userId}-${workspaceId}`,
            workspacePath,
          });

          touchContainer(`${userId}-${workspaceId}`);

          const ptyProcess = createDockerPty(container.id);

          terminals.set(terminalId, ptyProcess);
          workspaceMap.set(terminalId, workspaceId);

          /* ---------- FILE WATCHER (🔥 REAL FIX) ---------- */
          if (!watchers.has(workspaceId)) {
            const watcher = chokidar.watch(workspacePath, {
              ignoreInitial: true,
              persistent: true,
              depth: 10,
            });

            watcher.on("all", async () => {
              try {
                await syncWorkspaceToDB(userId, workspaceId);
              } catch (err) {
                console.error("Watcher sync error:", err.message);
              }
            });

            watchers.set(workspaceId, watcher);
          }

          /* ---------- TERMINAL OUTPUT ---------- */
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

        } catch (err) {
          console.error("Terminal creation failed:", err);
        }
      }

      /* ---------- INPUT ---------- */
      if (msg.type === "input") {
        const term = terminals.get(msg.terminalId);
        if (term) term.write(msg.data);
      }

      /* ---------- KILL ---------- */
      if (msg.type === "kill") {
        const term = terminals.get(msg.terminalId);
        const wsId = workspaceMap.get(msg.terminalId);

        if (term) term.kill();

        terminals.delete(msg.terminalId);
        workspaceMap.delete(msg.terminalId);

        if (wsId) {
          try {
            await syncWorkspaceToDB(userId, wsId);
          } catch (err) {
            console.error("Kill sync failed:", err.message);
          }
        }
      }
    });

    /* ================= SOCKET CLOSE ================= */

    ws.on("close", async () => {
      try {
        // Kill all terminals
        for (const term of terminals.values()) {
          term.kill();
        }

        // Close all watchers
        for (const watcher of watchers.values()) {
          await watcher.close();
        }

        terminals.clear();
        workspaceMap.clear();
        watchers.clear();

      } catch (err) {
        console.error("Terminal cleanup failed:", err.message);
      }
    });
  });
}