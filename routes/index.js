const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { createUser } = require("../controllers/users");

// Public routes
router.post("/signup", createUser);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

module.exports = router;
