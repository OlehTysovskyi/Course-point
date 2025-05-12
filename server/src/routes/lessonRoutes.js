// server/src/routes/lessonRoutes.js

const router = require('express').Router();
const {
    createLesson,
    getAllLessons,
    getLessonById
} = require('../controllers/lessonController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Керування уроками
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ContentBlock:
 *       type: object
 *       required:
 *         - id
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         type:
 *           type: string
 *           enum: [heading, paragraph, list, quote, code, video, image, quiz]
 *         level:
 *           type: integer
 *           description: Рівень заголовка (для type=heading)
 *           example: 2
 *         text:
 *           type: string
 *           description: Текст для paragraph|heading|quote
 *         items:
 *           type: array
 *           items:
 *             type: string
 *           description: Пункти списку (для type=list)
 *         code:
 *           type: string
 *           description: Код (для type=code)
 *         url:
 *           type: string
 *           description: Посилання на відео (для type=video)
 *           format: uri
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: URL зображень (для type=image)
 *         question:
 *           type: string
 *           description: Питання (для type=quiz)
 *         answers:
 *           type: array
 *           items:
 *             type: string
 *           description: Варіанти відповідей (для type=quiz)
 *         correctIndex:
 *           type: integer
 *           description: Індекс правильної відповіді (для type=quiz)
 *     Lesson:
 *       type: object
 *       required:
 *         - _id
 *         - title
 *         - blocks
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         blocks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ContentBlock'
 *         createdAt:
 *           type: string
 *           format: date-time
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
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId уроку
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
 *             required:
 *               - title
 *               - blocks
 *             properties:
 *               title:
 *                 type: string
 *               blocks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ContentBlock'
 *     responses:
 *       201:
 *         description: Урок створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       401:
 *         description: Не авторизовано / недостатньо прав
 */
router.post('/', protect, restrictTo('teacher'), createLesson);

module.exports = router;
