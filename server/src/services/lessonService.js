const lessonRepository = require('../repositories/lessonRepository');
const { v4: uuidv4 } = require('uuid');

class LessonService {
    /**
     * Створити урок із валідацією та UUID-блоками
     * @param {{ title: string, blocks: Array }} dto
     */
    async createLesson(dto) {
        const { title, blocks } = dto;
        // 1. Валідація
        if (!title || typeof title !== 'string') {
            const err = new Error('Поле title є обов’язковим і має бути рядком');
            err.statusCode = 400;
            throw err;
        }
        if (!Array.isArray(blocks)) {
            const err = new Error('Поле blocks має бути масивом');
            err.statusCode = 400;
            throw err;
        }

        // 2. Гарантуємо, що кожен блок має id
        const normalized = blocks.map(b => ({
            id: b.id || uuidv4(),
            ...b
        }));

        // 3. Записуємо через репозиторій
        return lessonRepository.create({ title, blocks: normalized });
    }

    /**
     * Отримати всі уроки
     */
    async getAllLessons() {
        return lessonRepository.findAll();
    }

    /**
     * Отримати урок за ID
     * @param {string} id
     */
    async getLessonById(id) {
        const lesson = await lessonRepository.findById(id);
        if (!lesson) {
            const err = new Error('Урок не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return lesson;
    }
}

module.exports = new LessonService();
