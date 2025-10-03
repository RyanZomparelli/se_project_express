const router = require("express").Router();

// All my controllers(request handlers)
const { getUserById } = require("../controllers/users");

router.get("/:userId", getUserById);

module.exports = router;
