const express = require("express");
const router = express.Router();

const settingcontrol = require("../controller/settingcontrol")
const verifyToken = require('../middleware/auth');


router.get("/setting", verifyToken, settingcontrol.getSettings);
router.put("/setting", verifyToken, settingcontrol.putSetting);

module.exports = router;