const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* validator is a node package that contains validation code like isURL() or
 other quick validation methods. Not to be confused with the validate field in
 mongoose schemas with its validator property. */
const validator = require("validator");

const UnauthorizedError = require("../utils/errors/unauthorized-err");

/* A schema is a blueprint for the resources that are going to be saved to the database.
   mongoose uses the schema to validate documents before they're saved. */
const userSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: "This is an invalid email. Please try again.",
    },
  },
  password: {
    required: true,
    type: String,
    // This ensures that the user's password hash will not be returned by any search queries.
    select: false,
  },
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    required: true,
    type: String,
    // 👇 The mongoose schema field
    validate: {
      validator: (url) => validator.isURL(url), // 👈 The validator library
      message: "This is an invalid url. Please try again.",
    },
  },
  zip: {
    required: true,
    type: String,
    minlength: 5,
    maxlength: 5,
  },
});

/* Declaring a static method on the statics object of the User model.
   It should NOT be an arrow function. This is so we can use 'this' in any context. Also, here
   im explicitly declaring the name twice so if there is an error, the stacktrace
   won't come back as annonymous. */
userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email,
  password
) {
  // First we find a user with the mongoose method findOne() which takes an object.
  const user = await this.findOne({ email }).select("+password"); // 👈 Satisfy 'select: false' in the userSchema.
  // Then we make sure the user exists before checking comparing the passwords so
  // we aren't unecessarily hashing passwords.
  if (!user) {
    // Since findOne returns a Promise it's semantically correct to return a rejected
    // promise. With the error object, It's functionally the same as throwing an error.
    // Any error's here will be caught in the catch block of the loginUser controller.
    return Promise.reject(new UnauthorizedError("Incorrect email or password"));
  }
  // Password is the login form data and user.password is the hashed password in the DB.
  // Returns a promise which resolves to a boolean value.
  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    return Promise.reject(new UnauthorizedError("Incorrect email or password"));
  }

  // If all is well return the user for the controller to handle.
  return user;
};

/* The model is like a class wrapper for the schema which you can instantiate and
  and use in your controllers(functions to handle client requests) to
  interact(Create Read Update Delete) with the database.  */
module.exports = mongoose.model("user", userSchema);
