import express from "express";
import {
  loadWorkspace,
  createFile,
  createFolder,
  saveFile,
  deleteNode,
  renameNode,
  readFile,
} from "../controllers/fileController.js";

const router = express.Router();

router.get("/load", loadWorkspace);
router.post("/file", createFile);
router.post("/folder", createFolder);
router.put("/save", saveFile);
router.post("/delete", deleteNode);
router.put("/rename", renameNode);
router.get("/read", readFile);


export default router;
