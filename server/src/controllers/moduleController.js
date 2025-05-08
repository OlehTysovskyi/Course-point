const Module = require('../models/Module');

exports.createModule = async (req, res, next) => {
    const module = await Module.create(req.body);
    res.status(201).json(module);
};

exports.getAllModules = async (req, res, next) => {
    const modules = await Module.find();
    res.json(modules);
};

exports.getModuleById = async (req, res, next) => {
    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ message: 'Модуль не знайдено' });
    res.json(module);
};
