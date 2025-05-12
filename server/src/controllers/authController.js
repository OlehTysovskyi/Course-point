const jwt = require('jsonwebtoken');
const User = require('../models/User');
const regReqService = require('../services/registrationRequestService');
const UserService = require('../services/userService'); // якщо потрібні інші методи

exports.requestSignup = async (req, res, next) => {
    try {
        const dto = req.body; // { name, email, role, password? }
        const reqDoc = await regReqService.submitRequest(dto);
        res.status(201).json(reqDoc);
    } catch (err) {
        next(err);
    }
};

exports.approveSignup = async (req, res, next) => {
    try {
        const user = await regReqService.approveRequest(req.params.id);
        res.json({ message: 'Акаунт створено', user });
    } catch (err) {
        next(err);
    }
};
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Невірні облікові дані' });
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
        res.json({ token });
    } catch (err) {
        next(err);
    }
};
