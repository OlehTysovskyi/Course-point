const router = require('express').Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const {
    createLesson,
    getAllLessons,
    getLessonById
} = require('../controllers/lessonController');

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Керування уроками
 */

/**
 * @swagger
 * /lessons:
 *   get:
 *     summary: Отримати всі уроки
 *     tags: [Lessons]
 *     responses:
 *       200:
 *         description: Список уроків
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 */
router.get('/', getAllLessons);

/**
 * @swagger
 * /lessons/{id}:
 *   get:
 *     summary: Отримати урок за ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *         description: ID уроку
 *     responses:
 *       200:
 *         description: Дані уроку
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Урок не знайдено
 */
router.get('/:id', getLessonById);

/**
 * @swagger
 * /lessons:
 *   post:
 *     summary: Створити новий урок
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               images:
 *                 type: array
 *                 items: { type: string }
 *               questions:
 *                 type: array
 *                 items: { type: object }
 *     responses:
 *       201:
 *         description: Урок створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       401:
 *         description: Не авторизовано
 */
router.post('/', protect, restrictTo('teacher'), createLesson);

module.exports = router;
