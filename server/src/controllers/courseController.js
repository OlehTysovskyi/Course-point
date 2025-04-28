const CourseService = require('../services/courseService');

exports.createCourse = async (req, res, next) => {
    const course = await CourseService.create(req.body, req.user.id);
    res.status(201).json(course);
};

exports.getAllCourses = async (req, res, next) => {
    const courses = await CourseService.getAll();
    res.json(courses);
};