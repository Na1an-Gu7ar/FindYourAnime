export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    message: statusCode === 500 && isProduction ? 'Internal server error' : error.message,
    status: 'error'
  });
}
