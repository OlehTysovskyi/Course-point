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
