// server/src/repositories/courseRepository.js

const Course = require('../models/Course');

class CourseRepository {
    /**
     * Створити курс
     * @param {Object} data — { title, description, teacher, lessons, modules, published }
     * @returns {Promise<Course>}
     */
    async create(data) {
        return Course.create(data);
    }

    /**
     * Знайти всі опубліковані курси
     * @returns {Promise<Course[]>}
     */
    async findAllPublished() {
        return Course.find({ published: true })
            .populate('teacher', 'name email')
            .populate('lessons')
            .populate('modules');
    }

    /**
     * Знайти курс за ID
     * @param {string} id
     * @returns {Promise<Course|null>}
     */
    async findById(id) {
        return Course.findById(id)
            .populate('teacher', 'name email')
            .populate('lessons')
            .populate('modules');
    }
}

module.exports = new CourseRepository();
