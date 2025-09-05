const Exception = require("../models/exception");
const cron = require("node-cron");

exports.getAllExceptions = async (req, res) => {
  try {
    const exceptions = await Exception.find().sort({ startDate: 1, startTime: 1 });
    res.json(exceptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "İstisnalar getirilemedi" });
  }
};

exports.addException = async (req, res) => {
  try {
    const { startDate, endDate, startTime, endTime } = req.body;

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: "Bitiş tarihi, başlangıç tarihinden önce olamaz!" });
    }

    const newException = new Exception({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime,
      endTime
    });

    await newException.save();
    res.status(201).json({ message: "İstisna başarıyla eklendi", exception: newException });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "İstisna eklenemedi" });
  }
};

exports.deleteException = async (req, res) => {
  try {
    const { id } = req.params;
    await Exception.findByIdAndDelete(id);
    res.json({ message: "İstisna silindi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "İstisna silinemedi" });
  }
};

cron.schedule("0 0 * * *", async () => { 
  try {
    const now = new Date();
    const exceptions = await Exception.find();

    for (const ex of exceptions) {
      const exceptionEnd = new Date(ex.endDate); 
      const [hour, minute] = ex.endTime.split(":").map(Number);
      exceptionEnd.setHours(hour, minute, 0, 0);

      if (exceptionEnd < now) {
        await Exception.findByIdAndDelete(ex._id);
        console.log(`İstisna silindi: ${ex.startDate.toISOString()} - ${ex.endDate.toISOString()} ${ex.startTime}-${ex.endTime}`);
      }
    }
  } catch (err) {
    console.error("İstisna temizleme hatası:", err);
  }
});
