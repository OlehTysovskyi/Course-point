const router = require('express').Router();
const { requestSignup, register, login } = require('../controllers/authController');

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
 *     summary: Надіслати запит на реєстрацію
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, teacher]
 *     responses:
 *       201:
 *         description: Запит створено
 */
router.post('/request', requestSignup);

/**
 * @swagger
 * /auth/register/{requestId}:
 *   post:
 *     summary: Реєстрація користувача по заявці
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID заявки
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Користувач створений
 */
router.post('/register/:requestId', register);

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
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успішна авторизація
 */
router.post('/login', login);

module.exports = router;
