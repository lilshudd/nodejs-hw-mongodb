const errorHandler = (err, req, res) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    status: statusCode,
    message: message,
  });
};

module.exports = { errorHandler };
