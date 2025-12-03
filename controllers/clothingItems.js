const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../utils/errors/bad-request-err");
const NotFoundError = require("../utils/errors/not-found-err");
const ForbiddenError = require("../utils/errors/forbidden-err");

// The Key Difference between controllers and middleware is, middleware typically
// processes requests and passes control along. Controllers typically end the
// request-response cycle by sending a response but technically, they're both just
// functions that can receive (req, res, next).
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};

const createItem = (req, res, next) => {
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
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
        return Promise.reject(new ForbiddenError("Forbidden"));
      }
      return ClothingItem.findByIdAndDelete(id);
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  const { id } = req.params;
  // findByIdAndUpdate is a Mongoose method that takes an identifier and an object
  // with the properties that need to be updated. It can also take an optional options
  // object as a third argument
  ClothingItem.findByIdAndUpdate(
    id,
    {
      // In this case, likes is the property we are updating. Likes is an array in
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
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }
      return next(err);
    });
};

const unlikeItem = (req, res, next) => {
  const { id } = req.params;

  ClothingItem.findByIdAndUpdate(
    id,
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
        return next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }
      return next(err);
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
