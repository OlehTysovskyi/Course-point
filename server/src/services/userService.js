// server/src/services/userService.js

const userRepository = require('../repositories/userRepository');

class UserService {
    /**
     * Повертає всіх користувачів (без паролів)
     * @returns {Promise<Array>}
     */
    async getAllUsers() {
        // Репозиторій сам робить .select('-password')
        return userRepository.findAll();
    }

    /**
     * Повертає одного користувача за ID
     * @param {String} id
     * @returns {Promise<Object>}
     * @throws {Error} Якщо користувача не знайдено
     */
    async getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Користувача не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return user;
    }

    /**
     * Створює нового користувача
     * @param {Object} data — { name, email, password, role }
     * @returns {Promise<Object>}
     */
    async createUser(data) {
        // тут можна додати валідацію (наприклад, перевірити email на унікальність)
        return userRepository.create(data);
    }

    /**
     * Оновлює користувача за ID
     * @param {String} id
     * @param {Object} updateData
     * @returns {Promise<Object>}
     * @throws {Error} Якщо користувача не знайдено
     */
    async updateUser(id, updateData) {
        const updated = await userRepository.updateById(id, updateData);
        if (!updated) {
            const err = new Error('Користувача не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return updated;
    }

    /**
     * Видаляє користувача за ID
     * @param {String} id
     * @returns {Promise<void>}
     * @throws {Error} Якщо користувача не знайдено
     */
    async deleteUser(id) {
        const deleted = await userRepository.deleteById(id);
        if (!deleted) {
            const err = new Error('Користувача не знайдено');
            err.statusCode = 404;
            throw err;
        }
    }
}

module.exports = new UserService();
