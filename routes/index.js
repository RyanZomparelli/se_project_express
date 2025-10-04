const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");

// Public routes
router.post("/signup", createUser);
router.post("/signin", login);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

module.exports = router;
