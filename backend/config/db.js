const mongoose = require('mongoose');


const db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
         console.log("MongoDB bağlantısı başarılı");
    } catch (error) {
        console.error("MongoDB bağlantı hatası:", error);
    }
}

module.exports = db;



