const router = require('express').Router();
const {
    createCourse,
    getAllCourses,
    getCourseById
} = require('../controllers/courseController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Управління курсами
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Отримати всі опубліковані курси
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Список курсів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/', getAllCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Отримати курс за ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ID курсу
 *     responses:
 *       200:
 *         description: Дані курсу
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Курс не знайдено
 */
router.get('/:id', getCourseById);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Створити новий курс
 *     tags: [Courses]
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
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               lessons:
 *                 type: array
 *                 items: { type: string }
 *               modules:
 *                 type: array
 *                 items: { type: string }
 *               published:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Курс створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       401:
 *         description: Не авторизовано / недостатньо прав
 */
router.post(
    '/',
    protect,
    restrictTo('teacher'),
    createCourse
);

module.exports = router;
