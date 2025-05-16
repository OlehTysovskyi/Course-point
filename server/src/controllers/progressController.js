const progressService = require('../services/progressService');

exports.enroll = async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const progress = await progressService.enroll(req.user.id, courseId);
        res.status(201).json(progress);
    } catch (err) {
        next(err);
    }
};

exports.getUserCourses = async (req, res, next) => {
    try {
        const courses = await progressService.getCoursesByUser(req.user.id);
        res.json(courses);
    } catch (err) {
        next(err);
    }
};

exports.getProgress = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const progress = await progressService.getProgress(req.user.id, courseId);
        res.json(progress);
    } catch (err) {
        next(err);
    }
};

exports.updateProgress = async (req, res, next) => {
    try {
        const { lessonId, answersMap } = req.body;
        const { courseId, moduleId } = req.params;
        const userId = req.user.id;

        const progress = await progressService.updateProgress({
            userId,
            courseId,
            lessonId,
            moduleId,
            answersMap,
        });

        res.json(progress);
    } catch (err) {
        next(err);
    }
};


exports.unenroll = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        await progressService.unenroll(req.user.id, courseId);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};
