const progressRepo = require('../repositories/progressRepository');
const moduleRepo = require('../repositories/ModuleRepository');
const lessonRepo = require('../repositories/LessonRepository');

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
            return null;
        }
        return p;
    }

    /**
     * Оновити прогрес (додавання уроку, модуля та оновлення grade)
     * @param {{ userId, courseId, lessonId? }}
     */
    async updateProgressForLesson({ userId, courseId, lessonId }) {
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

        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
        }

        await progressRepo.update(progress);
        return progress;
    }

    /**
     * Оновити прогрес (додавання уроку, модуля та оновлення grade)
     * @param {{ userId, courseId, moduleId? }}
     */
    async updateProgressForModule({ userId, courseId, moduleId, answersMap }) {
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

                const correctSelectedCount = selected.filter(v => correct.includes(v)).length;

                const incorrectSelectedCount = selected.filter(v => !correct.includes(v)).length;

                const correctRatio = correct.length > 0 ? (correctSelectedCount / correct.length) : 0;

                const penaltyPerWrong = 0.25;
                let questionScore = correctRatio - (penaltyPerWrong * incorrectSelectedCount);
                if (questionScore < 0) questionScore = 0;

                score += questionScore * questionWeight;
            });

            const maxScore = mod.maxScore || 1;
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
