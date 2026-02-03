import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import * as fileApi from "../services/fileApi";

const WorkspaceContext = createContext();
const WS_URL = "ws://localhost:5000";

/* ---------------- HELPERS ---------------- */

const safeTerminalId = (path) =>
  "term_" + path.replace(/[^a-zA-Z0-9_-]/g, "_");

/* ---------------- PROVIDER ---------------- */

export function WorkspaceProvider({ children }) {
  /* later from auth */
  const userId = "user_1";
  const workspaceId = "default";

  /* ---------------- FILE STATE ---------------- */

  const [tree, setTree] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContents, setFileContents] = useState({});
  const [dirtyFiles, setDirtyFiles] = useState(new Set());
  const [previewUrl, setPreviewUrl] = useState(null);
  const [createRequest, setCreateRequest] = useState(null);

  /* ---------------- TERMINAL STATE ---------------- */

  const [terminals, setTerminals] = useState([]);
  const [activeTerminal, setActiveTerminal] = useState(null);
  const socketRef = useRef(null);
  const wsReadyRef = useRef(false);
  const pendingCreateRef = useRef(null);
  const [fileTerminals, setFileTerminals] = useState({});
const pendingRunRef = useRef(null);


const [currentProject, setCurrentProject] = useState("default");


  /* ---------------- WEBSOCKET ---------------- */

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      wsReadyRef.current = true;
      if (pendingCreateRef.current) {
        socket.send(JSON.stringify(pendingCreateRef.current));
        pendingCreateRef.current = null;
      }
    };

    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      /* terminal output */
      if (msg.type === "output") {
        window.dispatchEvent(
          new CustomEvent("terminal-output", { detail: msg })
        );
      }

      /* terminal created */
      if (msg.type === "created") {
        setTerminals((prev) =>
          prev.some((t) => t.id === msg.terminalId)
            ? prev
            : [...prev, { id: msg.terminalId }]
        );

        setActiveTerminal(msg.terminalId);

        // 🔥 EXECUTE PENDING COMMAND
        if (pendingRunRef.current) {
          sendWS({
            type: "input",
            terminalId: msg.terminalId,
            data: pendingRunRef.current,
          });
          pendingRunRef.current = null;
        }
      }

    };

    socket.onerror = console.error;
    socket.onclose = () => console.warn("⚠️ WebSocket closed");

    return () => socket.close();
  }, []);

  const sendWS = (payload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    }
  };

  /* ---------------- TERMINAL ACTIONS ---------------- */

  const createTerminal = (terminalId) => {
    const payload = {
      type: "create",
      terminalId,
      userId,
      workspaceId,
    };

    if (!wsReadyRef.current) {
      pendingCreateRef.current = payload;
      return;
    }

    sendWS(payload);
    setActiveTerminal(terminalId);
  };

  const killTerminal = (terminalId) => {
    sendWS({ type: "kill", terminalId });
    setTerminals((prev) => prev.filter((t) => t.id !== terminalId));
    if (activeTerminal === terminalId) setActiveTerminal(null);
  };

  /* ---------------- LOAD WORKSPACE ---------------- */

  useEffect(() => {
    loadWorkspace();
  }, []);

  async function loadWorkspace() {
    const data = await fileApi.loadWorkspace(userId, workspaceId);
    setTree(data);
  }

  /* ---------------- FILE ACTIONS ---------------- */

  const addFile = async (parentPath, name) => {
    const path = parentPath ? `${parentPath}/${name}` : name;
    await fileApi.createFile(userId, workspaceId, path);
    await loadWorkspace();
    openFile(path);
  };

  const addFolder = async (parentPath, name) => {
    const path = parentPath ? `${parentPath}/${name}` : name;
    await fileApi.createFolder(userId, workspaceId, path);
    await loadWorkspace();
  };

  const openFile = async (path) => {
    setOpenTabs((prev) => (prev.includes(path) ? prev : [...prev, path]));
    const content = await fileApi.readFile(userId, workspaceId, path);
    setFileContents((prev) => ({ ...prev, [path]: content }));
    setActiveFile(path);

    if (path.endsWith(".html")) {
      setPreviewUrl(
        `http://localhost:5000/preview/${userId}/${workspaceId}/${path}`
      );
    } else {
      setPreviewUrl(null);
    }
  };

  const updateContent = async (path, content) => {
    setFileContents((prev) => ({ ...prev, [path]: content }));
    setDirtyFiles((prev) => new Set(prev).add(path));

    await fileApi.saveFile(userId, workspaceId, path, content);

    setDirtyFiles((prev) => {
      const s = new Set(prev);
      s.delete(path);
      return s;
    });
  };

  const renameNode = async (oldPath, newName) => {
    const parts = oldPath.split("/");
    const newPath = [...parts.slice(0, -1), newName].join("/");

    await fileApi.renameNode(userId, workspaceId, oldPath, newPath);
    await loadWorkspace();

    setFileContents((prev) => {
      const copy = {};
      for (const k in prev) copy[k === oldPath ? newPath : k] = prev[k];
      return copy;
    });

    setOpenTabs((tabs) => tabs.map((t) => (t === oldPath ? newPath : t)));
    if (activeFile === oldPath) setActiveFile(newPath);
  };

  const deleteNode = async (path) => {
    await fileApi.deleteNode(userId, workspaceId, path);
    await loadWorkspace();

    setOpenTabs((tabs) => tabs.filter((t) => !t.startsWith(path)));
    setFileContents((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([k]) => !k.startsWith(path))
      )
    );

    if (activeFile?.startsWith(path)) {
      setActiveFile(null);
      setPreviewUrl(null);
    }
  };

  /* ---------------- RUN CODE (REAL EXECUTION) ---------------- */

