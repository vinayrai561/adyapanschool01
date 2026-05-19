/**
 * CounsellorRequest Model — Adyapan Backend
 *
 * Stores counselling session requests from students.
 * Used for career guidance, course selection, and placement support.
 *
 * Relationships:
 *   userId      → User (optional — may be a guest)
 *   assignedTo  → User (role: 'admin' or counsellor)
 */

const mongoose = require('mongoose');

const counsellorRequestSchema = new mongoose.Schema(
  {
    // ── Optional User Link ────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    // ── Student / Requester Info ──────────────────────────────
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },

    // ── Academic / Career Info ────────────────────────────────
    currentStatus: {
      type: String,
      enum: [
        'student',
        'fresher',
        'working_professional',
        'career_break',
        'other',
      ],
      default: 'student',
    },
    college: {
      type: String,
      default: '',
      trim: true,
    },
    degree: {
      type: String,
      default: '',
      trim: true,
    },
    graduationYear: {
      type: Number,
      default: null,
    },
    workExperienceYears: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ── Counselling Topic ─────────────────────────────────────
    topic: {
      type: String,
      enum: [
        'course_selection',
        'career_guidance',
        'placement_support',
        'resume_review',
        'interview_prep',
        'skill_gap_analysis',
        'general',
      ],
      default: 'general',
      index: true,
    },
    message: {
      type: String,
      default: '',
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },

    // ── Preferred Schedule ────────────────────────────────────
    preferredDate: {
      type: Date,
      default: null,
    },
    preferredTimeSlot: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'any'],
      default: 'any',
    },
    sessionMode: {
      type: String,
      enum: ['online', 'phone', 'in_person'],
      default: 'online',
    },

    // ── Request Status ────────────────────────────────────────
    status: {
      type: String,
      enum: [
        'new',
        'contacted',
        'scheduled',
        'completed',
        'cancelled',
        'no_show',
      ],
      default: 'new',
      index: true,
    },

    // ── Assignment ────────────────────────────────────────────
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedAt: {
      type: Date,
      default: null,
    },

    // ── Session Details ───────────────────────────────────────
    scheduledAt: {
      type: Date,
      default: null,
    },
    sessionLink: {
      type: String,
      default: '',
      // Google Meet / Zoom link
    },
    sessionNotes: {
      type: String,
      default: '',
      maxlength: [3000, 'Notes cannot exceed 3000 characters'],
    },
    completedAt: {
      type: Date,
      default: null,
    },

    // ── Follow-up ─────────────────────────────────────────────
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    followUpNotes: {
      type: String,
      default: '',
    },

    // ── Source ────────────────────────────────────────────────
    source: {
      type: String,
      enum: ['website', 'whatsapp', 'referral', 'social_media', 'other'],
      default: 'website',
    },
    utmSource: {
      type: String,
      default: '',
    },

    // ── Notifications ─────────────────────────────────────────
    confirmationEmailSent: {
      type: Boolean,
      default: false,
    },
    reminderEmailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Compound indexes (simple field indexes are declared inline above)
counsellorRequestSchema.index({ status: 1, createdAt: -1 });
counsellorRequestSchema.index({ assignedTo: 1, status: 1 });
counsellorRequestSchema.index({ topic: 1, status: 1 });
counsellorRequestSchema.index({ scheduledAt: 1 });
counsellorRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('CounsellorRequest', counsellorRequestSchema);
