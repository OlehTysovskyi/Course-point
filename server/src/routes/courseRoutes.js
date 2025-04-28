const router = require('express').Router();
const { createCourse, getAllCourses } = require('../controllers/courseController');
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
 *     summary: Отримати всі курси
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список курсів
 */
router.get('/', protect, getAllCourses);

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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               lessons:
 *                 type: array
 *                 items:
 *                   type: string
 *               modules:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Курс створено
 */
router.post('/', protect, restrictTo('teacher'), createCourse);

module.exports = router;
