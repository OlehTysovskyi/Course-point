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
}

module.exports = new ModuleRepository();
