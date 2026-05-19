/**
 * Enrollment Routes — /api/enrollments
 * Protected: student sees own enrollments, admin sees all
 */

const express    = require('express');
const Enrollment = require('../models/Enrollment');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/enrollments/my — student's own enrollments
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.userId })
      .sort('-createdAt')
      .lean();
    res.json({ success: true, enrollments });
  } catch (err) { next(err); }
});

// GET /api/enrollments — admin: all enrollments with pagination
router.get('/', authenticate, authorize('ADMIN', 'SUPERADMIN'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const filter = status ? { status } : {};
    const skip   = (Number(page) - 1) * Number(limit);

    const [enrollments, total] = await Promise.all([
      Enrollment.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
      Enrollment.countDocuments(filter),
    ]);

    res.json({
      success: true,
      enrollments,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) { next(err); }
});

// GET /api/enrollments/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).lean();
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

    // Students can only see their own
    if (req.user.role === 'STUDENT' && enrollment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json({ success: true, enrollment });
  } catch (err) { next(err); }
});

module.exports = router;
