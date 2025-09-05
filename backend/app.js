const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./config/db");
const { securityHeaders, limiter } = require("./middleware/security");
const corsMiddleware = require('./middleware/cors');

const routerUsers = require("./router/users");
const routerHome = require("./router/home");
const routerLogin = require("./router/login");
const routerRegister = require("./router/register");
const routerReservation = require("./router/reservation");
const routerSetting = require("./router/setting");
const routerexception = require("./router/exception");
const authSetting = require("./router/auth");

const app = express();

app.set("trust proxy", true);

app.use(corsMiddleware);
                       
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(securityHeaders);

app.use(limiter);

app.use(routerHome);
app.use(routerLogin);
app.use(routerRegister);
app.use(routerUsers);
app.use(routerReservation);
app.use(routerSetting);
app.use(routerexception);
app.use(authSetting);

const PORT = process.env.PORT || 3000;

db();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
