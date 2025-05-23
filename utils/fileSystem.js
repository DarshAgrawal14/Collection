// utils/fileSystem.js - Utility functions for file operations
const fs = require('fs').promises;
const path = require('path');
const config = require('../config');

/**
 * Deletes a file from the uploads directory
 * @param {string} filename - The filename to delete
 * @returns {Promise<boolean>} - True if successful, false if error
 */
const deleteFile = async (filename) => {
  try {
    const filePath = path.join(__dirname, '..', config.UPLOAD_DIR, filename);
    await fs.unlink(filePath);
    return true;
  } catch (err) {
    console.error(`Error deleting file ${filename}:`, err);
    return false;
  }
};

/**
 * Creates a directory if it doesn't exist
 * @param {string} dirPath - Directory path to create
 * @returns {Promise<boolean>} - True if successful or already exists
 */
const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return true;
  } catch (err) {
    console.error(`Error creating directory ${dirPath}:`, err);
    return false;
  }
};

/**
 * Gets file information
 * @param {string} filename - The filename to check
 * @returns {Promise<Object>} - File stats or null if error
 */
const getFileInfo = async (filename) => {
  try {
    const filePath = path.join(__dirname, '..', config.UPLOAD_DIR, filename);
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      exists: true
    };
  } catch (err) {
    return { exists: false };
  }
};

module.exports = {
  deleteFile,
  ensureDirectoryExists,
  getFileInfo
};