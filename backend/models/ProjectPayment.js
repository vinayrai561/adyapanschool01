/**
 * ProjectPayment Model
 *
 * Dedicated payment record for project build requests.
 * Separate from the course Payment model to keep concerns clean.
 */

const mongoose = require('mongoose');

const projectPaymentSchema = new mongoose.Schema(
  {
    projectRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectRequest',
      required: true,
      index: true,
    },

    // Payer info (denormalised for quick lookup)
    contactName:  { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    contactPhone: { type: String, default: '' },

    // Razorpay identifiers
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: '',
      trim: true,
      index: true,
      sparse: true,
    },
    razorpaySignature: {
      type: String,
      default: '',
    },

    // Amount in INR (not paise)
    amount: {
      type: Number,
      required: true,
      min: 3000,
    },
    currency: {
      type: String,
      default: 'INR',
    },

    // Status lifecycle
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
      index: true,
    },

    // Verification
    signatureVerified: {
      type: Boolean,
      default: false,
    },
    isTestMode: {
      type: Boolean,
      default: false,
    },

    // Timestamps
    paidAt: {
      type: Date,
      default: null,
    },
    failureReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Compound indexes (simple field indexes are declared inline above)
projectPaymentSchema.index({ contactEmail: 1, createdAt: -1 });

module.exports = mongoose.model('ProjectPayment', projectPaymentSchema);
