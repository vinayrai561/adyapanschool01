/**
 * OfflineInternshipLead Model — Adyapan Backend
 *
 * Captures leads from students interested in offline internship programs.
 * Used for follow-up, batch assignment, and conversion tracking.
 */

const mongoose = require('mongoose');

const offlineInternshipLeadSchema = new mongoose.Schema(
  {
    // ── Student Info ──────────────────────────────────────────
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },

    // ── Optional User Link ────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    // ── Academic Info ─────────────────────────────────────────
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
    city: {
      type: String,
      default: '',
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },

    // ── Internship Preferences ────────────────────────────────
    preferredDomain: {
      type: String,
      default: '',
      // e.g., 'Web Development', 'Data Science', 'AI/ML'
    },
    preferredDuration: {
      type: String,
      default: '',
      // e.g., '1 Month', '3 Months', '6 Months'
    },
    availableFrom: {
      type: Date,
      default: null,
    },

    // ── Lead Source ───────────────────────────────────────────
    source: {
      type: String,
      enum: ['website', 'referral', 'social_media', 'college_event', 'walk_in', 'other'],
      default: 'website',
    },
    referralCode: {
      type: String,
      default: '',
    },
    utmSource: {
      type: String,
      default: '',
    },
    utmMedium: {
      type: String,
      default: '',
    },
    utmCampaign: {
      type: String,
      default: '',
    },

    // ── Lead Status ───────────────────────────────────────────
    status: {
      type: String,
      enum: [
        'new',
        'contacted',
        'interested',
        'not_interested',
        'enrolled',
        'dropped',
        'duplicate',
      ],
      default: 'new',
      index: true,
    },

    // ── Follow-up ─────────────────────────────────────────────
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    followUpNotes: {
      type: String,
      default: '',
    },
    contactedAt: {
      type: Date,
      default: null,
    },

    // ── Conversion ────────────────────────────────────────────
    convertedToEnrollment: {
      type: Boolean,
      default: false,
    },
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      default: null,
    },
    convertedAt: {
      type: Date,
      default: null,
    },

    // ── Additional Info ───────────────────────────────────────
    message: {
      type: String,
      default: '',
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    resumeUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes (simple field indexes are declared inline above)
offlineInternshipLeadSchema.index({ status: 1, createdAt: -1 });
offlineInternshipLeadSchema.index({ assignedTo: 1, status: 1 });
offlineInternshipLeadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('OfflineInternshipLead', offlineInternshipLeadSchema);
