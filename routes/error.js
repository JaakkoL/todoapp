/**
 * routes/error.js
 *
 * Applications error handling.
 */

exports.errorHandler = function(err, req, res, next) {
  // TODO: Handle all server errors properly. Separate errorhandling for 404's etc.
  console.error(err.message);
  console.error(err.stack);
  res.status(500);
  res.send("ERROR: This was caught by the error handler. Needs proper implementation...")
}