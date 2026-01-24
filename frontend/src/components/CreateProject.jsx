import { useState } from "react";

export default function CreateProject() {
  const [name, setName] = useState("");

  const createMERN = async () => {
    await fetch("http://localhost:5000/api/projects/mern", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    alert("Project created");
  };

  return (
    <div>
      <input
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={createMERN}>Create MERN</button>
    </div>
  );
}
