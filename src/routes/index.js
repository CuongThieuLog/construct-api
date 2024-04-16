const express = require("express");

const userRoute = require("./user.routes");
const authRoute = require("./auth.routes");

const router = express.Router();

router.use("/", userRoute);
router.use("/", authRoute);

module.exports = router;
