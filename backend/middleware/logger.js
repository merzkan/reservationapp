const express = require("express");

const logIP = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.ip;
  console.log("Gelen IP:", ip, "| Route:", req.method, req.originalUrl);
  next();
};

module.exports = logIP;
