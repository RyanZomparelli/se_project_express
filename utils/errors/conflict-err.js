// HTTP response status code 409 Conflict is a client error that is returned by
// the server to indicate that the request can not be satisfied because the current
// state is incompatible with what is required.

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.name = "ConflictError";
  }
}

module.exports = ConflictError;
