const errorHandler = (err, req, res) => {
  const status = err.status || 500;
  const message = err.message || "Server Error";
  res.status(status).json({
    error: message,
    ...(err.errors && { errors: err.errors }),
  });
};

module.exports = errorHandler;
