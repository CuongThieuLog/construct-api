let router = require("express").Router();
let UserController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");

router.post("/register", UserController.register);
router.get("/user/me", auth, UserController.find);
router.get("/user", auth, UserController.getAll);

module.exports = router;
