const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Create user
router.post("/", async (req, res) => {
  try {
    const { name, phone, course } = req.body;

    if (!name || !phone || !course) {
      return res
        .status(400)
        .json({ message: "name, phone, and course are required" });
    }

    const user = await User.create({ name, phone, course });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create user" });
  }
});

// Fetch all users
router.get("/", async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;
