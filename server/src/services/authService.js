const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthService {
    /**
     * Логінить користувача, повертає JWT
     * @param {{ email: string, password: string }} dto
     * @returns {Promise<string>} — токен
     */
    async login({ email, password }) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            const err = new Error('Невірні облікові дані');
            err.statusCode = 401;
            throw err;
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            const err = new Error('Невірні облікові дані');
            err.statusCode = 401;
            throw err;
        }

        const payload = { id: user._id, email: user. _email, role: user.role };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return token;
    }
}

module.exports = new AuthService();
