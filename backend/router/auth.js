const express = require("express");
const router = express.Router();
const { forgotPassword, resetPassword } = require("../controller/authcontrol");
const logIP  = require("../middleware/logger");

router.post("/forgot-password",logIP, forgotPassword);
router.post("/reset-password/:token",logIP, resetPassword);

module.exports = router;
