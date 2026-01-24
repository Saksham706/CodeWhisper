import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import "./terminalPanel.css";

const terminalsMap = new Map(); // terminalId -> { term, fit }

export default function TerminalPanel({ socket, terminalId }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!terminalId || !socket) return;

    let entry = terminalsMap.get(terminalId);

    if (!entry) {
      const term = new Terminal({
        cursorBlink: true,
        fontSize: 13,
        fontFamily: "JetBrains Mono, monospace",
        theme: {
          background: "#1e1e1e",
          foreground: "#d4d4d4",
        },
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      terminalsMap.set(terminalId, { term, fitAddon });
      entry = terminalsMap.get(terminalId);

      term.onData((data) => {
        socket.send(
          JSON.stringify({
            type: "input",
            terminalId,
            data,
          })
        );
      });

      socket.addEventListener("message", (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === "output" && msg.terminalId === terminalId) {
          term.write(msg.data);
        }
      });
    }

    // 🔥 attach terminal to DOM
    containerRef.current.innerHTML = "";
    entry.term.open(containerRef.current);
    entry.fitAddon.fit();

  }, [terminalId, socket]);

  return <div ref={containerRef} className="terminal-panel" />;
}
