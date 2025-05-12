const User = require('../models/User');

class UserRepository {
    async create(data) {
        return User.create(data);
    }

    async findAll() {
        return User.find().select('-password');
    }

    async findById(id) {
        return User.findById(id).select('-password');
    }

    async findByEmail(email) {
        return User.findOne({ email });
    }

    async updateById(id, updateData) {
        return User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
            select: '-password'
        });
    }

    async deleteById(id) {
        return User.findByIdAndDelete(id).select('-password');
    }
}

module.exports = new UserRepository();
