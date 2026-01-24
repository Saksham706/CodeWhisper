import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

const WorkspaceContext = createContext();

const FILE_API = "http://localhost:5000/api/files";
const WS_URL = "ws://localhost:5000";

/* ---------------- HELPERS ---------------- */

const safeTerminalId = (path) =>
  "term_" + path.replace(/[^a-zA-Z0-9_-]/g, "_");

/* ---------------- PROVIDER ---------------- */

export function WorkspaceProvider({ children }) {
  /* ---------------- FILE STATE ---------------- */

  const [tree, setTree] = useState({
    name: "root",
    type: "folder",
    children: [],
  });

  const [openTabs, setOpenTabs] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContents, setFileContents] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  /* ---------------- EXEC / UI STATE ---------------- */

  const [stdin, setStdin] = useState("");
  const [running, setRunning] = useState(false);
  const [showInput, setShowInput] = useState(false);

  /* ---------------- TERMINAL STATE ---------------- */

  const [terminals, setTerminals] = useState([]); // [{id}]
  const [activeTerminal, setActiveTerminal] = useState(null);
  const pendingRunRef = useRef(null);
  const wsReadyRef = useRef(false);
  const pendingCreateRef = useRef(null);
  const socketRef = useRef(null);

  // filePath -> terminalId
  const [fileTerminals, setFileTerminals] = useState({});

  /* ---------------- WEBSOCKET ---------------- */

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
  console.log("✅ Terminal WebSocket connected");
  wsReadyRef.current = true;

  // 🔥 create pending terminal (if any)
  if (pendingCreateRef.current) {
    sendWS({
      type: "create",
      terminalId: pendingCreateRef.current,
    });
    pendingCreateRef.current = null;
  }
};


    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === "created") {
  setTerminals((prev) =>
    prev.some((t) => t.id === msg.terminalId)
      ? prev
      : [...prev, { id: msg.terminalId }]
  );

  setActiveTerminal(msg.terminalId);

  // 🔥 RUN PENDING COMMAND (if any)
  if (pendingRunRef.current) {
    sendWS({
      type: "input",
      terminalId: msg.terminalId,
      data: pendingRunRef.current,
    });
    pendingRunRef.current = null;
  }
}


      if (msg.type === "preview") {
        setPreviewUrl(`http://localhost:${msg.port}`);
      }
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error", err);
    };

    socket.onclose = () => {
      console.warn("⚠️ WebSocket closed");
    };

    return () => socket.close();
  }, []);

  const sendWS = (payload) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(payload));
  };

  /* ---------------- TERMINAL ACTIONS ---------------- */

