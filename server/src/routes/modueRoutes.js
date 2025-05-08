const router = require('express').Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const {
    createModule,
    getAllModules,
    getModuleById
} = require('../controllers/moduleController');

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Керування модулями
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
 *         description: ID модуля
 *     responses:
 *       200:
 *         description: Данні модуля
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
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               lessons:
 *                 type: array
 *                 items: { type: string }
 *               questions:
 *                 type: array
 *                 items: { type: object }
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

module.exports = router;
