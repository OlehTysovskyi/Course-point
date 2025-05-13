const lessonService = require('../services/lessonService');

exports.createLesson = async (req, res, next) => {
    try {
        const lesson = await lessonService.createLesson(req.body);
        res.status(201).json(lesson);
    } catch (err) {
        next(err);
    }
};

exports.getAllLessons = async (req, res, next) => {
    try {
        const lessons = await lessonService.getAllLessons();
        res.json(lessons);
    } catch (err) {
        next(err);
    }
};

exports.getLessonById = async (req, res, next) => {
    try {
        const lesson = await lessonService.getLessonById(req.params.id);
        res.json(lesson);
    } catch (err) {
        next(err);
    }
};

exports.updateLesson = async (req, res, next) => {
    try {
        const updated = await lessonService.updateLesson(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteLesson = async (req, res, next) => {
    try {
        await lessonService.deleteLesson(req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};
