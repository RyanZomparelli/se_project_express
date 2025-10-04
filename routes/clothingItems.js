const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// These routes are cumulative. The base routes in index.js specify the resources
// like '/users' or '/items'. These routes build on top of those.
// Public Routes
router.get("/", getItems);

// Protected Routes
router.post("/", auth, createItem);
router.delete("/:id", auth, deleteItem);
router.put("/:id/likes", auth, likeItem);
router.delete("/:id/likes", auth, unlikeItem);

module.exports = router;
