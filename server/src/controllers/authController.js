const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RegistrationRequest = require('../models/RegistrationRequest');
const EmailService = require('../utils/EmailService');

exports.requestSignup = async (req, res, next) => {
    try {
        const { name, email, role, password } = req.body;
        const existsReq = await RegistrationRequest.findOne({ email });
        const existsUser = await User.findOne({ email });
        if (existsReq || existsUser) {
            return res.status(400).json({ message: 'Email вже використовується' });
        }
        const reqDoc = await RegistrationRequest.create({ name, email, role, password });
        res.status(201).json(reqDoc);
    } catch (err) {
        next(err);
    }
};

exports.approveSignup = async (req, res, next) => {
    try {
        const reqDoc = await RegistrationRequest.findById(req.params.id);
        if (!reqDoc) {
            return res.status(404).json({ message: 'Заявка не знайдена' });
        }
        // Створюємо користувача з тими ж даними (пароль вже захешовано)
        const user = await User.create({
            name: reqDoc.name,
            email: reqDoc.email,
            password: reqDoc.password,
            role: reqDoc.role
        });
        reqDoc.status = 'approved';
        await reqDoc.save();
        EmailService.sendWelcome(user.email);
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
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
        res.json({ token });
    } catch (err) {
        next(err);
    }
};
