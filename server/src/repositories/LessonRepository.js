const Lesson = require('../models/Lesson');

class LessonRepository {
    /**
     * Створити новий урок
     * @param {Object} data — { title, blocks }
     * @returns {Promise<Lesson>}
     */
    async create(data) {
        return Lesson.create(data);
    }

    /**
     * Отримати всі уроки
     * @returns {Promise<Lesson[]>}
     */
    async findAll() {
        return Lesson.find();
    }

    /**
     * Знайти урок за ID
     * @param {string} id
     * @returns {Promise<Lesson|null>}
     */
    async findById(id) {
        return Lesson.findById(id);
    }
}

module.exports = new LessonRepository();
