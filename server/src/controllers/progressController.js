const Progress = require('../models/Progress');

exports.updateProgress = async (req, res, next) => {
    const { courseId, lessonId, moduleId } = req.body;
    let p = await Progress.findOne({ user: req.user.id, course: courseId });
    if (!p) p = await Progress.create({ user: req.user.id, course: courseId });
    if (lessonId && !p.completedLessons.includes(lessonId)) p.completedLessons.push(lessonId);
    if (moduleId && !p.passedModules.includes(moduleId)) p.passedModules.push(moduleId);
    await p.save();
    res.json(p);
};