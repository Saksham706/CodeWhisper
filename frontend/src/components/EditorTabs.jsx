import { useWorkspace } from "../context/WorkspaceContext";
import "./editorTabs.css";

export default function EditorTabs() {
  const { openTabs, activeFile, openFile, closeTab } = useWorkspace();

  return (
    <div className="tabs-bar">
      {openTabs.map((file) => (
        <div
          key={file}
          onClick={() => openFile(file)}
          className={`tab ${activeFile === file ? "active" : ""}`}
        >
          <span className="tab-title">{file}</span>

          <span
            className="tab-close"
            onClick={(e) => {
              e.stopPropagation();
              closeTab(file);
            }}
          >
            ✕
          </span>
        </div>
      ))}
    </div>
  );
}