const runCode = async () => {
  if (!activeFile) return;

  await fileApi.saveFile(
    userId,
    workspaceId,
    activeFile,
    fileContents[activeFile] || ""
  );

  const containerFile = `/workspace/${activeFile}`;
  const terminalId = safeTerminalId(activeFile);
  let command = "";

  if (activeFile.endsWith(".py")) {
    command = `python3 "${containerFile}"`;
  } 
  else if (activeFile.endsWith(".js")) {
    command = `node "${containerFile}"`;
  } 
  else if (activeFile.endsWith(".cpp")) {
    command = `g++ "${containerFile}" -o /workspace/a.out && /workspace/a.out`;
  } 
  else if (activeFile.endsWith(".c")) {
    command = `gcc "${containerFile}" -o /workspace/a.out && /workspace/a.out`;
  } 
  else if (activeFile.endsWith(".java")) {
  const fileDir = activeFile.split("/").slice(0, -1).join("/");
  const className = activeFile.split("/").pop().replace(".java", "");

  command = `
    cd /workspace/${fileDir} &&
    javac ${className}.java &&
    java ${className}
  `;
}

  else {
    return;
  }

  if (!fileTerminals[activeFile]) {
    setFileTerminals(prev => ({ ...prev, [activeFile]: terminalId }));
    pendingRunRef.current = command + "\n";
    createTerminal(terminalId);
    return;
  }

  setActiveTerminal(terminalId);
  sendWS({ type: "input", terminalId, data: command + "\n" });
};


  const closeTab = (path) => {
    setOpenTabs((tabs) => tabs.filter((t) => t !== path));
    if (activeFile === path) setActiveFile(null);
  };


const runProject = async () => {
 if (activeFile) {
  console.warn("Close file tabs to run project");
  return;
}


  const res = await fetch("http://localhost:5000/api/project/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      projectName: currentProject, // ideally dynamic
    }),
  });

  if (!res.ok) {
    console.error("Failed to run project");
    return;
  }

  const data = await res.json();

  // 🔥 handle multiple services / previews
  if (data.previews?.length) {
    // for now show first preview (frontend)
    setPreviewUrl(data.previews[0].url);
  }
};

const openNewTerminal = () => {
  const terminalId = `term_${Date.now()}`;
  createTerminal(terminalId);
};

  /* ---------------- CONTEXT ---------------- */

  return (
    <WorkspaceContext.Provider
      value={{
        tree,
        openTabs,
        activeFile,
        fileContents,
        previewUrl,
        terminals,
        activeTerminal,
        setActiveTerminal,
        createTerminal,
        killTerminal,
        socketRef,
        addFile,
        addFolder,
        openFile,
        updateContent,
        renameNode,
        deleteNode,
        closeTab,
        runCode,
        dirtyFiles,
        createRequest,
        setCreateRequest,
        runProject,
        currentProject,
setCurrentProject,
openNewTerminal,


      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => useContext(WorkspaceContext);
