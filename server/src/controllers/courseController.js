const courseService = require('../services/courseService');

exports.createCourse = async (req, res, next) => {
    try {
        const course = await courseService.createCourse(req.body, req.user._id);
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

exports.getCoursesByTeacher = async (req, res, next) => {
    try {
        const teacherId = req.params.teacherId;
        const courses = await courseService.getCoursesByTeacher(teacherId);
        res.json(courses);
    } catch (err) {
        next(err);
    }
};

exports.updateCourse = async (req, res, next) => {
    try {
        const updated = await courseService.updateCourse(
            req.params.id,
            req.body,
            req.user._id
        );
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteCourse = async (req, res, next) => {
    try {
        await courseService.deleteCourse(req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};
