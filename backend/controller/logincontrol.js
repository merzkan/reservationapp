const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.getLogin = (req,res) => {
    res.json({message:"Login Page"})
}

exports.postLogin= async(req,res) => {
    try {
        const {email, password} =  req.body;

        const user = await User.findOne({email: email});
        if(!user){
            return res.status(401).json({message:"Böyle bir kullanıcı yok."});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({message:"Şifreniz yanlış."});
        }
        const token = jwt.sign({userId: user._id, isAdmin: user.isAdmin},process.env.SECRET_KEY,{expiresIn:"1h",})
        res.status(200).json({ 
            token, 
            isAdmin: user.isAdmin,
            user: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email
            }
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Sunucu hatası"});
    }
   
}