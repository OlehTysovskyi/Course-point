const router = require('express').Router();
const { updateProgress } = require('../controllers/progressController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Прогрес користувача
 */

/**
 * @swagger
 * /progress:
 *   patch:
 *     summary: Оновити прогрес (урок/модуль)
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *               lessonId:
 *                 type: string
 *               moduleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Прогрес оновлено
 */
router.patch('/', protect, updateProgress);

module.exports = router;
