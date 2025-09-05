const express = require("express");
const router = express.Router();

const verifyToken = require('../middleware/auth');
const usercontrol = require("../controller/userscontrol")

router.get("/users",verifyToken,usercontrol.getUser);
router.delete("/users/delete/:id", verifyToken, usercontrol.deleteUser);
router.put("/users/update/:id", verifyToken, usercontrol.updateUser);
router.get("/users/search", verifyToken, usercontrol.searchUser);



module.exports = router;
