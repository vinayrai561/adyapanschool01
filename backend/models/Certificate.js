/**
 * Certificate Model — Adyapan Backend
 *
 * Stores issued certificates for course completions.
 *
 * Relationships:
 *   userId       → User
 *   courseId     → Course
 *   enrollmentId → Enrollment
 */

const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
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
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: [true, 'Enrollment ID is required'],
      index: true,
    },

    // ── Certificate Details ───────────────────────────────────
    certificateNumber: {
      type: String,
      required: [true, 'Certificate number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      // e.g., 'ADYAPAN-2024-001234'
      index: true,
    },

    // ── Recipient Info (denormalised) ─────────────────────────
    recipientName: {
      type: String,
      required: [true, 'Recipient name is required'],
      trim: true,
    },
    recipientEmail: {
      type: String,
      required: [true, 'Recipient email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },

    // ── Course Info (denormalised) ────────────────────────────
    courseName: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    courseSlug: {
      type: String,
      required: true,
      trim: true,
    },

    // ── Dates ─────────────────────────────────────────────────
    issuedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null, // null = no expiry
    },

    // ── Certificate File ──────────────────────────────────────
    pdfUrl: {
      type: String,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },

    // ── Verification ──────────────────────────────────────────
    verificationUrl: {
      type: String,
      default: '',
      // e.g., 'https://adyapan.com/verify/ADYAPAN-2024-001234'
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    revokedReason: {
      type: String,
      default: '',
    },

    // ── Blockchain (optional future use) ─────────────────────
    blockchainTxHash: {
      type: String,
      default: '',
    },
    blockchainNetwork: {
      type: String,
      default: '',
    },

    // ── Email Tracking ────────────────────────────────────────
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes (simple field indexes are declared inline above)
certificateSchema.index({ userId: 1, courseId: 1 });
certificateSchema.index({ issuedAt: -1 });

module.exports = mongoose.model('Certificate', certificateSchema);
