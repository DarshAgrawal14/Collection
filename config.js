// config.js - Configuration settings for the backend
require('dotenv').config();

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 5000,
  
  // MongoDB configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/currency_collection',
  
  // Upload configuration
  UPLOAD_LIMIT: process.env.UPLOAD_LIMIT || 10 * 1024 * 1024, // 10MB
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILES: process.env.MAX_FILES || 10,
  
  // API configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // JWT configuration (for future authentication)
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '24h'
};