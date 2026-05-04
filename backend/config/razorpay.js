/**
 * Razorpay Configuration
 * 
 * This module initializes and exports a Razorpay instance.
 * It validates that real keys are configured before creating the instance.
 * 
 * SECURITY NOTES:
 * - Keys are loaded from environment variables only
 * - No hardcoded keys anywhere in the codebase
 * - Test mode is detected automatically if placeholder keys are used
 * - All payment verification happens server-side
 */

const Razorpay = require('razorpay');

/**
 * Check if real Razorpay keys are configured
 * Returns false if keys are missing or contain placeholder values
 */
function hasRealKeys() {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

  const isKeyIdValid =
    keyId &&
    keyId.startsWith('rzp_') &&
    !keyId.includes('your_') &&
    !keyId.includes('placeholder');

  const isKeySecretValid =
    keySecret &&
    !keySecret.includes('your_') &&
    !keySecret.includes('placeholder');

  return isKeyIdValid && isKeySecretValid;
}

/**
 * Initialize and return Razorpay instance
 * Throws error if keys are not properly configured
 */
function initializeRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      'Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env'
    );
  }

  if (!keyId.startsWith('rzp_')) {
    throw new Error(
      'Invalid RAZORPAY_KEY_ID format. Must start with "rzp_test_" or "rzp_live_"'
    );
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Get Razorpay instance (lazy initialization)
 * Returns null in test mode, throws error if keys are invalid
 */
function getRazorpay() {
  if (!hasRealKeys()) {
    console.warn(
      '[Razorpay] Test mode detected (placeholder keys). ' +
      'Set real RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET for production.'
    );
    return null;
  }

  try {
    return initializeRazorpay();
  } catch (error) {
    console.error('[Razorpay] Initialization failed:', error.message);
    throw error;
  }
}

/**
 * Verify payment signature using HMAC SHA256
 * This is the most critical security function - always verify server-side
 * 
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Signature from Razorpay webhook/response
 * @returns {boolean} - True if signature is valid
 */
function verifyPaymentSignature(orderId, paymentId, signature) {
  const crypto = require('crypto');
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET not configured');
  }

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}

module.exports = {
  hasRealKeys,
  getRazorpay,
  initializeRazorpay,
  verifyPaymentSignature,
};
