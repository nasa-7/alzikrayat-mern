const multer = require('multer');

/** 404 for unknown /api routes. */
const notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });

/** Central error handler: maps known error types to proper HTTP status codes. */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'The image must be smaller than 5 MB.' : err.message;
    return res.status(400).json({ message, errors: [message] });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation failed', errors: Object.values(err.errors).map((e) => e.message) });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  if (err.code === 11000) return res.status(409).json({ message: 'This email is already registered.', errors: ['This email is already registered.'] });
  if (err.status) return res.status(err.status).json({ message: err.message, errors: [err.message] });
  console.error(err);
  return res.status(500).json({ message: 'Something went wrong on the server.' });
};

module.exports = { notFound, errorHandler };
