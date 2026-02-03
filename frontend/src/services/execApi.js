export async function execute({ userId, workspaceId, command }) {
  await fetch("http://localhost:5000/api/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, workspaceId, command }),
  });
}
