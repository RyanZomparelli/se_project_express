const router = require("express").Router();

// Middlewares
const auth = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");

// Controllers
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
// The Key Difference between controllers and middleware is, middleware typically
// processes requests and passes control along. Controllers typically end the
// request-response cycle by sending a response but technically, they're both just
// functions that can receive (req, res, next).
router.post("/", auth, validateCardBody, createItem);
router.delete("/:id", auth, validateId, deleteItem);
router.put("/:id/likes", auth, validateId, likeItem);
router.delete("/:id/likes", auth, validateId, unlikeItem);

module.exports = router;
