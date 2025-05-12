const moduleService = require('../services/moduleService');

exports.createModule = async (req, res, next) => {
    try {
        const module = await moduleService.createModule(req.body);
        res.status(201).json(module);
    } catch (err) {
        next(err);
    }
};

exports.getAllModules = async (req, res, next) => {
    try {
        const modules = await moduleService.getAllModules();
        res.json(modules);
    } catch (err) {
        next(err);
    }
};

exports.getModuleById = async (req, res, next) => {
    try {
        const mod = await moduleService.getModuleById(req.params.id);
        res.json(mod);
    } catch (err) {
        next(err);
    }
};
