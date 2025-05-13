const lessonRepository = require('../repositories/lessonRepository');
const { v4: uuidv4 } = require('uuid');

const mongoose = require('mongoose');

class LessonService {
    async createLesson(dto) {
        const { title, blocks, courseId } = dto;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            const err = new Error('Невірний формат courseId');
            err.statusCode = 400;
            throw err;
        }

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

        const normalized = blocks.map(b => ({
            id: b.id || uuidv4(),
            ...b
        }));

        return lessonRepository.create({ title, blocks: normalized, courseId });
    }

    async getAllLessons() {
        return lessonRepository.findAll();
    }

    async getLessonById(id) {
        const lesson = await lessonRepository.findById(id);
        if (!lesson) {
            const err = new Error('Урок не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return lesson;
    }

    async updateLesson(id, dto) {
        const { title, blocks } = dto;
        if (title !== undefined && typeof title !== 'string') {
            const err = new Error('title має бути рядком');
            err.statusCode = 400;
            throw err;
        }
        if (blocks !== undefined && !Array.isArray(blocks)) {
            const err = new Error('blocks має бути масивом');
            err.statusCode = 400;
            throw err;
        }
        let updateData = { ...dto };
        if (blocks) {
            updateData.blocks = blocks.map(b => ({
                id: b.id || uuidv4(),
                ...b
            }));
        }
        const updated = await lessonRepository.updateById(id, updateData);
        if (!updated) {
            const err = new Error('Урок не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return updated;
    }

    async deleteLesson(id) {
        const deleted = await lessonRepository.deleteById(id);
        if (!deleted) {
            const err = new Error('Урок не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return deleted;
    }
}

module.exports = new LessonService();
