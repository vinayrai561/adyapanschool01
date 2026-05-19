/**
 * Course Model — Adyapan Backend
 *
 * Stores all available courses/plans offered by Adyapan Skills.
 * Referenced by Enrollment, Payment, and Certificate models.
 */

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────
    slug: {
      type: String,
      required: [true, 'Course slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: '',
      // Alias for name — used by frontend search
    },
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    label: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },

    // ── Pricing ───────────────────────────────────────────────
    price: {
      type: Number,
      required: [true, 'Course price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR'],
    },
    gstRate: {
      type: Number,
      default: 18, // 18% GST
      min: 0,
      max: 100,
    },

    // ── Duration ──────────────────────────────────────────────
    duration: {
      type: String,
      default: '',
      // e.g., '3 Months', '4 Months'
    },
    durationWeeks: {
      type: Number,
      default: 0,
    },

    // ── Content ───────────────────────────────────────────────
    modules: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    prerequisites: {
      type: [String],
      default: [],
    },

    // ── Media ─────────────────────────────────────────────────
    thumbnailUrl: {
      type: String,
      default: '',
    },
    brochureUrl: {
      type: String,
      default: '',
    },

    // ── Status ────────────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },

    // ── Metadata ──────────────────────────────────────────────
    category: {
      type: String,
      default: 'Technology',
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    language: {
      type: String,
      default: 'English',
    },
    totalEnrollments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes (simple field indexes are declared inline above)
courseSchema.index({ isActive: 1, sortOrder: 1 });
courseSchema.index({ isFeatured: 1 });
courseSchema.index({ title: 'text', name: 'text', description: 'text', tags: 'text' });

// Sync title ↔ name on save
courseSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.title) this.title = this.name;
  if (this.isModified('title') && !this.name) this.name = this.title;
  next();
});

module.exports = mongoose.model('Course', courseSchema);
