const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

// Don't forget to add next to the arguments in middleware functions!
module.exports = (req, res, next) => {
  // Get the token from the request authorization headers.
  const { authorization } = req.headers;

  try {
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new Error("Authorization error");
    }

    const token = authorization.replace("Bearer ", "");

    // (Synchronous) If a callback is not supplied, function acts synchronously.
    // Returns the *payload decoded if the signature is valid and optional expiration,
    // audience, or issuer are valid. If not, it will throw the error.
    const payload = jwt.verify(token, JWT_SECRET);
    // Now we create a user object with authorization to be passed down and
    // handled in procted routes.
    req.user = payload;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(UNAUTHORIZED).send({ message: err.message });
  }
};
