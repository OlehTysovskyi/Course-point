const router = require('express').Router();
const { issueBadge } = require('../controllers/badgeController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Badges
 *   description: Видання бейджів
 */

/**
 * @swagger
 * /badges/{courseId}:
 *   post:
 *     summary: Видати бейдж за завершений курс
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID курсу
 *     responses:
 *       201:
 *         description: Бейдж видано
 */
router.post('/:courseId', protect, issueBadge);

module.exports = router;
