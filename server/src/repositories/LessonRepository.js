const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

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
        return Lesson.find({ courseId: courseId });
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
