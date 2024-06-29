const createError = require('http-errors');

const errorHandler = (err, req, res) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: statusCode,
    message: 'Something went wrong',
    data: err.message,
  });
};

const notFoundHandler = (req, res, next) => {
  next(createError(404, 'Route not found'));
};

module.exports = { errorHandler, notFoundHandler };
