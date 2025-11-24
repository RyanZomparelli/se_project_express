// A 403 error is an HTTP status code that means "forbidden" or "access denied"
// because the server refuses to grant access to a requested resource. It occurs
// when the server understands the request but is blocking it due to insufficient
// permissions, incorrect credentials, or server-side configurations like file permissions or IP restrictions.

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = "ForbiddenError";
  }
}

module.exports = ForbiddenError;
