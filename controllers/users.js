// JavaScript password hashing library
const bcrypt = require("bcryptjs");
// Library to generate JWT's
const jwt = require("jsonwebtoken");

// Instantiate the model to work with Mongoose methods
const User = require("../models/user");

// Temporary secret key
const { JWT_SECRET } = require("../utils/config");

// Error objects
const NotFoundError = require("../utils/errors/not-found-err");
const BadRequestError = require("../utils/errors/bad-request-err");
const ConflictError = require("../utils/errors/conflict-err");
const UnauthorizedError = require("../utils/errors/unauthorized-err");

const getUsers = (req, res, next) => {
  // .find({}) empty object retuns an array with all resources
  User.find({})
    .then((users) => res.status(200).send(users))
    // Same as .catch(err => next(err))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    // If !user, the Mongoose orFail() method returns DocumentNotFoundError
    // instead of null. You can add your own err handling by passing it a callback
    // function but don't forget to throw the error to the catch block at the end of the function.
    .orFail()
    // express already sends '200' codes for successfull responses by default, but
    // here I'm sending it explicitly.
    .then((user) => {
      res.status(200).send({ user });
    })
    // The Error handling flow:
    // Errors are caught here and passed to the central error handling middleware
    // where the status and err.message are sent to the client.
    .catch((err) => {
      // Implicit Errors
      // CastError happens when Mongoose tries to 'cast' the request data to the
      // expected type (ObjectId in this case) to save to MongoDB but fails (id string that’s in an invalid format).
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      // castError, documentNotFoundError, validationError etc...
      // These are predictable error names that come from the Mongoose library.
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }
      // Default Error handling.
      // Unexpected errors will become statusCode 500 in the error middleware.
      return next(err);
    });
};

const createUser = async (req, res, next) => {
  // Create a user with the JSON data sent from the client parsed into a JS object
  // with the middleware function in app.js called express.json()
  const { email, password, name, avatar } = req.body;
  try {
    // Use the bcrypt library to hash the password entered by the user at signup.
    // The hash() method generates a completely random character set known as a 'salt'
    // and adds it to the password before hashing for a completely unique password hash.
    // Return's a promise.
    const hash = await bcrypt.hash(password, 10);
    // Create a user object in the MongoDB with an instance of the User model.
    // Use the result of the hash function for the password field.
    // Return's a promise.
    const user = await User.create({
      email,
      password: hash,
      name,
      avatar,
    });
    // Send the user object to the client but omit the hashed password.
    return res.status(201).send({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    // ValidationError:
    // - Source: Mongoose schema validation
    // - When: Data doesn't meet your schema requirements
    // - Example: Missing required fields, wrong data types, etc.
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    // If a email already exists in the DB, Mongo will return an error object like this:
    // {
    // index: 0,
    // code: 11000,
    // keyPattern: { email: 1 },
    // keyValue: { email: "test@example.com" }
    // }
    // This is because we added the unique value to the userSchema.
    if (err.code === 11000) {
      return next(new ConflictError("Email already in use"));
    }
    // Error handling refactoring. Instead of:
    // return res
    //   .status(INTERNAL_SERVER_ERROR)
    //   .send({ message: "An error has occurred on the server" });

    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // throw goes to the nearest catch block.
      throw new UnauthorizedError("Incorrect email or password");
    }
    // Static method declared on the userSchema model. Returns a user if successful.
    // Otherwise throws an error to the catch block.
    const user = await User.findUserByCredentials(email, password);
    // If the user is authenticated we create a JWT.
    // The client can send this token in their requests to avoid logging back in for 7 days.
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.send({ token });
  } catch (err) {
    if (
      err.name === "ValidationError" ||
      err.name === "DocumentNotFoundError"
    ) {
      return next(new UnauthorizedError("Incorrect email or password"));
    }
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        name: req.body.name,
        avatar: req.body.avatar,
      },
      {
        new: true,
        runValidators: true,
      }
    ).orFail();
    return res.status(200).send({ user });
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Requested resource not found"));
    }
    if (err.name === "CastError" || err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    return next(err);
  }
};

module.exports = { getUsers, getCurrentUser, createUser, login, updateProfile };
