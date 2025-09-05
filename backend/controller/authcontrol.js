import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import { sendMail } from "../utils/mailer.js";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendMail({
      to: email,
      subject: "Şifre Sıfırlama",
      html: `
        <p>Şifreni sıfırlamak için aşağıdaki linke tıkla (15 dk geçerli):</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });
    return res.json({ message: "Şifre sıfırlama maili gönderildi" });
  } catch (error) {
    return res.status(500).json({ message: "Hata oluştu", error: error.message });
  }
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.json({ message: "Şifre başarıyla güncellendi" });
  } catch (error) {
    return res.status(400).json({ message: "Geçersiz veya süresi dolmuş token" });
  }
};
