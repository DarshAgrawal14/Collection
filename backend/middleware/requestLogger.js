// middleware/requestLogger.js - Middleware for logging requests
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    };
    
    // For POST/PUT requests, we can log body size but not the content for privacy
    if (['POST', 'PUT'].includes(req.method)) {
      log.bodySize = req.headers['content-length'] ? 
        `${Math.round(parseInt(req.headers['content-length']) / 1024)}KB` : 
        'unknown';
    }
    
    console.log(JSON.stringify(log));
  });
  
  next();
};

module.exports = requestLogger;