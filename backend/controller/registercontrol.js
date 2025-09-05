const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.getRegister = (req,res) => {
    res.json({message:"Register Page"})
}

exports.postRegister =  async(req,res) => {
    const {name, surname, email, password, repassword} =  req.body;
    try {
        const user = await User.findOne({email})
        if(user){
            return res.status(409).json({ message:"böyle bir kullanıcı zaten var"})
        }
        if(password.length < 8){
            return res.status(400).json({ message: "Şifre 8 karakterden az olamaz" });
        }
        if(!(repassword===password)){
            return res.status(400).json({ message: "Şifreler eşleşmiyor." });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({name, surname, password: hashedPassword, email});
        return res.status(200).json({ message:"Kullanıcı oluşturuldu." });

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Kayıt sırasında hata oluştu"});
    }

}