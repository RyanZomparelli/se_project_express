// Express router
const router = require("express").Router();

//Endpoint routes
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

// Controllers
const { createUser, login } = require("../controllers/users");

// Middlewares
const auth = require("../middlewares/auth");
const {
  validateUserBody,
  validateAuthentication,
} = require("../middlewares/validation");

// Error object
const NotFoundError = require("../utils/errors/not-found-err");

// Public routes
router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateAuthentication, login);

// Mixed route protection.
router.use("/items", clothingItemRouter);

// One protected route in routes/users.js. Validation middleware per route.
router.use("/users", auth, userRouter);

// Catch all middleware for non-existent routes. Handles any requests to endpoints
// that don't exist.
router.use((req, res, next) => {
  return next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
