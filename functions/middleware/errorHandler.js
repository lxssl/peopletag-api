// Error handling middleware

/**
 * Global error handler
 */
const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err);

  // Default error
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    status = 401;
    message = 'Unauthorized';
  } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    status = 503;
    message = 'Service temporarily unavailable';
  }

  res.status(status).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = {
  errorHandler
};

