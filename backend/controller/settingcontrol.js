const Setting = require("../models/setting");

exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.putSetting = async (req, res) => {
  const { settings } = req.body; 
  if (!Array.isArray(settings)) {
    return res.status(400).json({ message: "settings array olmalı" });
  }
  try {
    await Promise.all(
      settings.map((s) =>
        Setting.findOneAndUpdate(
          { dayOfWeek: s.dayOfWeek }, 
          { $set: s },                
          { new: true, upsert: true } 
        )
      )
    );
    res.json({ message: "Ayarlar başarıyla güncellendi." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
