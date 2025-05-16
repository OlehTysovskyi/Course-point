const moduleRepo = require('../repositories/moduleRepository');

class ModuleService {
    async createModule(dto) {
        const { title, course, lessons = [], graded = false, grade = 0, questions = [] } = dto;
        if (!course) {
            const err = new Error('Поле course (ID курсу) є обов’язковим');
            err.statusCode = 400; throw err;
        }

        if (!title || typeof title !== 'string') {
            const err = new Error('Поле title є обов’язковим');
            err.statusCode = 400; throw err;
        }
        if (typeof graded !== 'boolean') {
            const err = new Error('Поле graded має бути булевим');
            err.statusCode = 400; throw err;
        }

        if (!title || typeof title !== 'string') {
            const err = new Error('title є обов’язковим і має бути рядком');
            err.statusCode = 400; throw err;
        }
        if (!Array.isArray(lessons) || typeof graded !== 'boolean' || !Array.isArray(questions)) {
            const err = new Error('Невірні типи полів lessons/graded/questions');
            err.statusCode = 400; throw err;
        }
        if (graded) {
            if (typeof grade !== 'number' || grade <= 0) {
                const err = new Error('Поле grade обовʼязкове для оцінювального модуля і має бути додатнім числом');
                err.statusCode = 400;
                throw err;
            }
        }
        return moduleRepo.create({ title, course, lessons, graded, grade, questions });
    }

    async getAllModules() {
        return moduleRepo.findAll();
    }

    async getModuleById(id) {
        const mod = await moduleRepo.findById(id);
        if (!mod) {
            const err = new Error('Модуль не знайдено');
            err.statusCode = 404; throw err;
        }
        return mod;
    }

    async getModulesByCourseId(courseId) {
        return moduleRepo.findByCourseId(courseId);
    }

    async updateModule(id, dto) {
        const { title, lessons, graded, questions } = dto;
        const updateData = {};
        if (title !== undefined) {
            if (!title || typeof title !== 'string') {
                const err = new Error('title має бути рядком'); err.statusCode = 400; throw err;
            }
            updateData.title = title;
        }
        if (lessons !== undefined) {
            if (!Array.isArray(lessons)) {
                const err = new Error('lessons має бути масивом'); err.statusCode = 400; throw err;
            }
            updateData.lessons = lessons;
        }
        if (graded !== undefined) {
            if (typeof graded !== 'boolean') {
                const err = new Error('graded має бути boolean'); err.statusCode = 400; throw err;
            }
            updateData.graded = graded;
        }
        if (questions !== undefined) {
            if (!Array.isArray(questions)) {
                const err = new Error('questions має бути масивом'); err.statusCode = 400; throw err;
            }
            updateData.questions = questions;
        }
        const updated = await moduleRepo.updateById(id, updateData);
        if (!updated) {
            const err = new Error('Модуль не знайдено'); err.statusCode = 404; throw err;
        }
        return updated;
    }

    async deleteModule(id) {
        const deleted = await moduleRepo.deleteById(id);
        if (!deleted) {
            const err = new Error('Модуль не знайдено'); err.statusCode = 404; throw err;
        }
        return deleted;
    }
}

module.exports = new ModuleService();
