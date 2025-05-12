const router = require('express').Router();
const {
    createModule,
    getAllModules,
    getModuleById
} = require('../controllers/moduleController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Керування модулями
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       required: [ _id, title, graded, createdAt ]
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         lessons:
 *           type: array
 *           items:
 *             type: string
 *         graded:
 *           type: boolean
 *           description: чи впливає на оцінку (true = оцінюваний)
 *         questions:
 *           type: array
 *           items:
 *             type: object
 *         createdAt:
 *           type: string
 *           format: date-time
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
 *         schema:
 *           type: string
 *         required: true
 *         description: ID модуля
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
 *             required:
 *               - title
 *               - graded
 *             properties:
 *               title:
 *                 type: string
 *               lessons:
 *                 type: array
 *                 items:
 *                   type: string
 *               graded:
 *                 type: boolean
 *                 example: false
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Модуль створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       401:
 *         description: Не авторизовано / недостатньо прав
 */
router.post('/', protect, restrictTo('teacher'), createModule);

module.exports = router;
