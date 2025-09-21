const router = require("express").Router();

//All my controllers(request handlers)
const { getUsers, getUserById, createUser } = require("../controllers/users");

// These routes are cumulative. The base routes in index.js specify the resources
// like '/users' or '/items'. These routes build on top of those:
// "/" becomes "/users", "/:userId" becomes "/users/:userId", etc.
router.get("/", getUsers);
//These are all express router methods the specify an HTTP method to listen to and
//take a route path as a string and a callback function.
router.get("/:userId", getUserById);
router.post("/", createUser);

module.exports = router;
