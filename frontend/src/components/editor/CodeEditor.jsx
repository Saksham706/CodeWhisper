import Editor from "@monaco-editor/react";
import { useWorkspace } from "../../context/WorkspaceContext";
import { LANGUAGE_META } from "../../config/languages";
import "../../styles/editor.css";

export default function CodeEditor() {
  const { activeFile, fileContents, updateContent } = useWorkspace();

  if (!activeFile) {
    return <div className="editor-empty">Open a file to start coding</div>;
  }

  const ext = activeFile.split(".").pop();
  const meta = LANGUAGE_META[ext] || {};

  return (
    <Editor
      theme="vs-dark"
      language={meta.monaco || "plaintext"}
      value={fileContents[activeFile] || ""}
      onChange={(v) => updateContent(activeFile, v || "")}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
      }}
      height="100%"
    />
  );
}
