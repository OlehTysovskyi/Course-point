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

    async updateProgress({ userId, courseId, moduleId, answersMap }) {

        const module = await require('../models/Module').findById(moduleId);
        if (!module) throw Object.assign(new Error('Модуль не знайдено'), { statusCode: 404 });

        const G = module.grade || 0;
        const Q = module.questions.length;
        const W = Q > 0 ? G / Q : 0;

        let totalDelta = 0;

        module.questions.forEach((q, idx) => {
            const selected = answersMap[idx] || [];
            const A = q.answers.length;
            const C = q.correctAnswers.length;
            const SC = selected.filter(i => q.correctAnswers.includes(i)).length;
            const SW = selected.length - SC;

            const rawScore = C > 0 ? W * (SC / C) : 0;
            const penalty = (A - C) > 0 ? W * (SW / (A - C)) : 0;
            const score_i = Math.max(0, rawScore - penalty);

            totalDelta += score_i;
        });

        let p = await progressRepo.findByUserAndCourse(userId, courseId);
        if (!p) p = await progressRepo.create({ user: userId, course: courseId });

        if (!p.passedModules.includes(moduleId)) {
            p.passedModules.push(moduleId);
        }

        p.grade = (p.grade || 0) + totalDelta;

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
