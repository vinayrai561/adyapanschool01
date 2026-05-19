/**
 * Course Routes — /api/courses
 * Public: list, search, get by slug
 * Protected: create, update, delete (ADMIN only)
 */

const express  = require('express');
const Course   = require('../models/Course');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/courses — list with search, filter, pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      page     = 1,
      limit    = 20,
      category = '',
      search   = '',
      sort     = '-createdAt',
    } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags:        { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Course.countDocuments(filter),
    ]);

    res.json({
      success: true,
      courses,
      pagination: {
        page:       Number(page),
        limit:      Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) { next(err); }
});

// GET /api/courses/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ success: true, course });
  } catch (err) { next(err); }
});

// POST /api/courses — admin only
router.post('/', authenticate, authorize('ADMIN', 'SUPERADMIN'), async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, course });
  } catch (err) { next(err); }
});

// PATCH /api/courses/:id — admin only
router.patch('/:id', authenticate, authorize('ADMIN', 'SUPERADMIN'), async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ success: true, course });
  } catch (err) { next(err); }
});

// DELETE /api/courses/:id — soft delete, admin only
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPERADMIN'), async (req, res, next) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Course deactivated' });
  } catch (err) { next(err); }
});

module.exports = router;
