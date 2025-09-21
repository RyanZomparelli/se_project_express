// Instantiate the model to work with Mongoose methods
const User = require("../models/user");

// Status code variables for errors
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  // .find({}) empty object retuns an array with all resources
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
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
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  // Create a user with the JSON data sent from the client parsed into a JS object
  // with the middleware function in app.js called express.json()
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = { getUsers, getUserById, createUser };
