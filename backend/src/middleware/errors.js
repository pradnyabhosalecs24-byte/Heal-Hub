class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const notFound = (req, res) => res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) console.error('[error]', err);
  res.status(status).json({ error: status >= 500 ? 'Internal server error' : err.message });
}

module.exports = { HttpError, notFound, errorHandler };
