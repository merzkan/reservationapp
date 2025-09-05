const express = require("express");
const router = express.Router();

const homecontroller = require("../controller/homecontrol")

router.get("/", homecontroller.getHome);

module.exports = router;
