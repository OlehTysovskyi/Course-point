const router = require('express').Router();
const {
    enroll,
    getUserCourses,
    getProgress,
    updateProgress,
    unenroll
} = require('../controllers/progressController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Прогрес користувача у курсі
 */

/**
 * @swagger
 * /progress/courses:
 *   get:
 *     summary: Отримати всі курси, на які записаний поточний користувач
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Масив Course
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/courses', protect, getUserCourses);

/**
 * @swagger
 * /progress/enroll:
 *   post:
 *     summary: Записати користувача до курсу (створити Progress)
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId]
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: ID курсу
 *     responses:
 *       201:
 *         description: Створено запис прогресу
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Progress'
 */
router.post('/enroll', protect, enroll);

/**
 * @swagger
 * /progress/{courseId}:
 *   get:
 *     summary: Отримати прогрес поточного користувача в курсі
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Дані прогресу
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Progress'
 *       404:
 *         description: Прогрес не знайдено
 */
router.get('/:courseId', protect, getProgress);

/**
 * @swagger
 * /progress/{courseId}:
 *   patch:
 *     summary: Оновити прогрес (додати lesson, module, grade)
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lessonId:
 *                 type: string
 *               moduleId:
 *                 type: string
 *               deltaGrade:
 *                 type: number
 *                 description: Кількість балів для додавання
 *     responses:
 *       200:
 *         description: Оновлений прогрес
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Progress'
 */
router.patch('/:courseId', protect, updateProgress);

/**
 * @swagger
 * /progress/{courseId}:
 *   delete:
 *     summary: Видалити запис прогресу (вийти з курсу)
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Прогрес видалено
 */
router.delete('/:courseId', protect, unenroll);

module.exports = router;
