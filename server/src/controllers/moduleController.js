const moduleService = require('../services/moduleService');

exports.createModule = async (req, res, next) => {
    try {
        const mod = await moduleService.createModule(req.body);
        res.status(201).json(mod);
    } catch (err) {
        next(err);
    }
};

exports.getAllModules = async (req, res, next) => {
    try {
        const list = await moduleService.getAllModules();
        res.json(list);
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

exports.getModulesByCourseId = async (req, res, next) => {
    try {
        const modules = await moduleService.getModulesByCourseId(req.params.courseId);
        res.json(modules);
    } catch (err) {
        next(err);
    }
};

exports.updateModule = async (req, res, next) => {
    try {
        const updated = await moduleService.updateModule(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteModule = async (req, res, next) => {
    try {
        await moduleService.deleteModule(req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};
