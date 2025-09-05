const express = require("express");
const router = express.Router();
const exceptionController = require("../controller/exceptionController");
const verifyToken = require('../middleware/auth');

router.get("/exceptions", exceptionController.getAllExceptions);
router.post("/exceptions", exceptionController.addException);
router.delete("/exceptions/:id", exceptionController.deleteException);

module.exports = router;
