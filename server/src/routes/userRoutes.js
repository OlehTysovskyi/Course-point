const router = require('express').Router();
const { getAllUsers, getUserById } = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управління користувачами (адмін)
 */

router.use(protect, restrictTo('admin'));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Отримати всіх користувачів
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список користувачів
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Отримати користувача за ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID користувача
 *     responses:
 *       200:
 *         description: Інформація про користувача
 */
router.get('/:id', getUserById);

module.exports = router;
