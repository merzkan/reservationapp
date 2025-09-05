const User = require("../models/user");

exports.getUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 15;
    const totalUsers = await User.countDocuments(); 

    const users = await User.find()
      .skip(page*limit)
      .limit(limit)
      .exec();

    const userList = users.map(user => ({
      id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
    }));
    return res.json({
       users: userList,
       total: totalUsers,
       page,
       limit
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kullanıcılar alınamadı" });
  }
};

exports.deleteUser = async(req,res) => {
    const userId = req.params.id;
    try {   
      const deletedUser = await User.findByIdAndDelete(userId);  
      if (!deletedUser) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    res.json({ message: "Kullanıcı başarıyla silindi" , user: deletedUser});    
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı silinemedi" });
    }
}

exports.updateUser = async(req,res) => {
    const userId = req.params.id;
    const updateData = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {new: true})
        if (!updatedUser) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        res.json({ message: "Kullanıcı başarıyla güncellendi", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı güncellenemedi", error: error.message });
    }
}

exports.searchUser = async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 15;

  try {
    const filter = {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { surname: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ]
    };
    const users = await User.find(filter)
      .skip(page * limit)
      .limit(limit)
      .exec();

    const total = await User.countDocuments(filter);

    const userList = users.map(user => ({
      id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
    }));

    res.json({
      users: userList,
      total,
      page,
      limit
    });
  } catch (error) {
    res.status(500).json({ message: "Kullanıcılar aranamadı" });
  }
};
