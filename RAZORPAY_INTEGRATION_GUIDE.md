# Razorpay Integration - Production-Ready Guide

## Overview

This document describes the secure, production-ready Razorpay payment integration for Adyapan School Passport.

**Key Security Features:**
- ✅ Server-side signature verification (HMAC SHA256)
- ✅ No hardcoded secrets in code
- ✅ Environment variable-based configuration
- ✅ Idempotent payment processing (duplicate prevention)
- ✅ Comprehensive audit trail
- ✅ Test mode support for development

---

## Environment Setup

### 1. Get Razorpay Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
2. Copy your **Key ID** and **Key Secret**
3. Test keys start with `rzp_test_`
4. Live keys start with `rzp_live_`

### 2. Configure Environment Variables

**Frontend (.env):**
```env
RAZORPAY_KEY_ID="rzp_test_your_key_id_here"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret_here"
NODE_ENV="development"
```

**Backend (backend/.env):**
```env
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
NODE_ENV=development
```

### 3. Important Security Notes

⚠️ **NEVER commit real keys to version control**
- Add `.env` and `backend/.env` to `.gitignore`
- Use `.env.example` for template
- Rotate keys regularly in production
- Use different keys for test and live environments

---

## Architecture

### Payment Flow

```
Frontend (Checkout)
    ↓
1. Create Order → POST /api/payment/create-order
    ↓
2. Open Razorpay Checkout
    ↓
3. User completes payment
    ↓
4. Verify Payment → POST /api/payment/verify
    ↓
5. Backend verifies signature (HMAC SHA256)
    ↓
6. Save to database + Enroll user
    ↓
7. Send confirmation email
    ↓
8. Redirect to dashboard
```

### UPI Polling Flow

```
Frontend (UPI)
    ↓
1. Create Order → POST /api/payment/create-order
    ↓
2. Show QR Code
    ↓
3. Poll Status → GET /api/payment/check-status (every 3 seconds)
    ↓
4. Backend checks Razorpay API
    ↓
5. Payment confirmed → Save + Enroll
    ↓
6. Redirect to dashboard
```

---

## API Endpoints

### 1. Create Order

**Endpoint:** `POST /api/payment/create-order`

**Request:**
```json
{
  "plan": "plan-4-premium"
}
```

**Response (Test Mode):**
```json
{
  "success": true,
  "orderId": "order_TEST_1234567890",
  "amount": 1500000,
  "currency": "INR",
  "keyId": "rzp_test_placeholder",
  "testMode": true
}
```

**Response (Live Mode):**
```json
{
  "success": true,
  "orderId": "order_XXXXX",
  "amount": 1500000,
  "currency": "INR",
  "keyId": "rzp_test_XXXXX",
  "testMode": false
}
```

### 2. Verify Payment

**Endpoint:** `POST /api/payment/verify`

**Request:**
```json
{
  "razorpay_order_id": "order_XXXXX",
  "razorpay_payment_id": "pay_XXXXX",
  "razorpay_signature": "signature_hash",
  "customerName": "Rupesh Rupak",
  "customerEmail": "rupesh@example.com",
  "customerPhone": "9876543210",
  "planName": "Adyapan Career Pro",
  "planLabel": "Career Pro Plan",
  "grandTotal": 17700,
  "planKey": "plan-4-premium"
}
```

**Response (Success):**
```json
{
  "success": true,
  "paymentId": "pay_XXXXX",
  "orderId": "order_XXXXX",
  "testMode": false
}
```

**Response (Invalid Signature):**
```json
{
  "success": false,
  "error": "Payment verification failed - invalid signature"
}
```

### 3. Check Payment Status

**Endpoint:** `GET /api/payment/check-status`

**Query Parameters:**
```
?orderId=order_XXXXX&name=John&email=john@example.com&phone=9876543210&planName=Adyapan+Career+Pro&planLabel=Career+Pro+Plan&planKey=plan-4-premium&grandTotal=17700
```

**Response (Paid):**
```json
{
  "paid": true,
  "paymentId": "pay_XXXXX",
  "orderId": "order_XXXXX",
  "testMode": false
}
```

**Response (Not Paid):**
```json
{
  "paid": false,
  "orderId": "order_XXXXX"
}
```

---

## Database Schema

### Payment Model

```javascript
{
  // User Information
  userId: ObjectId,           // Reference to AuthUser
  userName: String,           // Customer name
  userEmail: String,          // Customer email (indexed)
  userPhone: String,          // Customer phone

  // Payment Details
  paymentId: String,          // Razorpay payment ID (unique, indexed)
  orderId: String,            // Razorpay order ID (indexed)

  // Course Information
  courseSlug: String,         // e.g., 'plan-4-premium'
  courseName: String,         // e.g., 'Adyapan Career Pro'
  planLabel: String,          // e.g., 'Career Pro Plan'

  // Amount Details (in INR)
  baseAmount: Number,         // Amount before GST
  gstAmount: Number,          // 18% GST
  totalAmount: Number,        // baseAmount + gstAmount
  currency: String,           // 'INR'

  // Payment Status
  status: String,             // 'success', 'failed', 'pending'
  paymentMethod: String,      // 'upi', 'card', 'netbanking', etc.

  // Signature Verification
  signatureVerified: Boolean,  // true if HMAC verified

  // Test Mode Flag
  isTestMode: Boolean,        // true if using test keys

  // Notification Status
  emailSent: Boolean,         // Confirmation email sent
  smsSent: Boolean,           // SMS notification sent

  // Enrollment Status
  enrollmentCreated: Boolean, // User enrolled in course

  // Payment Timestamp
  paidAt: Date,               // When payment was completed

  // Metadata
  notes: Object,              // Additional data

  // Timestamps
  createdAt: Date,            // Record created
  updatedAt: Date             // Record updated
}
```

