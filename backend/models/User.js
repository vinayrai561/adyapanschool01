/**
 * User Model — Adyapan Backend
 *
 * Central user schema for students, recruiters, and admins.
 * Used as the ref target for all other models (payments, enrollments, etc.)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },

    // ── Authentication ────────────────────────────────────────
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never returned in queries by default
    },
    googleId: {
      type: String,
      default: null,
      sparse: true,
      index: true,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local',
    },

    // ── Role & Access ─────────────────────────────────────────
    role: {
      type: String,
      enum: ['student', 'recruiter', 'admin', 'superadmin'],
      default: 'student',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // ── Profile ───────────────────────────────────────────────
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    location: {
      type: String,
      default: '',
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },

    // ── Course Enrollment (legacy field for simple tracking) ──
    course: {
      type: String,
      default: '',
    },

    // ── Password Reset ────────────────────────────────────────
    resetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
      select: false,
    },

    // ── Email Verification ────────────────────────────────────
    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },

    // ── Timestamps ────────────────────────────────────────────
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Compound indexes (simple field indexes are declared inline above)
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });

// ── Pre-save: Hash password before saving ─────────────────────
userSchema.pre('save', async function (next) {
  // Only hash if password was modified
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ── Instance Method: Compare password ────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Instance Method: Safe public profile (no sensitive fields) ─
userSchema.methods.toPublicProfile = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    avatar: this.avatar,
    bio: this.bio,
    location: this.location,
    linkedinUrl: this.linkedinUrl,
    githubUrl: this.githubUrl,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
