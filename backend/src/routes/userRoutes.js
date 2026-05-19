/**
 * User Routes — Adyapan Backend
 *
 * Basic user CRUD endpoints.
 * Uses the consolidated User model from backend/models/User.js
 */

const express = require('express');
const User    = require('../../models/User');

const router = express.Router();

/**
 * POST /api/users
 * Create a new user (simple registration — name, phone, course)
 */
router.post('/', async (req, res) => {
  try {
    const { name, phone, course, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'name and phone are required' });
    }

    // If email provided, check for duplicates
    if (email) {
      const existing = await User.findOne({ email: email.toLowerCase().trim() }).select('_id');
      if (existing) {
        return res.status(409).json({ message: 'A user with this email already exists' });
      }
    }

    const user = await User.create({
      name: name.trim(),
      phone: phone.trim(),
      course: course || '',
      email: email ? email.toLowerCase().trim() : `${Date.now()}@placeholder.adyapan.com`,
    });

    return res.status(201).json(user.toPublicProfile ? user.toPublicProfile() : user);
  } catch (error) {
    console.error('[UserRoutes] POST /api/users error:', error.message);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A user with this email already exists' });
    }
    return res.status(500).json({ message: 'Failed to create user' });
  }
});

/**
 * GET /api/users
 * Fetch all users (admin use — returns safe public profiles)
 */
router.get('/', async (_req, res) => {
  try {
    const users = await User
      .find({ isActive: true })
      .select('name email phone course role createdAt')
      .sort({ createdAt: -1 })
      .limit(500); // Safety limit

    return res.status(200).json(users);
  } catch (error) {
    console.error('[UserRoutes] GET /api/users error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
});

/**
 * GET /api/users/:id
 * Fetch a single user by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User
      .findById(req.params.id)
      .select('name email phone course role avatar bio location linkedinUrl githubUrl isEmailVerified createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('[UserRoutes] GET /api/users/:id error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
});

module.exports = router;
