const Progress = require('../models/Progress');

class ProgressRepository {
    async create(data) {
        return Progress.create(data);
    }

    async findByUserAndCourse(userId, courseId) {
        return Progress.findOne({ user: userId, course: courseId });
    }

    async update(progress) {
        return progress.save();
    }

    async deleteByUserAndCourse(userId, courseId) {
        return Progress.findOneAndDelete({ user: userId, course: courseId });
    }
}

module.exports = new ProgressRepository();
