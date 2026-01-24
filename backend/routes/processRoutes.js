import express from "express";
import {
  startProcess,
  stopProcess,
  isRunning,
} from "../processManager/processManager.js";

const router = express.Router();

/* ---------------- START PROCESS ---------------- */

router.post("/start", (req, res) => {
  const { id, command, cwd } = req.body;

  if (!id || !command || !cwd) {
    return res.status(400).json({
      error: "id, command and cwd are required",
    });
  }

  try {
    startProcess({
      id,
      command,
      cwd,
      onData: () => {},   // 🔥 output handled by PTY terminals
      onPort: () => {},
    });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ---------------- STOP PROCESS ---------------- */

router.post("/stop", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  stopProcess(id);
  res.json({ success: true });
});

/* ---------------- STATUS ---------------- */

router.get("/status/:id", (req, res) => {
  res.json({
    running: isRunning(req.params.id),
  });
});

export default router;
