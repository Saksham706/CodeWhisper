import * as fileService from "../services/fileService.js";

export const loadWorkspace = (req, res) => {
  const { userId, workspaceId } = req.query;
  const tree = fileService.readWorkspace(userId, workspaceId);
  res.json(tree);
};

export const createFile = (req, res) => {
  const { userId, workspaceId, path } = req.body;
  fileService.createFile(userId, workspaceId, path);
  res.json({ success: true });
};

export const createFolder = (req, res) => {
  const { userId, workspaceId, path } = req.body;
  fileService.createFolder(userId, workspaceId, path);
  res.json({ success: true });
};

export const saveFile = (req, res) => {
  const { userId, workspaceId, path, content } = req.body;
  fileService.saveFile(userId, workspaceId, path, content);
  res.json({ success: true });
};

export const readFile = (req, res) => {
  const { userId, workspaceId, path } = req.query;
  const content = fileService.readFile(userId, workspaceId, path);
  res.json({ content });
};

export const deleteNode = (req, res) => {
  const { userId, workspaceId, path } = req.body;
  fileService.deleteNode(userId, workspaceId, path);
  res.json({ success: true });
};

export const renameNode = (req, res) => {
  const { userId, workspaceId, oldPath, newPath } = req.body;
  fileService.renameNode(userId, workspaceId, oldPath, newPath);
  res.json({ success: true });
};
