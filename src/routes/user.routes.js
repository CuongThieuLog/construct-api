let router = require("express").Router();
let UserController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/admin.middleware");

router.post("/register", UserController.register);
router.get("/user/me", auth, UserController.find);
router.get("/user", [auth, isAdmin], UserController.getAll);
router.post("/user-info", [auth, isAdmin], UserController.createUserInfo);
router.put(
  "/user-info/:userId",
  [auth, isAdmin],
  UserController.createUserInfo
);
router.delete(
  "/user-info/:userId",
  [auth, isAdmin],
  UserController.getUserInfoById
);
router.get("/user-info/:userId", auth, UserController.getUserInfoById);

module.exports = router;
