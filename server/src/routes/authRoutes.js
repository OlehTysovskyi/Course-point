// server/src/routes/authRoutes.js
const router = require('express').Router();
const {
    requestSignup,
    getAllRequests,
    getRequestById,
    approveSignup,
    login
} = require('../controllers/authController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Аутентифікація та заявки на реєстрацію
 */

/**
 * @swagger
 * /auth/request:
 *   post:
 *     summary: Подати заявку на реєстрацію
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - role
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Іван Іваненко"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ivan@example.com"
 *               role:
 *                 type: string
 *                 enum: [student, teacher]
 *                 example: "teacher"
 *               password:
 *                 type: string
 *                 example: "securePass123"
 *     responses:
 *       201:
 *         description: Заявку прийнято, статус = pending
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationRequest'
 *       400:
 *         description: Помилка валідації або дубль
 */
router.post('/request', requestSignup);

/**
 * @swagger
 * /auth/request:
 *   get:
 *     summary: Отримати всі заявки (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список всіх заявок
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RegistrationRequest'
 *       401:
 *         description: Не авторизовано / не admin
 */
router.get('/request', protect, restrictTo('admin'), getAllRequests);

/**
 * @swagger
 * /auth/request/{id}:
 *   get:
 *     summary: Отримати заявку за ID (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId заявки
 *     responses:
 *       200:
 *         description: Деталі заявки
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationRequest'
 *       404:
 *         description: Заявка не знайдена
 *       401:
 *         description: Не авторизовано / не admin
 */
router.get('/request/:id', protect, restrictTo('admin'), getRequestById);

/**
 * @swagger
 * /auth/request/{id}/approve:
 *   patch:
 *     summary: Погодити заявку (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId заявки
 *     responses:
 *       200:
 *         description: Користувач зареєстрований, повертається User
 *       404:
 *         description: Заявка не знайдена
 *       400:
 *         description: Заявка вже оброблена
 *       401:
 *         description: Не авторизовано / не admin
 */
router.patch('/request/:id/approve', protect, restrictTo('admin'), approveSignup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Логін користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ivan@example.com"
 *               password:
 *                 type: string
 *                 example: "securePass123"
 *     responses:
 *       200:
 *         description: Успішний логін, повертає JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Невірні облікові дані
 */
router.post('/login', login);

module.exports = router;
