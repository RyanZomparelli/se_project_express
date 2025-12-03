// Centralized error handling middleware
// With four arguments express recognizes it as an error handler.
module.exports = (err, req, res, next) => {
  console.error(err);
  // statusCode = 500 catch all middleware for non-existent routes or errors that happen
  // unexpectedly. Handles any requests to endpoints that don't exist.
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
};

/** You call next() without an argument whenever you need to push our
 * request to the next step in the process. However, if we pass an argument to
 * next(), it will have a completely different effect, and the request will go
 * to the error handler instead.
 */
