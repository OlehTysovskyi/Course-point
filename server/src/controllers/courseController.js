// server/src/controllers/courseController.js

const courseService = require('../services/courseService');

exports.createCourse = async (req, res, next) => {
    try {
        const dto = req.body;
        const teacherId = req.user._id;
        const course = await courseService.createCourse(dto, teacherId);
        res.status(201).json(course);
    } catch (err) {
        next(err);
    }
};

exports.getAllCourses = async (req, res, next) => {
    try {
        const courses = await courseService.getAllCourses();
        res.json(courses);
    } catch (err) {
        next(err);
    }
};

exports.getCourseById = async (req, res, next) => {
    try {
        const course = await courseService.getCourseById(req.params.id);
        res.json(course);
    } catch (err) {
        next(err);
    }
};
