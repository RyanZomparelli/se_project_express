const ClothingItem = require("../models/clothingItem");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createItem = (req, res) => {
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  // Get the item id first
  const { id } = req.params;
  // Find the item before deleting it so you can compare it for authoriztion to the
  // user currently logged in with req.user that we created in the auth middleware.
  ClothingItem.findById(id)
    .orFail()
    .then((item) => {
      // Use toString() because:
      // When you compare ObjectIds directly with ===, they might not match even
      // if they represent the same ID. This is because: item.owner is a MongoDB ObjectId object.
      // req.user._id is also an ObjectId object. Even if they have the same value,
      // they're different object instances
      if (item.owner.toString() !== req.user._id.toString()) {
        return Promise.reject(new Error("Forbidden"));
      }
      return ClothingItem.findByIdAndDelete(id);
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested resource not found" });
      }
      if (err.message === "Forbidden") {
        return res.status(FORBIDDEN).send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
  const { _id } = req.user;
  // findByIdAndUpdate is a Mongoose method that takes an identifier and an object
  // with the properties that need to be updated. It can also take an optional options
  // object as a third argument
  ClothingItem.findByIdAndUpdate(
    _id,
    {
      // in this case, likes is the property we are updating. Likes is an array in
      // the ClothingItem schema that contains a 'set' of ObjectId's to prevent mutiple
      // likes from one user. $addToSet is a special Mongo query operator that Mongoose translates for us.
      // It checks whether the userId already exists and if not it adds it, and if
      // it does it simpily confirms the operation but doesn't update the set.
      $addToSet: { likes: req.user._id },
    },
    {
      // In our options object new returns the updated resource and runValidators
      // runs the validators from our schema. When updating resources Mongoose doesn't
      // validate by default.
      new: true,
      runValidators: true,
    }
  )
    // Checking by id, so if the id is a valid format but doesn't exist we'll get null and send a
    // 200. So we still need orFail() for that scenario to throw an error.
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested resource not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const unlikeItem = (req, res) => {
  const { _id } = req.user;

  ClothingItem.findByIdAndUpdate(
    _id,
    {
      // There are other Mongo operators like $gt(grater than), $lte (less than equal to), $inc (increment) ect..
      $pull: { likes: req.user._id }, // Remove the ObjectId from the likes set.
    },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested resource not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
