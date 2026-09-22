function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred';

  console.error(`[GLOBAL ERROR LOG] [${req.method}] ${req.url} -> Error: ${message}`);
  
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }


  return res.status(statusCode).json({
    success: false,
    error: {
      status: statusCode,
      message: message
    }
  });
}

module.exports = errorHandler;
