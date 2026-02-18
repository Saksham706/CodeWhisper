import "../../styles/terminal.css";
import { useWorkspace } from "../../context/WorkspaceContext";

export default function TerminalTabs() {
  const {
    terminals,
    activeTerminal,
    setActiveTerminal,
    killTerminal,
  } = useWorkspace();

  if (!terminals.length) return null;

  return (
    <div className="terminal-tabs">
      {terminals.map((t, i) => (
        <div
          key={t.id}
          className={`terminal-tab ${
            activeTerminal === t.id ? "active" : ""
          }`}
          onClick={() => setActiveTerminal(t.id)}
        >
          Terminal {i + 1}
          <span
            className="close-btn"
            onClick={(e) => {
              e.stopPropagation();
              killTerminal(t.id);
            }}
          >
            ✕
          </span>
        </div>
      ))}
    </div>
  );
}
