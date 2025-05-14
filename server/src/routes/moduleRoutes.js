const router = require('express').Router();
const {
    createModule,
    getAllModules,
    getModuleById,
    getModulesByCourseId,
    updateModule,
    deleteModule
} = require('../controllers/moduleController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Управління модулями
 */

/**
 * @swagger
 * /modules:
 *   get:
 *     summary: Отримати всі модулі
 *     tags: [Modules]
 *     responses:
 *       200:
 *         description: Список модулів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Module'
 */
router.get('/', getAllModules);

/**
 * @swagger
 * /modules/{id}:
 *   get:
 *     summary: Отримати модуль за ID
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: Дані модуля
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       404:
 *         description: Модуль не знайдено
 */
router.get('/:id', getModuleById);

/**
 * @swagger
 * /modules/course/{courseId}:
 *   get:
 *     summary: Отримати всі модулі певного курсу
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId курсу
 *     responses:
 *       200:
 *         description: Масив модулів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Module'
 */
router.get('/course/:courseId', getModulesByCourseId);

/**
 * @swagger
 * /modules:
 *   post:
 *     summary: Створити новий модуль
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModuleInput'
 *     responses:
 *       201:
 *         description: Модуль створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       401:
 *         description: Не авторизовано
 */
router.post('/', protect, restrictTo('teacher'), createModule);

/**
 * @swagger
 * /modules/{id}:
 *   put:
 *     summary: Оновити модуль
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModuleInput'
 *     responses:
 *       200:
 *         description: Модуль оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       400:
 *         description: Некоректні дані
 *       404:
 *         description: Модуль не знайдено
 */
router.put('/:id', protect, restrictTo('teacher'), updateModule);

/**
 * @swagger
 * /modules/{id}:
 *   delete:
 *     summary: Видалити модуль
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       204:
 *         description: Модуль видалено
 *       404:
 *         description: Модуль не знайдено
 */
router.delete('/:id', protect, restrictTo('teacher'), deleteModule);

module.exports = router;
