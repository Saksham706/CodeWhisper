import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { useWorkspace } from "../../context/WorkspaceContext";
import "../../styles/terminal.css";

export default function TerminalPanel() {
  const { socketRef, activeTerminal } = useWorkspace();
  const containerRef = useRef(null);
  const termRef = useRef(null);

  useEffect(() => {
    if (!activeTerminal || !socketRef.current) return;

    // Create terminal once
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
            terminalId: activeTerminal,
            data,
          })
        );
      });
    }

    // Mount terminal
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      termRef.current.open(containerRef.current);
      termRef.current.focus();
    }

    // Listen for backend output
    const handler = (e) => {
      const msg = e.detail;
      if (msg.terminalId === activeTerminal) {
        termRef.current.write(msg.data);
      }
    };

    window.addEventListener("terminal-output", handler);

    return () => {
      window.removeEventListener("terminal-output", handler);
    };
  }, [activeTerminal]);

  return <div ref={containerRef} className="terminal-panel" />;
}
