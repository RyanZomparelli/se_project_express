const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");
const errorHandler = require("../middlewares/error-handler");

// Public routes
router.post("/signup", createUser);
router.post("/signin", login);

// Mixed route protection. Middleware declared per route.
router.use("/items", clothingItemRouter);

// One protected route in routes/users.js
router.use("/users", auth, userRouter);

// Centralized error handling middleware
// The Key Difference between controllers and middleware is, middleware typically
// processes requests and passes control along. Controllers typically end the
// request-response cycle by sending a response but technically, they're both just
// functions that can receive (req, res, next).
router.use(errorHandler);

module.exports = router;
