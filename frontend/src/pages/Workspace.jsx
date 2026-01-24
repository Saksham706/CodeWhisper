import Sidebar from "../components/Sidebar";
import EditorTabs from "../components/EditorTabs";
import CodeEditor from "../components/CodeEditor";
import RunBar from "../components/RunBar";
import TerminalTabs from "../components/TerminalTabs";
import TerminalPanel from "../components/TerminalPanel";
import LivePreview from "../components/LivePreview";

import { useWorkspace } from "../context/WorkspaceContext";
import "./workspace.css";

export default function Workspace() {
  const {
    activeFile,

    // terminal state
    terminals,
    activeTerminal,
    setActiveTerminal,
    createTerminal,
    killTerminal,
    socketRef,

    // preview
    previewUrl,
  } = useWorkspace();

  return (
    <div className="workspace">
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="workspace-main">
        {/* FILE TABS */}
        <EditorTabs />

        {/* RUN BAR */}
        <RunBar />

        {/* CODE EDITOR */}
        <div className="editor-area">
          <CodeEditor />
        </div>

        {/* LIVE BROWSER PREVIEW (MERN / MEAN / VITE / ANGULAR) */}
        <LivePreview url={previewUrl} />

        {/* TERMINAL CONTROLS */}
        <div className="terminal-section">
          <div className="terminal-actions">
            <button onClick={() => createTerminal()}>➕ New Terminal</button>

          </div>

          <TerminalTabs
            terminals={terminals}
            activeTerminal={activeTerminal}
            setActiveTerminal={setActiveTerminal}
            closeTerminal={killTerminal}
          />

          {activeTerminal && (
            <TerminalPanel
              socket={socketRef.current}
              terminalId={activeTerminal}
            />
          )}
        </div>
      </div>
    </div>
  );
}
