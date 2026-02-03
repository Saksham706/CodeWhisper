import express from "express";
import { setWorkspaceType } from "../controllers/workspaceController.js";

const router = express.Router();
router.post("/type", setWorkspaceType);

export default router;
