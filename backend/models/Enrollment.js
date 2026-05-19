/**
 * Enrollment Model — Adyapan Backend
 *
 * Tracks student enrollments in courses.
 * Created after successful payment verification.
 *
 * Relationships:
 *   userId   → User
 *   courseId → Course
 *   paymentId → Payment
 */

const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    // ── Relationships ─────────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
      index: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
      index: true,
    },

    // ── Denormalised fields (for quick lookup without populate) ─
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    courseSlug: {
      type: String,
      required: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    // ── Enrollment Status ─────────────────────────────────────
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled', 'suspended'],
      default: 'active',
      index: true,
    },

    // ── Progress ──────────────────────────────────────────────
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedModules: {
      type: [String],
      default: [],
    },
    lastAccessedAt: {
      type: Date,
      default: null,
    },

    // ── Batch / Schedule ──────────────────────────────────────
    batchId: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },

    // ── Certificate ───────────────────────────────────────────
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate',
      default: null,
    },

    // ── Notifications ─────────────────────────────────────────
    welcomeEmailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes (simple field indexes are declared inline above)
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true }); // One enrollment per user per course
enrollmentSchema.index({ userId: 1, status: 1 });
enrollmentSchema.index({ courseId: 1, status: 1 });
enrollmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
