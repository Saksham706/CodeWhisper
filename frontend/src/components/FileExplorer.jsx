import { useState, useRef, useEffect } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import "./fileExplorer.css";

/* ---------------- INLINE CREATE ---------------- */

function InlineCreate({ type, parentPath, onSubmit, onCancel }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="tree-row creating">
      <div className="tree-left">
        <span className="file-indent" />
        <span className={`icon ${type === "file" ? "file-icon" : "folder-icon"}`} />

        <input
          ref={inputRef}
          className="rename-input"
          placeholder={type === "file" ? "newFile" : "newFolder"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              onSubmit(value.trim());
            }
            if (e.key === "Escape") onCancel();
          }}
          onBlur={onCancel}
        />
      </div>
    </div>
  );
}

/* ---------------- TREE NODE ---------------- */

function TreeNode({ node, path }) {
  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(node.name);
  const [creating, setCreating] = useState(null); // { type: "file" | "folder" }

  const inputRef = useRef(null);

  const {
    openFile,
    addFile,
    addFolder,
    renameNode,
    deleteNode,
  } = useWorkspace();

  const currentPath = path === "root" ? node.name : `${path}/${node.name}`;

  /* AUTO FOCUS RENAME */
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const submitRename = () => {
    if (tempName && tempName !== node.name) {
      renameNode(currentPath, tempName);
    }
    setEditing(false);
  };

  const cancelRename = () => {
    setTempName(node.name);
    setEditing(false);
  };

  /* ---------- FOLDER ---------- */
  if (node.type === "folder") {
    return (
      <div className="tree-node">
        <div className="tree-row group">
          <div
            className="tree-left"
            onClick={() => !editing && setOpen(!open)}
          >
            <span className="arrow">{open ? "▼" : "▶"}</span>
            <span className="icon folder-icon" />

            {editing ? (
              <input
                ref={inputRef}
                className="rename-input"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitRename();
                  if (e.key === "Escape") cancelRename();
                }}
                onBlur={cancelRename}
              />
            ) : (
              <span className="name">{node.name}</span>
            )}
          </div>

          {!editing && (
            <div className="tree-actions">
              <button title="New File" onClick={() => setCreating({ type: "file" })}>
                ＋📄
              </button>
              <button title="New Folder" onClick={() => setCreating({ type: "folder" })}>
                ＋📁
              </button>
              <button title="Rename" onClick={() => setEditing(true)}>✎</button>
              <button title="Delete" onClick={() => deleteNode(currentPath)}>🗑</button>
            </div>
          )}
        </div>

        {open && (
          <>
            {creating && (
              <InlineCreate
                type={creating.type}
                parentPath={currentPath}
                onSubmit={(name) => {
                  creating.type === "file"
                    ? addFile(currentPath, name)
                    : addFolder(currentPath, name);
                  setCreating(null);
                  setOpen(true);
                }}
                onCancel={() => setCreating(null)}
              />
            )}

            {node.children?.map((child) => (
              <TreeNode
                key={child.name}
                node={child}
                path={currentPath}
              />
            ))}
          </>
        )}
      </div>
    );
  }

  /* ---------- FILE ---------- */
  return (
    <div className="tree-node file-node">
      <div className="tree-row group">
        <div
          className="tree-left"
          onClick={() => !editing && openFile(currentPath)}
        >
          <span className="file-indent" />
          <span className="icon file-icon" />

          {editing ? (
            <input
              ref={inputRef}
              className="rename-input"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitRename();
                if (e.key === "Escape") cancelRename();
              }}
              onBlur={cancelRename}
            />
          ) : (
            <span className="name">{node.name}</span>
          )}
        </div>

        {!editing && (
          <div className="tree-actions">
            <button title="Rename" onClick={() => setEditing(true)}>✎</button>
            <button title="Delete" onClick={() => deleteNode(currentPath)}>🗑</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- FILE EXPLORER ---------------- */

export default function FileExplorer() {
  const { tree, addFile, addFolder } = useWorkspace();
  const [rootCreate, setRootCreate] = useState(null); // file | folder

  /* LISTEN FROM SIDEBAR BUTTONS */
  useEffect(() => {
    const file = () => setRootCreate("file");
    const folder = () => setRootCreate("folder");

    window.addEventListener("explorer:create-file", file);
    window.addEventListener("explorer:create-folder", folder);

    return () => {
      window.removeEventListener("explorer:create-file", file);
      window.removeEventListener("explorer:create-folder", folder);
    };
  }, []);

  if (!tree || !Array.isArray(tree.children)) {
    return <p className="explorer-info">Loading workspace…</p>;
  }

  return (
    <div className="file-explorer">
      {rootCreate && (
        <InlineCreate
          type={rootCreate}
          parentPath="root"
          onSubmit={(name) => {
            rootCreate === "file"
              ? addFile("root", name)
              : addFolder("root", name);
            setRootCreate(null);
          }}
          onCancel={() => setRootCreate(null)}
        />
      )}

      {tree.children.map((node) => (
        <TreeNode key={node.name} node={node} path="root" />
      ))}
    </div>
  );
}
