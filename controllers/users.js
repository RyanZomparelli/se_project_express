// JavaScript password hashing library
const bcrypt = require("bcryptjs");

// Instantiate the model to work with Mongoose methods
const User = require("../models/user");

// Status code variables for errors
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  DUPLICATE_EMAIL,
} = require("../utils/errors");

const getUsers = (req, res) => {
  // .find({}) empty object retuns an array with all resources
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getUserById = (req, res) => {
  // Get userId from the url parameters like /:userId
  const { userId } = req.params;

  User.findById(userId)
    // If !user, the Mongoose orFail() method returns DocumentNotFoundError
    // instead of null. You can add your own err handling by passing it a callback
    // function but don't forget to throw the error to the catch block at the end of the function.
    .orFail()
    // express already sends 200 codes for successfull responses but this is explicit
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested resource not found" });
      }
      // CastError happens when Mongoose tries to 'cast' the request data to the
      // expected type (ObjectId in this case) to save to MongoDB but fails.
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = async (req, res) => {
  // Create a user with the JSON data sent from the client parsed into a JS object
  // with the middleware function in app.js called express.json()
  const { email, password, name, avatar } = req.body;
  try {
    // Use the bcrypt library to hash the password entered by the user at signup.
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
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data" });
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
      return res
        .status(DUPLICATE_EMAIL)
        .send({ message: "Email already in use. Please try again." });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports = { getUsers, getUserById, createUser };
