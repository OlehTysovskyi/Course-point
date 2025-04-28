const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RegistrationRequest = require('../models/RegistrationRequest');
const EmailService = require('../utils/EmailService');

exports.requestSignup = async (req, res, next) => {
    const { name, email, role } = req.body;
    const exists = await RegistrationRequest.findOne({ email, status: 'pending' });
    if (exists) return res.status(400).json({ message: 'Заявка вже в очікуванні' });
    const reqDoc = await RegistrationRequest.create({ name, email, role });
    res.status(201).json(reqDoc);
};

exports.register = async (req, res, next) => {
    const { requestId } = req.params;
    const reqDoc = await RegistrationRequest.findById(requestId);
    if (!reqDoc) return res.status(404).json({ message: 'Заявка не знайдена' });
    if (reqDoc.status !== 'approved') return res.status(400).json({ message: 'Заявка не затверджена' });
    const user = await User.create({
        name: reqDoc.name,
        email: reqDoc.email,
        password: req.body.password,
        role: reqDoc.role
    });
    reqDoc.status = 'completed';
    await reqDoc.save();
    EmailService.sendWelcome(user.email);
    res.status(201).json(user);
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Невірні облікові дані' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
};