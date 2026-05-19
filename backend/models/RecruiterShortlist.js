/**
 * RecruiterShortlist Model — Adyapan Backend
 *
 * Tracks students shortlisted by recruiters for specific jobs.
 *
 * Relationships:
 *   recruiterId → User (role: 'recruiter')
 *   studentId   → User (role: 'student')
 *   jobId       → RecruiterJob
 */

const mongoose = require('mongoose');

const recruiterShortlistSchema = new mongoose.Schema(
  {
    // ── Relationships ─────────────────────────────────────────
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter ID is required'],
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecruiterJob',
      default: null,
      index: true,
    },

    // ── Denormalised Fields ───────────────────────────────────
    recruiterEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    studentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    // ── Shortlist Status ──────────────────────────────────────
    status: {
      type: String,
      enum: [
        'shortlisted',
        'contacted',
        'interview_scheduled',
        'interview_done',
        'offer_sent',
        'hired',
        'rejected',
        'withdrawn',
      ],
      default: 'shortlisted',
      index: true,
    },

    // ── Notes ─────────────────────────────────────────────────
    recruiterNotes: {
      type: String,
      default: '',
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },

    // ── Interview Details ─────────────────────────────────────
    interviewDate: {
      type: Date,
      default: null,
    },
    interviewMode: {
      type: String,
      enum: ['online', 'offline', 'phone'],
      default: 'online',
    },
    interviewLink: {
      type: String,
      default: '',
    },

    // ── Offer Details ─────────────────────────────────────────
    offerSalary: {
      type: Number,
      default: 0,
    },
    offerDate: {
      type: Date,
      default: null,
    },

    // ── Notification ─────────────────────────────────────────
    studentNotified: {
      type: Boolean,
      default: false,
    },
    notifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes (simple field indexes are declared inline above)
recruiterShortlistSchema.index({ recruiterId: 1, studentId: 1, jobId: 1 }, { unique: true });
recruiterShortlistSchema.index({ recruiterId: 1, status: 1 });
recruiterShortlistSchema.index({ studentId: 1, status: 1 });
recruiterShortlistSchema.index({ createdAt: -1 });

module.exports = mongoose.model('RecruiterShortlist', recruiterShortlistSchema);
