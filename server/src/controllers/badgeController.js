const BadgeService = require('../services/badgeService');

exports.issueBadge = async (req, res, next) => {
    const badge = await BadgeService.create(req.user.id, req.params.courseId);
    res.status(201).json(badge);
};