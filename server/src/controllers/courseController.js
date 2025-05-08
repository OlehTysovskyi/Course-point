const courseService = require('../services/courseService');

exports.createCourse = async (req, res, next) => {
    try {
        const course = await courseService.create(req.body, req.user._id);
        res.status(201).json(course);
    } catch (err) {
        next(err);
    }
};

exports.getAllCourses = async (req, res, next) => {
    try {
        const courses = await courseService.getAll();
        res.json(courses);
    } catch (err) {
        next(err);
    }
};

exports.getCourseById = async (req, res, next) => {
    try {
        const course = await courseService.getById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Курс не знайдено' });
        res.json(course);
    } catch (err) {
        next(err);
    }
};
