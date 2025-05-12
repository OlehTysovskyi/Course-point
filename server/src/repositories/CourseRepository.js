const Course = require('../models/Course');

class CourseRepository {
    async create(data) {
        return Course.create(data);
    }

    async findAllPublished() {
        return Course.find({ published: true })
            .populate('teacher', 'name email')
            .populate('lessons')
            .populate('modules');
    }

    async findById(id) {
        return Course.findById(id)
            .populate('teacher', 'name email')
            .populate('lessons')
            .populate('modules');
    }

    async updateById(id, updateData) {
        return Course.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        })
            .populate('teacher', 'name email')
            .populate('lessons')
            .populate('modules');
    }

    async deleteById(id) {
        return Course.findByIdAndDelete(id);
    }
}

module.exports = new CourseRepository();
