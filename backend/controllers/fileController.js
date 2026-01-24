import * as fileService from "../services/fileService.js";

export const loadWorkspace = (req, res) => {
  try {
    res.json(fileService.readWorkspace());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load workspace" });
  }
};

export const createFile = (req, res) => {
  try {
    fileService.createFile(req.body.path);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Create file failed" });
  }
};

export const createFolder = (req, res) => {
  try {
    fileService.createFolder(req.body.path);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Create folder failed" });
  }
};

export const saveFile = (req, res) => {
  try {
    fileService.saveFile(req.body.path, req.body.content);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Save failed" });
  }
};

export const deleteNode = (req, res) => {
  try {
    fileService.deleteNode(req.body.path);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
};

export const renameNode = (req, res) => {
  try {
    fileService.renameNode(req.body.oldPath, req.body.newPath);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Rename failed" });
  }
};

export const readFile = (req, res) => {
  try {
    const { path } = req.query;
    const content = fileService.readFile(path);
    res.json({ content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Read file failed" });
  }
};