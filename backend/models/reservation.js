const mongoose = require("mongoose");

const Reservation = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, ref:"User",
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    note:{
        type: String,
    },
    createdAt:{ 
        type: Date, 
        default: Date.now 
    },
    status:{
        type: String,
        enum: ["aktif", "iptal", "tamamlandı"],
        default: "aktif"
    }
})

module.exports = mongoose.model("Reservation", Reservation);
