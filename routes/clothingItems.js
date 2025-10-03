const router = require("express").Router();

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// These routes are cumulative. The base routes in index.js specify the resources
// like '/users' or '/items'. These routes build on top of those.
router.get("/", getItems);
router.post("/", createItem);
router.delete("/:id", deleteItem);
router.put("/:id/likes", likeItem);
router.delete("/:id/likes", unlikeItem);

module.exports = router;
