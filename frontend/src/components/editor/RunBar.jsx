import { useWorkspace } from "../../context/WorkspaceContext";
import { LANGUAGE_META } from "../../config/languages";
import "../../styles/editor.css";
export default function RunBar() {
  const { runCode, runProject, activeFile } = useWorkspace();

  if (!activeFile) {
    return (
      <div className="run-bar">
        <span className="lang-badge project">Project</span>
        <button onClick={runProject}>▶ Run Project</button>
      </div>
    );
  }

  const ext = activeFile.split(".").pop();
  const meta = LANGUAGE_META[ext] || {};

  return (
    <div className="run-bar">
      <span className="lang-badge" style={{ background: meta.color }}>
        {meta.label || "Text"}
      </span>
      <button onClick={runCode}>▶ Run File</button>
    </div>
  );
}
