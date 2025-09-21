const router = require("express").Router();

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:id", deleteItem);
router.put("/:id/likes", likeItem);
router.delete("/:id/likes", unlikeItem);

module.exports = router;
