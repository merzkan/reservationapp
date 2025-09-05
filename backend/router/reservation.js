const express = require("express");
const router = express.Router();
const reservationcontrol = require("../controller/reservationcontrol")
const verifyToken = require('../middleware/auth');

router.post("/reservation",verifyToken,reservationcontrol.createReservation)
router.get("/reservation/user",verifyToken,reservationcontrol.getReservation)
router.get("/reservation/all",verifyToken,reservationcontrol.getAllReservation)
router.get("/reservation/all-user",verifyToken,reservationcontrol.getAllReservations)
router.get("/reservation/user/:userId",verifyToken,reservationcontrol.getReservationByUserId)
router.patch("/reservation/:id/status", verifyToken, reservationcontrol.patchReservationById);
router.patch("/reservation/cancel/:id", verifyToken, reservationcontrol.cancelMyReservation);

module.exports = router;

