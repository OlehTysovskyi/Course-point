const router = require('express').Router();
const {
    createLesson,
    getAllLessons,
    getLessonById,
    updateLesson,
    deleteLesson
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
 *               - courseId
 *             properties:
 *               title:
 *                 type: string
 *               blocks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ContentBlock'
 *               courseId:
 *                 type: string
 *                 description: Ідентифікатор курсу, до якого належить урок
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


/**
 * @swagger
 * /lessons/{id}:
 *   put:
 *     summary: Оновити урок
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               blocks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ContentBlock'
 *     responses:
 *       200:
 *         description: Урок оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Невірні дані
 *       404:
 *         description: Урок не знайдено
 */
router.put('/:id', protect, restrictTo('teacher'), updateLesson);

/**
 * @swagger
 * /lessons/{id}:
 *   delete:
 *     summary: Видалити урок
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Урок видалено
 *       404:
 *         description: Урок не знайдено
 */
router.delete('/:id', protect, restrictTo('teacher'), deleteLesson);

module.exports = router;
