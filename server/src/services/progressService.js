const progressRepo = require('../repositories/progressRepository');

class ProgressService {
    /**
     * Створити запис прогресу при вступі на курс
     */
    async enroll(userId, courseId) {
        // Перевіряємо, чи вже є
        const existing = await progressRepo.findByUserAndCourse(userId, courseId);
        if (existing) return existing;

        return progressRepo.create({ user: userId, course: courseId });
    }

    /**
     * Отримати прогрес користувача по курсу
     */
    async getProgress(userId, courseId) {
        const p = await progressRepo.findByUserAndCourse(userId, courseId);
        if (!p) {
            const err = new Error('Прогрес не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return p;
    }

    /**
     * Оновити прогрес (додавання уроку, модуля та оновлення grade)
     * @param {{ userId, courseId, lessonId?, moduleId?, deltaGrade? }}
     */
    async updateProgress({ userId, courseId, lessonId, moduleId, deltaGrade = 0 }) {
        let p = await progressRepo.findByUserAndCourse(userId, courseId);
        if (!p) {
            // якщо ще не зараховано – створюємо
            p = await progressRepo.create({ user: userId, course: courseId });
        }
        // додати урок
        if (lessonId && !p.completedLessons.includes(lessonId)) {
            p.completedLessons.push(lessonId);
        }
        // додати модуль
        if (moduleId && !p.passedModules.includes(moduleId)) {
            p.passedModules.push(moduleId);
        }
        // оновити бали
        if (typeof deltaGrade === 'number' && deltaGrade !== 0) {
            p.grade += deltaGrade;
        }
        return progressRepo.update(p);
    }

    /**
     * Видалити прогрес (наприклад при виході з курсу)
     */
    async unenroll(userId, courseId) {
        return progressRepo.deleteByUserAndCourse(userId, courseId);
    }
}

module.exports = new ProgressService();
