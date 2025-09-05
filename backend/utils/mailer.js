const nodemailer = require("nodemailer");

async function sendMail({ to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendMail };
