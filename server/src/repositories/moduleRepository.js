const Module = require('../models/Module');

class ModuleRepository {
    async create(data) {
        return Module.create(data);
    }

    async findAll() {
        return Module.find();
    }

    async findById(id) {
        return Module.findById(id);
    }

    async updateById(id, updateData) {
        return Module.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });
    }

    async deleteById(id) {
        return Module.findByIdAndDelete(id);
    }
}

module.exports = new ModuleRepository();
