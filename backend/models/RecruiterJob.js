/**
 * RecruiterJob Model — Adyapan Backend
 *
 * Stores job postings created by recruiters.
 * Students can apply to these jobs through the platform.
 *
 * Relationships:
 *   recruiterId → User (role: 'recruiter')
 */

const mongoose = require('mongoose');

const recruiterJobSchema = new mongoose.Schema(
  {
    // ── Relationship ──────────────────────────────────────────
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter ID is required'],
      index: true,
    },

    // ── Company Info ──────────────────────────────────────────
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    companyWebsite: {
      type: String,
      default: '',
    },

    // ── Job Details ───────────────────────────────────────────
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },

    // ── Job Type ──────────────────────────────────────────────
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'],
      default: 'full-time',
      index: true,
    },
    workMode: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      default: 'onsite',
    },

    // ── Location ──────────────────────────────────────────────
    location: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'India',
    },

    // ── Compensation ──────────────────────────────────────────
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    salaryCurrency: {
      type: String,
      default: 'INR',
    },
    salaryPeriod: {
      type: String,
      enum: ['monthly', 'yearly', 'hourly', 'fixed'],
      default: 'monthly',
    },
    stipend: {
      type: Number,
      default: 0, // For internships
    },

    // ── Experience ────────────────────────────────────────────
    experienceMin: {
      type: Number,
      default: 0, // Years
    },
    experienceMax: {
      type: Number,
      default: 0,
    },
    educationRequired: {
      type: String,
      default: '',
    },

    // ── Status ────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'closed', 'expired'],
      default: 'active',
      index: true,
    },
    applicationDeadline: {
      type: Date,
      default: null,
    },
    openings: {
      type: Number,
      default: 1,
      min: 1,
    },

    // ── Stats ─────────────────────────────────────────────────
    totalApplications: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },

    // ── Metadata ──────────────────────────────────────────────
    tags: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes (simple field indexes are declared inline above)
recruiterJobSchema.index({ recruiterId: 1, status: 1 });
recruiterJobSchema.index({ status: 1, createdAt: -1 });
recruiterJobSchema.index({ jobType: 1, status: 1 });
recruiterJobSchema.index({ city: 1, status: 1 });

module.exports = mongoose.model('RecruiterJob', recruiterJobSchema);
