const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");

// Public routes
router.post("/signup", createUser);
router.post("/signin", login);

// Mixed route protection. Middleware declared per route.
router.use("/items", clothingItemRouter);

router.use("/users", userRouter);

module.exports = router;
