import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import EditorTabs from "../components/editor/EditorTabs";
import CodeEditor from "../components/editor/CodeEditor";
import RunBar from "../components/editor/RunBar";

import TerminalTabs from "../components/terminal/TerminalTabs";
import TerminalPanel from "../components/terminal/TerminalPanel";

import LivePreview from "../components/preview/LivePreview";

import { useWorkspace } from "../context/WorkspaceContext";

import "../styles/layout.css";

export default function Workspace() {
  const {
    terminals,
    activeTerminal,
    setActiveTerminal,
    killTerminal,
    previewUrl,
  } = useWorkspace();

  return (
    <>
      <Navbar />

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

          {/* LIVE PREVIEW (HTML / FRONTEND PROJECTS) */}
          <LivePreview url={previewUrl} />

          {/* TERMINAL */}
          <div className="terminal-section">
            <TerminalTabs
              terminals={terminals}
              activeTerminal={activeTerminal}
              setActiveTerminal={setActiveTerminal}
              closeTerminal={killTerminal}
            />

            {activeTerminal && (
              <TerminalPanel terminalId={activeTerminal} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