const createTerminal = (terminalId) => {
  // 🔥 Ignore React click event
  if (terminalId instanceof Event) {
    terminalId = null;
  }

  const id =
    terminalId ||
    `shell_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  if (!wsReadyRef.current) {
    pendingCreateRef.current = id;
    return;
  }

  sendWS({ type: "create", terminalId: id });
  setActiveTerminal(id);
};




  const killTerminal = (id) => {
    sendWS({ type: "kill", terminalId: id });
    setTerminals((prev) => prev.filter((t) => t.id !== id));
    if (activeTerminal === id) setActiveTerminal(null);
  };

  /* ---------------- LOAD WORKSPACE ---------------- */

  useEffect(() => {
    loadWorkspace();
  }, []);

  const loadWorkspace = async () => {
    try {
      const res = await fetch(`${FILE_API}/load`);
      const data = await res.json();
      setTree(data);
    } catch (err) {
      console.error("Failed to load workspace", err);
    }
  };

  /* ---------------- INPUT DETECTION ---------------- */

  const detectInputRequired = (content, file) => {
    if (!content || !file) return false;

    if (file.endsWith(".cpp") || file.endsWith(".c"))
      return /cin\s*>>|scanf\s*\(/.test(content);

    if (file.endsWith(".java"))
      return /Scanner|nextInt|nextLine|nextDouble/.test(content);

    if (file.endsWith(".py")) return /input\s*\(/.test(content);

    return false;
  };

  /* ---------------- FILE & FOLDER ---------------- */

  const addFile = async (parentPath, fileName) => {
    const path =
      parentPath === "root" ? fileName : `${parentPath}/${fileName}`;

    await fetch(`${FILE_API}/file`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });

    await loadWorkspace();
    openFile(path);
  };

  const addFolder = async (parentPath, folderName) => {
    const path =
      parentPath === "root" ? folderName : `${parentPath}/${folderName}`;

    await fetch(`${FILE_API}/folder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });

    await loadWorkspace();
  };

  /* ---------------- FILE OPEN ---------------- */

  const openFile = async (path) => {
    setOpenTabs((prev) =>
      prev.includes(path) ? prev : [...prev, path]
    );

    const res = await fetch(
      `${FILE_API}/read?path=${encodeURIComponent(path)}`
    );
    const data = await res.json();

    setFileContents((prev) => ({ ...prev, [path]: data.content || "" }));
    setActiveFile(path);
    setShowInput(detectInputRequired(data.content, path));

    if (path.endsWith(".html")) {
      setPreviewUrl(`http://localhost:5000/preview/${path}`);
    }
  };

  /* ---------------- FILE SAVE ---------------- */

  const updateContent = async (path, content) => {
    setFileContents((prev) => ({ ...prev, [path]: content }));
    setShowInput(detectInputRequired(content, path));

    await fetch(`${FILE_API}/save`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, content }),
    });
  };

  /* ---------------- RENAME ---------------- */

  const renameNode = async (path, newName) => {
    const parts = path.split("/");
    const newPath = [...parts.slice(0, -1), newName].join("/");

    await fetch(`${FILE_API}/rename`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPath: path, newPath }),
    });

    await loadWorkspace();

    setFileContents((prev) => {
      const updated = {};
      for (const key in prev) {
        updated[key === path ? newPath : key] = prev[key];
      }
      return updated;
    });

    setOpenTabs((tabs) => tabs.map((t) => (t === path ? newPath : t)));
    if (activeFile === path) setActiveFile(newPath);
  };

  /* ---------------- DELETE ---------------- */

  const deleteNode = async (path) => {
    await fetch(`${FILE_API}/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });

    await loadWorkspace();

    setOpenTabs((tabs) => tabs.filter((t) => !t.startsWith(path)));
    setFileContents((prev) => {
      const updated = {};
      for (const key in prev) {
        if (!key.startsWith(path)) updated[key] = prev[key];
      }
      return updated;
    });

    if (activeFile?.startsWith(path)) {
      setActiveFile(null);
      setShowInput(false);
    }
  };

  /* ---------------- AUTO CLOSE HTML PREVIEW ---------------- */

  useEffect(() => {
    if (!activeFile || !activeFile.endsWith(".html")) {
      setPreviewUrl(null);
    }
  }, [activeFile]);

  /* ---------------- RUN CODE (PTY TERMINAL) ---------------- */

const runCode = () => {
  if (!activeFile) return;

  const terminalId = safeTerminalId(activeFile);

  let command = "";

  if (activeFile.endsWith(".cpp"))
    command = `g++ "${activeFile}" -o program; ./program\r`;
  else if (activeFile.endsWith(".c"))
    command = `gcc "${activeFile}" -o program; ./program\r`;
  else if (activeFile.endsWith(".java"))
    command = `javac "${activeFile}"; java "${activeFile.replace(".java", "")}"\r`;
  else if (activeFile.endsWith(".py"))
    command = `python "${activeFile}"\r`;
  else if (activeFile.endsWith(".js"))
    command = `node "${activeFile}"\r`;
  else return;

  // 🔥 TERMINAL DOES NOT EXIST YET
  if (!fileTerminals[activeFile]) {
    setFileTerminals((prev) => ({
      ...prev,
      [activeFile]: terminalId,
    }));

    // store command for later
    pendingRunRef.current = command;

    createTerminal(terminalId);
    return;
  }

  // 🔥 TERMINAL EXISTS → RUN IMMEDIATELY
  setActiveTerminal(terminalId);

  sendWS({
    type: "input",
    terminalId,
    data: command,
  });
};



  /* ---------------- CONTEXT ---------------- */

  return (
    <WorkspaceContext.Provider
      value={{
        tree,
        openTabs,
        activeFile,
        fileContents,
        stdin,
        setStdin,
        running,
        showInput,
        terminals,
        activeTerminal,
        setActiveTerminal,
        createTerminal,
        killTerminal,
        socketRef,
        previewUrl,
        setPreviewUrl,
        addFile,
        addFolder,
        openFile,
        updateContent,
        renameNode,
        deleteNode,
        closeTab: (path) =>
          setOpenTabs((tabs) => tabs.filter((t) => t !== path)),
        runCode,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => useContext(WorkspaceContext);
