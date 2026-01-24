import express from "express";
import { createMERNProject } from "../services/projectService.js";

const router = express.Router();

router.post("/mern", (req, res) => {
  const { name } = req.body;
  createMERNProject(name);
  res.json({ success: true });
});

export default router;
