const Lesson = require('../models/Lesson');

class LessonRepository {
    async create(data) {
        return Lesson.create(data);
    }

    async findAll() {
        return Lesson.find();
    }

    async findById(id) {
        return Lesson.findById(id);
    }

    async findByCourseId(courseId) {
        const course = await Course.findById(courseId).select('lessons');
        if (!course) {
            const err = new Error('Курс не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return Lesson.find({ _id: { $in: course.lessons } });
    }

    async updateById(id, updateData) {
        return Lesson.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });
    }

    async deleteById(id) {
        return Lesson.findByIdAndDelete(id);
    }
}

module.exports = new LessonRepository();
