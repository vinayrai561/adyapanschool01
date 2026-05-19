/**
 * WorkSubmission Model
 * 
 * Stores completed work submissions from students/team
 * Links to ProjectRequest and includes deliverables
 */

const mongoose = require('mongoose');

const workSubmissionSchema = new mongoose.Schema(
  {
    // Reference to Project Request
    projectRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectRequest',
      required: true,
    },

    // Submitted By
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Deliverables
    githubLink: {
      type: String,
      default: '',
    },
    liveLink: {
      type: String,
      default: '',
    },
    reportPdf: {
      type: String,
      default: '',
    },
    screenshots: {
      type: [String],
      default: [],
    },

    // Additional Information
    notes: {
      type: String,
      default: '',
    },

    // Status
    status: {
      type: String,
      enum: ['submitted', 'approved', 'changes_requested', 'rejected'],
      default: 'submitted',
    },

    // Feedback
    feedback: {
      type: String,
      default: '',
    },
    feedbackBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    feedbackAt: {
      type: Date,
      default: null,
    },

    // Submission Date
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
workSubmissionSchema.index({ projectRequestId: 1 });
workSubmissionSchema.index({ submittedBy: 1 });
workSubmissionSchema.index({ status: 1 });

module.exports = mongoose.model('WorkSubmission', workSubmissionSchema);
