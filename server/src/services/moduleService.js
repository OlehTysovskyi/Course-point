const moduleRepository = require('../repositories/moduleRepository');

class ModuleService {
    async createModule(dto) {
        const { title, lessons = [], graded = false, questions = [] } = dto;

        // 1) Валідація
        if (!title || typeof title !== 'string') {
            const err = new Error('Поле title є обов’язковим і має бути рядком');
            err.statusCode = 400;
            throw err;
        }
        if (!Array.isArray(lessons)) {
            const err = new Error('Поле lessons має бути масивом');
            err.statusCode = 400;
            throw err;
        }
        if (typeof graded !== 'boolean') {
            const err = new Error('Поле graded має бути булевим');
            err.statusCode = 400;
            throw err;
        }
        if (!Array.isArray(questions)) {
            const err = new Error('Поле questions має бути масивом');
            err.statusCode = 400;
            throw err;
        }

        // 2) Створення через репозиторій
        return moduleRepository.create({ title, lessons, graded, questions });
    }

    async getAllModules() {
        return moduleRepository.findAll();
    }

    async getModuleById(id) {
        const mod = await moduleRepository.findById(id);
        if (!mod) {
            const err = new Error('Модуль не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return mod;
    }
}

module.exports = new ModuleService();
