const mongoose = require("mongoose");

const Setting = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"],
    required: true,
    unique: true
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  openTime: {
    type: String,
  },
  closeTime: {
    type: String, 
  },
  slotDuration: {
    type: Number,
    default: 60
  }
});

module.exports = mongoose.model("Setting", Setting);