---

## Security Implementation

### 1. Signature Verification

**Location:** `backend/config/razorpay.js`

```javascript
function verifyPaymentSignature(orderId, paymentId, signature) {
  const crypto = require('crypto');
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}
```

**Why HMAC SHA256?**
- Industry standard for payment verification
- Prevents tampering with payment data
- Only backend knows the secret key
- Frontend cannot forge signatures

### 2. Idempotent Payment Processing

**Problem:** What if the verify request is sent twice?

**Solution:** Check for duplicate `paymentId` before saving

```javascript
const existingPayment = await Payment.findOne({ paymentId });
if (existingPayment) {
  return { success: true, duplicate: true };
}
```

**Benefits:**
- Prevents double-charging
- Handles network retries gracefully
- Ensures data consistency

### 3. Test Mode Detection

**Automatic Detection:**
```javascript
function hasRealKeys() {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

  return (
    keyId.startsWith('rzp_') &&
    !keyId.includes('your_') &&
    keySecret &&
    !keySecret.includes('your_')
  );
}
```

**Benefits:**
- No code changes needed for test/live switching
- Automatic based on environment variables
- Safe fallback to test mode

---

## File Structure

```
backend/
├── config/
│   └── razorpay.js              # Razorpay initialization & verification
├── controllers/
│   └── paymentController.js     # Payment business logic
├── models/
│   └── Payment.js               # Payment schema (production-ready)
└── .env                         # Environment variables (DO NOT COMMIT)

src/app/api/payment/
├── create-order/
│   └── route.ts                 # Create Razorpay order
├── verify/
│   └── route.ts                 # Verify payment signature
└── check-status/
    └── route.ts                 # Check UPI payment status

src/app/checkout/
└── page.tsx                     # Frontend checkout (secure)
```

---

## Testing

### Test Mode (Development)

1. Set placeholder keys in `.env`:
```env
RAZORPAY_KEY_ID="rzp_test_your_key_id_here"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret_here"
```

2. System automatically detects test mode
3. Creates mock orders: `order_TEST_XXXXX`
4. Skips signature verification
5. Allows full payment flow testing

### Live Mode (Production)

1. Set real keys in `.env`:
```env
RAZORPAY_KEY_ID="rzp_live_XXXXX"
RAZORPAY_KEY_SECRET="your_live_secret"
```

2. System automatically detects live mode
3. Creates real Razorpay orders
4. Enforces signature verification
5. All payments are real

### Manual Testing

**Test Payment Details:**
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: `123456`

**UPI Testing:**
- Use any UPI app with test mode enabled
- Razorpay provides test UPI IDs

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid plan selected` | Plan ID not in catalogue | Check plan key in request |
| `Invalid payment signature` | Signature verification failed | Check RAZORPAY_KEY_SECRET |
| `Missing required fields` | Incomplete request body | Verify all fields are sent |
| `Payment already processed` | Duplicate payment ID | Idempotent - returns success |
| `Razorpay API error` | Network or API issue | Retry with exponential backoff |

### Logging

All payment operations are logged with:
- ✅ Success: `[Payment] ✅ Payment saved`
- ❌ Failure: `[Payment] ❌ INVALID SIGNATURE`
- ⚠️ Warning: `[Payment] ⚠️ Duplicate payment detected`

**No sensitive data in logs:**
- ❌ Never log full payment IDs
- ❌ Never log signatures
- ❌ Never log secret keys
- ✅ Log only necessary info for debugging

---

## Deployment Checklist

- [ ] Set real Razorpay keys in production `.env`
- [ ] Verify `NODE_ENV=production`
- [ ] Test payment flow end-to-end
- [ ] Verify email notifications work
- [ ] Check database indices are created
- [ ] Monitor payment logs for errors
- [ ] Set up alerts for failed payments
- [ ] Document payment support process
- [ ] Train support team on payment issues
- [ ] Set up backup payment method (if needed)

---

## Troubleshooting

### Payment shows as pending

1. Check if order was created: `db.payments.findOne({ orderId: 'order_XXXXX' })`
2. Verify signature in logs: `[Payment] ✅ Payment saved`
3. Check Razorpay dashboard for payment status

### Email not sent

1. Verify SendGrid API key is configured
2. Check email logs: `db.payments.findOne({ emailSent: false })`
3. Verify sender domain is verified in SendGrid

### Duplicate payment error

1. This is expected behavior (idempotency)
2. Check if payment was already saved: `db.payments.findOne({ paymentId: 'pay_XXXXX' })`
3. User can safely retry

### Signature verification failed

1. Verify `RAZORPAY_KEY_SECRET` is correct
2. Check if keys were rotated in Razorpay dashboard
3. Ensure no extra spaces in environment variables

---

## Support

For issues:
1. Check logs: `[Payment]` prefix
2. Verify environment variables
3. Test with Razorpay test keys first
4. Contact Razorpay support: https://razorpay.com/support

---

## References

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Orders API](https://razorpay.com/docs/api/orders/)
- [Razorpay Payments API](https://razorpay.com/docs/api/payments/)
- [HMAC SHA256 Verification](https://razorpay.com/docs/payments/webhooks/verify-signature/)

---

**Last Updated:** May 2026
**Status:** Production-Ready ✅
