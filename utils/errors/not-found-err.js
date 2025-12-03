class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    /* Optional. Useful for debugging.
       Without custom names:
        Error: User not found
        Error: Invalid email format
        Error: Database connection failed
        Error: User not found

       With custom names:
        NotFoundError: User not found
        ValidationError: Invalid email format
        DatabaseError: Database connection failed
        NotFoundError: User not found
    */
    this.name = "NotFoundError";
  }
}

module.exports = NotFoundError;
