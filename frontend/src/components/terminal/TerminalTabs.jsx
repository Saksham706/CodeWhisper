import "../../styles/terminal.css";

export default function TerminalTabs({
  terminals = [],
  activeTerminal,
  setActiveTerminal,
  closeTerminal,
}) {
  return (
    <div className="terminal-tabs">
      {terminals
        .filter((t) => t?.id) // 🔥 guard invalid entries
        .map((t, i) => (
          <div
            key={t.id} // ✅ stable, unique
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
                closeTerminal(t.id);
              }}
            >
              ✕
            </span>
          </div>
        ))}
    </div>
  );
}
