const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");
const NotFoundError = require("../utils/errors/not-found-err");

// Public routes
router.post("/signup", createUser);
router.post("/signin", login);

// Mixed route protection. Middleware declared per route.
router.use("/items", clothingItemRouter);

// One protected route in routes/users.js
router.use("/users", auth, userRouter);

// Catch all middleware for non-existent routes. Handles any requests to endpoints
// that don't exist.
router.use((req, res, next) => {
  return next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
