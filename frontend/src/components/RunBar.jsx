import { useWorkspace } from "../context/WorkspaceContext";
import "./runBar.css";

export default function RunBar() {
  const { activeFile, runCode } = useWorkspace();

  return (
    <div className="run-bar">
      <button
        className="run-btn"
        disabled={!activeFile}
        onClick={runCode}
      >
        ▶ Run
      </button>
    </div>
  );
}
