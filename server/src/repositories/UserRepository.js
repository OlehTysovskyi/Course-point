// server/src/repositories/userRepository.js

const User = require('../models/User');

class UserRepository {
    /**
     * Створити нового користувача
     * @param {Object} userData — { name, email, password, role }
     * @returns {Promise<User>}
     */
    async create(userData) {
        const user = await User.create(userData);
        return user;
    }

    /**
     * Знайти користувача за ID
     * @param {string} id
     * @returns {Promise<User|null>}
     */
    async findById(id) {
        return User.findById(id).select('-password');
    }

    /**
     * Знайти всіх користувачів
     * @returns {Promise<User[]>}
     */
    async findAll() {
        return User.find().select('-password');
    }

    /**
     * Знайти користувача за email
     * @param {string} email
     * @returns {Promise<User|null>}
     */
    async findByEmail(email) {
        return User.findOne({ email });
    }

    /**
     * Оновити дані користувача
     * @param {string} id
     * @param {Object} updateData
     * @returns {Promise<User|null>}
     */
    async updateById(id, updateData) {
        return User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
            select: '-password'
        });
    }

    /**
     * Видалити користувача за ID
     * @param {string} id
     * @returns {Promise<User|null>}
     */
    async deleteById(id) {
        return User.findByIdAndDelete(id);
    }
}

module.exports = new UserRepository();
