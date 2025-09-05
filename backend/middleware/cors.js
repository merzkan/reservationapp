const cors = require("cors");

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.LOCAL_URL
];

const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); 
    } else {
      callback(null, false);
    }
  },
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
});

module.exports = corsMiddleware;
