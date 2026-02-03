import FileExplorer from "../explorer/FileExplorer";
import { useWorkspace } from "../../context/WorkspaceContext";
import "../../styles/sidebar.css";

export default function Sidebar() {
  const { setCreateRequest } = useWorkspace();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">EXPLORER</span>

        <div className="sidebar-actions">
          <button
            title="New File"
            onClick={() =>
              setCreateRequest({ type: "file", parent: "" })
            }
          >
            📄
          </button>

          <button
            title="New Folder"
            onClick={() =>
              setCreateRequest({ type: "folder", parent: "" })
            }
          >
            📁
          </button>
        </div>
      </div>

      <div className="sidebar-tree">
        <FileExplorer />
      </div>
    </aside>
  );
}
