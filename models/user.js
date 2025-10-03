const mongoose = require("mongoose");

/* validator is a node package that contains validation code like isURL() or
 other quick validation methods. Not to be confused with the validate field in
 mongoose schemas with its validator property. */
const validator = require("validator");

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
});

/* The model is like a class wrapper for the schema which you can instantiate and
  and use in your controllers(functions to handle client requests) to
  interact(Create Read Update Delete) with the database.  */
module.exports = mongoose.model("user", userSchema);
