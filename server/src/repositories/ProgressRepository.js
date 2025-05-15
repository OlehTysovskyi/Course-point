const Progress = require('../models/Progress');

class ProgressRepository {
    async create(data) {
        return Progress.create(data);
    }

    async findByUser(userId) {
        return Progress.find({ user: userId }).populate({
            path: 'course',
            populate: [
                { path: 'teacher', select: 'name email' },
                { path: 'lessons' },
                { path: 'modules' }
            ]
        });
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
