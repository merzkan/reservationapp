const express = require("express");
const router = express.Router();

const registercontrol = require("../controller/registercontrol")
const logIP  = require("../middleware/logger");

router.get("/register",registercontrol.getRegister);

router.post("/register",logIP, registercontrol.postRegister)

module.exports = router;
