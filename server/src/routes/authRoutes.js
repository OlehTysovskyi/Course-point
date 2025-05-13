const router = require('express').Router();
const {
    requestSignup,
    getAllRequests,
    getRequestById,
    approveSignup,
    login
} = require('../controllers/authController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.post('/request', requestSignup);

/**
 * @swagger
 * /auth/request:
 *   get:
 *     summary: Отримати всі заявки на реєстрацію
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список заявок
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RegistrationRequest'
 */
router.get('/request', protect, restrictTo('admin'), getAllRequests);

/**
 * @swagger
 * /auth/request/{id}:
 *   get:
 *     summary: Отримати заявку за ID
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID заявки
 *     responses:
 *       200:
 *         description: Дані заявки
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationRequest'
 *       404:
 *         description: Заявка не знайдена
 */
router.get('/request/:id', protect, restrictTo('admin'), getRequestById);

// Погодження
router.patch('/request/:id/approve', protect, restrictTo('admin'), approveSignup);

router.post('/login', login);

module.exports = router;
