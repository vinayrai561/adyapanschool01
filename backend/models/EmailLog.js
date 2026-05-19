/**
 * EmailLog Model — Adyapan Backend
 *
 * Audit log for all outgoing emails sent by the platform.
 * Tracks delivery status, errors, and retry attempts.
 *
 * Relationships:
 *   userId → User (optional — may be null for non-registered recipients)
 */

const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema(
  {
    // ── Optional User Link ────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    // ── Email Details ─────────────────────────────────────────
    to: {
      type: String,
      required: [true, 'Recipient email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    from: {
      type: String,
      default: 'support@adyapan.com',
    },
    subject: {
      type: String,
      required: [true, 'Email subject is required'],
      trim: true,
    },
    templateName: {
      type: String,
      default: '',
      // e.g., 'payment_confirmation', 'project_submission', 'welcome'
      index: true,
    },

    // ── Email Type ────────────────────────────────────────────
    type: {
      type: String,
      enum: [
        'payment_confirmation',
        'enrollment_welcome',
        'certificate_issued',
        'project_submission',
        'project_status_update',
        'password_reset',
        'email_verification',
        'admin_notification',
        'recruiter_notification',
        'internship_lead',
        'general',
      ],
      default: 'general',
      index: true,
    },

    // ── Delivery Status ───────────────────────────────────────
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed', 'bounced', 'spam'],
      default: 'pending',
      index: true,
    },
    provider: {
      type: String,
      enum: ['sendgrid', 'nodemailer', 'ses', 'other'],
      default: 'sendgrid',
    },
    providerMessageId: {
      type: String,
      default: '',
      // Message ID returned by the email provider
    },
    statusCode: {
      type: Number,
      default: null,
    },

    // ── Error Tracking ────────────────────────────────────────
    errorMessage: {
      type: String,
      default: '',
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    lastRetryAt: {
      type: Date,
      default: null,
    },

    // ── Timestamps ────────────────────────────────────────────
    sentAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },

    // ── Reference (what triggered this email) ─────────────────
    referenceId: {
      type: String,
      default: '',
      // e.g., paymentId, projectRequestId, enrollmentId
    },
    referenceModel: {
      type: String,
      default: '',
      // e.g., 'Payment', 'ProjectRequest', 'Enrollment'
    },

    // ── Metadata ──────────────────────────────────────────────
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes (simple field indexes are declared inline above)
emailLogSchema.index({ to: 1, createdAt: -1 });
emailLogSchema.index({ status: 1, createdAt: -1 });
emailLogSchema.index({ type: 1, status: 1 });
emailLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('EmailLog', emailLogSchema);
