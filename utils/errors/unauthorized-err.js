// JavaScript built in Error object looks somthing like this:
// class Error {
//   constructor(message) {
//     this.message = message;
//     this.stack = // stack trace information
//     this.name = "Error";
//     // other internal properties...
//   }
// }

// A 401 Unauthorized error means the request needs valid authentication credentials.

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = "UnauthorizedError";
  }
}

module.exports = UnauthorizedError;
