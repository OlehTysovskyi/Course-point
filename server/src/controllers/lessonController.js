const Lesson = require('../models/Lesson');

exports.createLesson = async (req, res, next) => {
    const lesson = await Lesson.create(req.body);
    res.status(201).json(lesson);
};

exports.getAllLessons = async (req, res, next) => {
    const lessons = await Lesson.find();
    res.json(lessons);
};

exports.getLessonById = async (req, res, next) => {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Урок не знайдено' });
    res.json(lesson);
};
