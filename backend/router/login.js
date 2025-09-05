const express = require("express");
const router = express.Router();

const logincontrol = require("../controller/logincontrol")
const logIP  = require("../middleware/logger");

router.get("/login",logincontrol.getLogin);

router.post("/login",logIP, logincontrol.postLogin);


module.exports = router;
