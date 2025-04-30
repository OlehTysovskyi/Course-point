const router = require('express').Router();
const {
    requestSignup,
    approveSignup,
    login
} = require('../controllers/authController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Авторизація і реєстрація
 */

/**
 * @swagger
 * /auth/request:
 *   post:
 *     summary: Надіслати запит на реєстрацію (включно з паролем)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, role, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [student, teacher]
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Заявка створена
 */
router.post('/request', requestSignup);

/**
 * @swagger
 * /auth/request/{id}/approve:
 *   patch:
 *     summary: Адмін затверджує заявку та створює акаунт
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
 *         description: Акаунт створено, заявка затверджена
 *       404:
 *         description: Заявка не знайдена
 */
router.patch(
    '/request/:id/approve',
    protect,
    restrictTo('admin'),
    approveSignup
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Авторизація користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Повертає JWT-токен
 */
router.post('/login', login);

module.exports = router;
