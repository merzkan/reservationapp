const Reservation = require("../models/reservation");

exports.createReservation = async(req, res) => {
    try {
        const {date, time , note} = req.body;
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);

        const existing = await Reservation.findOne({
            userId: req.userId,
            date: normalizedDate,
            time: time
        });
        if (existing) {
            return res.status(409).json({ message: "Bu tarih ve saatte zaten bir rezervasyonunuz var." });
        }

        const reservation = await Reservation.create({
            userId: req.userId, 
            date: normalizedDate,
            time,
            note
        });
        res.status(201).json(reservation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
}

exports.getReservation = async (req,res) => {
    try {
        const reservations = await Reservation.find({ userId: req.userId });
        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
}

exports.getAllReservation = async (req, res) => {
  try {
    const { date } = req.query; 
    if (!date) return res.status(400).json({ message: "Tarih gerekli" });
    const target = new Date(date);
    const startOfDay = new Date(target);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(target);
    endOfDay.setHours(23, 59, 59, 999);

    const reservations = await Reservation.find({  date: { $gte: startOfDay, $lte: endOfDay }  });
    const bookedTimes = reservations.map(r => r.time); 
    res.json(bookedTimes);
  } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
};

exports.getAllReservations = async (req, res) => { 
    try { const reservations = await Reservation.find().populate("userId", "name surname email"); 
        res.json(reservations);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
}

exports.getReservationByUserId = async (req, res) => {
  try {
    const { userId } = req.params; 
    if (!userId) return res.status(400).json({ message: "User ID gerekli" });
    const reservations = await Reservation.find({ userId });
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

exports.patchReservationById = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updated = await Reservation.findByIdAndUpdate(id, { status }, { new: true }).populate("userId", "name surname email");;
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Güncelleme hatası", error: err.message });
  }
};

exports.cancelMyReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findOne({ _id: id, userId: req.userId });
    if (!reservation) {
      return res.status(404).json({ message: "Rezervasyon bulunamadı" });
    }
    reservation.status = "iptal";
    await reservation.save();

    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};
