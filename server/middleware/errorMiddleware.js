// Central error handler. Must be registered after all routes.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Something went wrong. Please try again.' });
}

function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

module.exports = { errorHandler, notFound };
