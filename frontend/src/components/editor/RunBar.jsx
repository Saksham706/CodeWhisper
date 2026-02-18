import { useWorkspace } from "../../context/WorkspaceContext";
import { LANGUAGE_META } from "../../config/languages";
import "../../styles/editor.css";

export default function RunBar() {
  const {
    runCode,
    runProject,
    activeFile,
    refreshPreview,
    saveActiveFile,
    dirtyFiles,
  } = useWorkspace();

  const isProject = !activeFile;
  const isHTML = activeFile?.endsWith(".html");
  const isDirty = activeFile && dirtyFiles.has(activeFile);

  const ext = activeFile?.split(".").pop();
  const meta = LANGUAGE_META[ext] || {};

  const handleRun = () => {
    if (isProject) {
      runProject();
    } else if (isHTML) {
      refreshPreview();
    } else {
      runCode();
    }
  };

  return (
    <div className="run-bar">
      {/* LEFT */}
      <div className="run-bar-left">
        <span
          className={`lang-badge ${isProject ? "project" : ""}`}
          style={!isProject && meta.color ? { background: meta.color } : {}}
        >
          {isProject
            ? "Project"
            : isHTML
            ? "HTML"
            : meta.label || "Text"}
        </span>
      </div>

      {/* RIGHT */}
      <div className="run-bar-right">
        {/* SAVE BUTTON */}


        {/* RUN / PREVIEW BUTTON */}
        <button className="run-btn" onClick={handleRun}>
          ▶{" "}
          {isProject
            ? "Run Project"
            : isHTML
            ? "Preview HTML"
            : "Run File"}
        </button>
      </div>
    </div>
  );
}
