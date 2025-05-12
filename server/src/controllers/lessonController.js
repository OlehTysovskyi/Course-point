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
