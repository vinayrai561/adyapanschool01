/**
 * Admin Routes — /api/admin
 * All routes require ADMIN or SUPERADMIN role
 */

const express    = require('express');
const mongoose   = require('mongoose');
const User       = require('../models/User');
const Payment    = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const Course     = require('../models/Course');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const adminOnly = [authenticate, authorize('ADMIN', 'SUPERADMIN')];

// GET /api/admin/overview — dashboard analytics
router.get('/overview', ...adminOnly, async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      totalStudents,
      totalEnrollments,
      successPayments,
      totalCourses,
      recentPayments,
      planBreakdown,
      recentActivity,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Enrollment.countDocuments({ status: 'active' }),
      Payment.find({ status: 'success' }).lean(),
      Course.countDocuments({ isActive: true }),
      Payment.find({ status: 'success', paidAt: { $gte: sixMonthsAgo } }).lean(),
      Payment.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: '$planLabel', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
        { $sort: { revenue: -1 } },
      ]),
      Payment.find({ status: 'success' }).sort({ paidAt: -1 }).limit(10).lean(),
    ]);

    const totalRevenue = successPayments.reduce((s, p) => s + (p.totalAmount || 0), 0);

    // Revenue by month
    const revenueByMonth = {};
    recentPayments.forEach(p => {
      const key = new Date(p.paidAt).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      revenueByMonth[key] = (revenueByMonth[key] || 0) + p.totalAmount;
    });

    res.json({
      success: true,
      overview: { totalStudents, totalEnrollments, totalRevenue, totalPayments: successPayments.length, totalCourses },
      revenueChart: Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue })),
      planBreakdown,
      recentActivity: recentActivity.map(p => ({
        paymentId: p.paymentId, studentName: p.userName,
        courseName: p.courseName, amount: p.totalAmount, paidAt: p.paidAt,
      })),
    });
  } catch (err) { next(err); }
});

// GET /api/admin/users — paginated user list
router.get('/users', ...adminOnly, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role = '', search = '' } = req.query;
    const filter = {};
    if (role)   filter.role = role;
    if (search) filter.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      users,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) { next(err); }
});

// PATCH /api/admin/users/:id/role — change user role
router.patch('/users/:id/role', ...adminOnly, async (req, res, next) => {
  try {
    const { role } = req.body;
    const allowed  = ['student', 'recruiter', 'admin'];
    if (!allowed.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user: user.toPublicProfile() });
  } catch (err) { next(err); }
});

// PATCH /api/admin/users/:id/status — activate/deactivate
router.patch('/users/:id/status', ...adminOnly, async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user: user.toPublicProfile() });
  } catch (err) { next(err); }
});

// GET /api/admin/payments — paginated payment list
router.get('/payments', ...adminOnly, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const filter = status ? { status } : {};
    const skip   = (Number(page) - 1) * Number(limit);

    const [payments, total] = await Promise.all([
      Payment.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
      Payment.countDocuments(filter),
    ]);

    res.json({
      success: true,
      payments,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) { next(err); }
});

module.exports = router;
