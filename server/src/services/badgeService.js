const Badge = require('../models/Badge');

exports.create = async (userId, courseId) => {
    return Badge.create({ user: userId, course: courseId });
};