// server/src/routes/courseRoutes.js

const router = require('express').Router();
const {
    createCourse,
    getAllPublishedCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getAllCoursesAdmin
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
 * /courses/all:
 *   get:
 *     summary: Отримати всі курси (admin/teacher), без фільтрації published
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список усіх курсів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get(
    '/all',
    protect,
    restrictTo('admin', 'teacher'),
    getAllCoursesAdmin
);

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
router.get('/', getAllPublishedCourses);

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
 *         schema:
 *           type: string
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
 *     summary: Створити курс
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseInput'
 *     responses:
 *       201:
 *         description: Курс створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       401:
 *         description: Не авторизовано
 */
router.post('/', protect, restrictTo('teacher'), createCourse);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Оновити курс
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseInput'
 *     responses:
 *       200:
 *         description: Курс оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Некоректні дані
 *       404:
 *         description: Курс не знайдено
 */
router.put('/:id', protect, restrictTo('teacher'), updateCourse);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Видалити курс
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Курс видалено
 *       404:
 *         description: Курс не знайдено
 */
router.delete('/:id', protect, restrictTo('teacher'), deleteCourse);

module.exports = router;
