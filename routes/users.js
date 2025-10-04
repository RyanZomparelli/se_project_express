const router = require("express").Router();

// All my controllers(request handlers)
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
