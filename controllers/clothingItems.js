const ClothingItem = require("../models/clothingItem");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
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
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { id } = req.params;

  ClothingItem.findByIdAndDelete(id)
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
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
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  const { id } = req.params;
  //findByIdAndUpdate is a Mongoose method that takes an identifier and an object
  // with the properties that need to be updated. It can also take an optional options
  // object as a third argument
  ClothingItem.findByIdAndUpdate(
    id,
    {
      //in this case, likes is the property we are updating. Likes is an array in
      //the ClothingItem schema that contains a 'set' of ObjectId's to prevent mutiple
      //likes from one user. $addToSet is a special Mongo query operator that Mongoose translates for us.
      //It checks whether the userId already exists and if not it adds it, and if
      //it does it simpily confirms the operation but doesn't update the set.
      $addToSet: { likes: req.user._id },
    },
    {
      //In our options object new returns the updated resource and runValidators
      //runs the validators from our schema. When updating resources Mongoose doesn't
      //validate by default.
      new: true,
      runValidators: true,
    }
  )
    //Checking by id, so if the id is a valid format but doesn't exist we'll get null and send a
    //200. So we still need orFail() for that scenario to throw an error.
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
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const unlikeItem = (req, res) => {
  const { id } = req.params;

  ClothingItem.findByIdAndUpdate(
    id,
    {
      //There are other Mongo operators like $gt(grater than), $lte (less than equal to), $inc (increment) ect..
      $pull: { likes: req.user._id }, //Remove the ObjectId from the likes set.
    },
    { new: true, runValidators: true }
  )
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
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
