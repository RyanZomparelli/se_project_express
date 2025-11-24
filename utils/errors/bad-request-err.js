// A 400 Bad Request status code indicates that the server received the request
// but couldn't process it because something was wrong with the client's request,
//  such as a malformed URL, incorrect syntax, or invalid data

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = "BadRequestError";
  }
}

module.exports = BadRequestError;
