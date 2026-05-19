const mongoose = require('mongoose');

/**
 * Payment Schema - Production-Ready
 * 
 * Stores all payment transaction details with proper security:
 * - Unique payment ID prevents duplicate processing
 * - Signature verification status tracked
 * - Comprehensive audit trail with timestamps
 * - User enrollment tracking
 */
const paymentSchema = new mongoose.Schema(
  {
    // User Information
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    userPhone: {
      type: String,
      trim: true,
      default: '',
    },

    // Payment Details
    paymentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      // Razorpay format: pay_XXXXX or pay_TEST_XXXXX
    },
    orderId: {
      type: String,
      required: true,
      trim: true,
      index: true,
      // Razorpay format: order_XXXXX or order_TEST_XXXXX
    },

    // Course Information
    courseSlug: {
      type: String,
      required: true,
      trim: true,
      // e.g., 'plan-1', 'plan-4-premium'
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
      // e.g., 'Adyapan Career Pro'
    },
    planLabel: {
      type: String,
      trim: true,
      default: '',
      // e.g., 'Career Pro Plan'
    },

    // Amount Details (in INR)
    baseAmount: {
      type: Number,
      required: true,
      min: 0,
      // Amount before GST
    },
    gstAmount: {
      type: Number,
      required: true,
      min: 0,
      // 18% GST
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
      // baseAmount + gstAmount
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR'],
    },

    // Payment Status
    status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'wallet', 'emi'],
      default: 'upi',
    },

    // Signature Verification
    signatureVerified: {
      type: Boolean,
      default: false,
    },

    // Test Mode Flag
    isTestMode: {
      type: Boolean,
      default: false,
      // true if using test Razorpay keys
    },

    // Notification Status
    emailSent: {
      type: Boolean,
      default: false,
    },
    smsSent: {
      type: Boolean,
      default: false,
    },

    // Enrollment Status
    enrollmentCreated: {
      type: Boolean,
      default: false,
    },

    // Payment Timestamp
    paidAt: {
      type: Date,
      default: null,
    },

    // Metadata
    notes: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    // createdAt and updatedAt are automatically added
  }
);

// Compound indexes (simple field indexes are declared inline above)
paymentSchema.index({ userEmail: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
