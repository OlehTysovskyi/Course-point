const User = require('../models/User');

exports.getAllUsers = async (req, res, next) => {
    const users = await User.find().select('-password');
    res.json(users);
};

exports.getUserById = async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
    res.json(user);
};