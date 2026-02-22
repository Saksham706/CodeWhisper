export function connectTerminal(userId, workspaceId) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const socket = new WebSocket(`ws://${backendUrl}`);

  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        type: "create",
        userId,
        workspaceId,
      })
    );
  };

  return socket;
}
