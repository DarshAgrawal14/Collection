// middleware/errorHandler.js - Custom error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File too large', 
        error: `File size should be less than ${err.limit / (1024 * 1024)}MB` 
      });
    }
    return res.status(400).json({ message: 'File upload error', error: err.message });
  }
  
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: 'Validation error', errors });
  }
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate key error', error: err.message });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
  
  // Default to 500 server error
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
};

module.exports = errorHandler;