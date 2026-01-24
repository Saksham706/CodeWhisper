import Editor from "@monaco-editor/react";
import { useWorkspace } from "../context/WorkspaceContext";
import "./codeEditor.css";

const languageMap = {
  cpp: "cpp",
  c: "c",
  py: "python",
  java: "java",
  js: "javascript",
};

export default function CodeEditor() {
  const { activeFile, fileContents, updateContent } = useWorkspace();

  /* EMPTY STATE */
  if (!activeFile) {
    return (
      <div className="editor-empty">
        <p>Open a file to start coding</p>
      </div>
    );
  }

  const ext = activeFile.split(".").pop();
  const language = languageMap[ext] || "plaintext";

  return (
    <div className="editor-wrapper">
      {/* EDITOR */}
      <div className="editor-container">
        <Editor
          theme="vs-dark"
          language={language}
          value={fileContents[activeFile] || ""}
          onChange={(v) => updateContent(activeFile, v || "")}
          options={{
            fontSize: 14,
            fontFamily: "JetBrains Mono",
            minimap: { enabled: false },
            wordWrap: "on",
            smoothScrolling: true,
            cursorSmoothCaretAnimation: true,
            automaticLayout: true,
          }}
          height="100%"
        />
      </div>
    </div>
  );
}
