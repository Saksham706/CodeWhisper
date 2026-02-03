export function connectTerminal(userId, workspaceId) {
  const socket = new WebSocket("ws://localhost:5000");

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
