const userRepo = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');

class UserService {
    async createUser(dto) {
        const { name, email, password, role } = dto;
        if (!name || !email || !password) {
            const err = new Error('name, email та password — обов’язкові');
            err.statusCode = 400;
            throw err;
        }
        if (await userRepo.findByEmail(email)) {
            const err = new Error('Email уже використовується');
            err.statusCode = 400;
            throw err;
        }
        const hashed = await bcrypt.hash(password, 10);
        return userRepo.create({ name, email, password: hashed, role });
    }

    async getAllUsers() {
        return userRepo.findAll();
    }

    async getUserById(id) {
        const user = await userRepo.findById(id);
        if (!user) {
            const err = new Error('Користувача не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return user;
    }

    async updateUser(id, dto) {
        if (dto.password) {
            dto.password = await bcrypt.hash(dto.password, 10);
        }
        const updated = await userRepo.updateById(id, dto);
        if (!updated) {
            const err = new Error('Користувача не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return updated;
    }

    async deleteUser(id) {
        const deleted = await userRepo.deleteById(id);
        if (!deleted) {
            const err = new Error('Користувача не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return deleted;
    }
}

module.exports = new UserService();
