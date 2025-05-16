const progressRepo = require('../repositories/progressRepository');
const moduleRepo = require('../repositories/ModuleRepository');

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

    async getCoursesByUser(userId) {
        // 1) отримуємо Progress[] з populated.course
        const progresses = await progressRepo.findByUser(userId);
        // 2) повертаємо масив тільки полів course
        return progresses.map(p => p.course);
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
     * @param {{ userId, courseId, lessonId?, moduleId? }}
     */
    async updateProgress({ userId, courseId, lessonId, moduleId, answersMap }) {
        const mod = await moduleRepo.findById(moduleId);
        if (!mod) throw new Error('Module not found');

        let score = 0;

        if (answersMap) {
            const questionsCount = mod.questions.length;
            console.log("a" + questionsCount);
            const questionWeight = mod.grade / questionsCount;
            console.log("b" + questionWeight);

            mod.questions.forEach((q, i) => {
                const selected = (answersMap[i] || []).sort();
                const correct = (q.correctAnswers || []).sort();

                // Кількість правильних вибраних відповідей
                const correctSelectedCount = selected.filter(v => correct.includes(v)).length;

                // Кількість неправильних вибраних відповідей
                const incorrectSelectedCount = selected.filter(v => !correct.includes(v)).length;

                // Частка правильних відповідей по питанню
                const correctRatio = correct.length > 0 ? (correctSelectedCount / correct.length) : 0;

                // Штраф за неправильні відповіді (підкоригуй, якщо потрібно)
                const penaltyPerWrong = 0.25;
                let questionScore = correctRatio - (penaltyPerWrong * incorrectSelectedCount);
                if (questionScore < 0) questionScore = 0;

                score += questionScore * questionWeight;
            });

            // Масштабуємо відносний бал до максимальної оцінки модуля
            const maxScore = mod.maxScore || 1; // якщо maxScore не вказано — 1 (щоб не було помилки)
            score = score * maxScore;
        }

        let progress = await progressRepo.findByUserAndCourse(userId, courseId);
        if (!progress) {
            progress = await progressRepo.create({
                user: userId,
                course: courseId,
                passedModules: [],
                completedLessons: [],
                grade: 0,
            });
        }

        if (!progress.passedModules.includes(moduleId)) {
            progress.passedModules.push(moduleId);
            progress.grade += score;
        }

        await progressRepo.update(progress);
        return progress;
    }

    /**
     * Видалити прогрес (наприклад при виході з курсу)
     */
    async unenroll(userId, courseId) {
        return progressRepo.deleteByUserAndCourse(userId, courseId);
    }
}

module.exports = new ProgressService();
