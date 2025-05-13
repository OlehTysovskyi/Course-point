const regReqService = require('../services/registrationRequestService');
const UserService = require('../services/userService'); // якщо потрібні інші методи
const authService = require('../services/authService');

exports.requestSignup = async (req, res, next) => {
    try {
        const dto = req.body; // { name, email, role, password? }
        const reqDoc = await regReqService.submitRequest(dto);
        res.status(201).json(reqDoc);
    } catch (err) {
        next(err);
    }
};

/** @desc Отримати всі заявки (admin) */
exports.getAllRequests = async (req, res, next) => {
    try {
        const list = await regReqService.getAllRequests();
        res.json(list);
    } catch (err) {
        next(err);
    }
};

/** @desc Отримати заявку за ID (admin) */
exports.getRequestById = async (req, res, next) => {
    try {
        const reqDoc = await regReqService.getRequestById(req.params.id);
        res.json(reqDoc);
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
        const token = await authService.login(req.body);
        res.json({ token });
    } catch (err) {
        next(err);
    }
};


