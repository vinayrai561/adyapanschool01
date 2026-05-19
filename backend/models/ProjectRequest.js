/**
 * ProjectRequest Model
 * 
 * Stores project build requests from clients/recruiters
 * Includes payment details, project specifications, and file uploads
 */

const mongoose = require('mongoose');

const projectRequestSchema = new mongoose.Schema(
  {
    // User/Client Information
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    recruiterId: {
      type: String,
      default: null,
    },

    // Project Details
    projectTitle: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Web Development',
        'Mobile App',
        'Desktop Application',
        'AI/ML Project',
        'Data Science',
        'UI/UX Design',
        'Game Development',
        'Blockchain',
        'IoT Project',
        'Other',
      ],
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    techPreference: {
      type: String,
      default: '',
    },
    deadline: {
      type: Date,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 3000,
    },

    // Contact Information
    contactName: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },

    // File Uploads
    imageUrls: {
      type: [String],
      default: [],
    },
    pdfUrls: {
      type: [String],
      default: [],
    },
    referenceFiles: {
      type: [String],
      default: [],
    },

    // Additional Information
    additionalNotes: {
      type: String,
      default: '',
    },

    // Payment Information
    paymentId: {
      type: String,
      default: '',
      index: true,
      sparse: true,
    },
    orderId: {
      type: String,
      default: '',
      index: true,
      sparse: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    paidAmount: {
      type: Number,
      default: 0,
    },

    // Project Status
    projectStatus: {
      type: String,
      enum: [
        'draft',
        'submitted',
        'under_review',
        'assigned',
        'in_progress',
        'completed',
        'delivered',
        'cancelled',
      ],
      default: 'draft',
    },

    // Assignment
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedAt: {
      type: Date,
      default: null,
    },

    // Email Tracking
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
projectRequestSchema.index({ contactEmail: 1 });
projectRequestSchema.index({ projectStatus: 1 });
projectRequestSchema.index({ paymentStatus: 1 });
projectRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ProjectRequest', projectRequestSchema);
