import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { useWorkspace } from "../../context/WorkspaceContext";
import "../../styles/terminal.css";

export default function TerminalPanel({ terminalId }) {
  const { socketRef } = useWorkspace();
  const containerRef = useRef(null);
  const termRef = useRef(null);

  useEffect(() => {
    if (!terminalId || !socketRef.current) return;

    // Create terminal ONCE
    if (!termRef.current) {
      termRef.current = new Terminal({
        theme: { background: "#1e1e1e" },
        fontSize: 13,
        cursorBlink: true,
        convertEol: true,
      });

      termRef.current.onData((data) => {
        socketRef.current.send(
          JSON.stringify({
            type: "input",
            terminalId,
            data,
          })
        );
      });
    }

    // Mount terminal
    containerRef.current.innerHTML = "";
    termRef.current.open(containerRef.current);
    termRef.current.focus();

    // Listen for backend output
    const handler = (e) => {
      const msg = e.detail;
      if (msg.terminalId === terminalId) {
        termRef.current.write(msg.data);
      }
    };

    window.addEventListener("terminal-output", handler);

    return () => {
      window.removeEventListener("terminal-output", handler);
    };
  }, [terminalId]);

  return <div ref={containerRef} className="terminal-panel" />;
}
