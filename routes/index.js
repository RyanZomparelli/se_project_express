const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");

// Public routes
router.post("/signup", createUser);
router.post("/signin", login);

// Mixed route protection. Middleware declared per route.
router.use("/items", clothingItemRouter);

// One protected route in routes/users.js
router.use("/users", auth, userRouter);

module.exports = router;
