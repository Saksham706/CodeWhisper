export default function ServerControls() {
  const startServer = async (id, command, cwd) => {
    await fetch("http://localhost:5000/api/process/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, command, cwd }),
    });
  };

  const stopServer = async (id) => {
    await fetch("http://localhost:5000/api/process/stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  return (
    <div style={{ padding: "8px", borderTop: "1px solid #333" }}>
      <h4>Servers</h4>

      <button
        onClick={() =>
          startServer(
            "backend",
            "npm run dev",
            "workspace/default/my-mern-app/server"
          )
        }
      >
        ▶ Start Backend
      </button>

      <button onClick={() => stopServer("backend")}>⏹ Stop Backend</button>

      <button
        onClick={() =>
          startServer(
            "frontend",
            "npm run dev",
            "workspace/default/my-mern-app/client"
          )
        }
      >
        ▶ Start Frontend
      </button>

      <button onClick={() => stopServer("frontend")}>⏹ Stop Frontend</button>
    </div>
  );
}
