import FileExplorer from "./FileExplorer";
import "./sidebar.css";

export default function Sidebar() {
  const createFile = () => {
    window.dispatchEvent(
      new CustomEvent("explorer:create-file", {
        detail: { parent: "root" },
      })
    );
  };

  const createFolder = () => {
    window.dispatchEvent(
      new CustomEvent("explorer:create-folder", {
        detail: { parent: "root" },
      })
    );
  };

  return (
    <aside className="sidebar">
      {/* Explorer Header */}
      <div className="sidebar-header">
        <span className="sidebar-title">EXPLORER</span>

        <div className="sidebar-actions">
          <button onClick={createFile} title="New File">📄</button>
          <button onClick={createFolder} title="New Folder">📁</button>
        </div>
      </div>

      {/* File Tree */}
      <div className="sidebar-tree">
        <FileExplorer />
      </div>
    </aside>
  );
}
