const mongoose = require("mongoose");

const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    required: true,
    type: String,
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    required: true,
    type: String,
    validate: {
      validator: (url) => validator.isURL(url),
      message: "This is an invalid url. Please try again.",
    },
  },
  owner: {
    required: true,
    // ObjectId is a special data type in Mongoose that JavaScript doesn't recognize
    // so the path needs to be specified. It could alternatively be destructured like
    // const { ObjectId } = Schema.Types and be used here as ObjectId.
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  likes: {
    // This sets the type as an array of ObjectId's
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user",
    // This sets the array to be empty by default.
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItem", clothingItemSchema);
