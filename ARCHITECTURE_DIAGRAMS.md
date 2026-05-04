# Razorpay Integration - Architecture Diagrams

## 1. Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PAYMENT FLOW                                │
└─────────────────────────────────────────────────────────────────────┘

                            FRONTEND
                         (Next.js/React)
                              │
                              │ 1. User selects plan
                              ↓
                    ┌─────────────────────┐
                    │  Checkout Page      │
                    │  - Plan selection   │
                    │  - User details     │
                    │  - Amount display   │
                    └─────────────────────┘
                              │
                              │ 2. POST /api/payment/create-order
                              ↓
                    ┌─────────────────────┐
                    │  Create Order API   │
                    │  - Validate plan    │
                    │  - Check keys       │
                    │  - Create order     │
                    └─────────────────────┘
                              │
                              │ Returns: orderId, amount, keyId
                              ↓
                    ┌─────────────────────┐
                    │ Razorpay Checkout   │
                    │ - Show QR/Form      │
                    │ - User pays         │
                    │ - Get signature     │
                    └─────────────────────┘
                              │
                              │ 3. POST /api/payment/verify
                              ↓
                    ┌─────────────────────┐
                    │  Verify Payment API │
                    │  - Verify signature │
                    │  - Check duplicate  │
                    │  - Save payment     │
                    │  - Enroll user      │
                    │  - Send email       │
                    └─────────────────────┘
                              │
                              │ Returns: success/error
                              ↓
                    ┌─────────────────────┐
                    │  Success Screen     │
                    │  - Confirmation     │
                    │  - Redirect         │
                    │  - Dashboard access │
                    └─────────────────────┘
```

---

## 2. UPI Polling Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      UPI POLLING FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

                            FRONTEND
                         (Next.js/React)
                              │
                              │ 1. Create order
                              ↓
                    ┌─────────────────────┐
                    │  Show QR Code       │
                    │  - Display QR       │
                    │  - Show amount      │
                    │  - Start polling    │
                    └─────────────────────┘
                              │
                              │ 2. Poll every 3 seconds
                              ↓
                    ┌─────────────────────┐
                    │  Check Status API   │
                    │  - Query orderId    │
                    │  - Check database   │
                    │  - Check Razorpay   │
                    └─────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
                    ↓ (Not paid)         ↓ (Paid)
            ┌──────────────┐      ┌──────────────┐
            │ Keep polling │      │ Save payment │
            │ (max 40x)    │      │ Enroll user  │
            └──────────────┘      │ Send email   │
                    │             └──────────────┘
                    │                    │
                    │ (Timeout)          │ (Success)
                    ↓                    ↓
            ┌──────────────┐      ┌──────────────┐
            │ Show timeout │      │ Redirect to  │
            │ - Retry btn  │      │ Dashboard    │
            │ - Back btn   │      └──────────────┘
            └──────────────┘
```

---

## 3. Signature Verification Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                  SIGNATURE VERIFICATION                             │
└─────────────────────────────────────────────────────────────────────┘

                    FRONTEND (Untrusted)
                              │
                              │ Receives from Razorpay:
                              │ - razorpay_order_id
                              │ - razorpay_payment_id
                              │ - razorpay_signature
                              ↓
                    ┌─────────────────────┐
                    │  POST /verify       │
                    │  (Send all 3 values)│
                    └─────────────────────┘
                              │
                              ↓
                    ┌─────────────────────────────────────┐
                    │  BACKEND (Trusted)                  │
                    │  - Get RAZORPAY_KEY_SECRET from env │
                    │  - Create body: orderId|paymentId   │
                    │  - Calculate HMAC SHA256:           │
                    │    expected = HMAC(body, secret)    │
                    │  - Compare:                         │
                    │    expected === signature?          │
                    └─────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
                    ↓ (Valid)            ↓ (Invalid)
            ┌──────────────┐      ┌──────────────┐
            │ Save payment │      │ Reject       │
            │ Enroll user  │      │ Log error    │
            │ Send email   │      │ Return error │
            │ Return OK    │      └──────────────┘
            └──────────────┘
```

---

## 4. Database Schema Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PAYMENT COLLECTION                             │
└─────────────────────────────────────────────────────────────────────┘

Payment Document:
{
  _id: ObjectId,
  
  // User Information
  userId: ObjectId,              ← Reference to AuthUser
  userName: String,              ← "John Doe"
  userEmail: String,             ← "john@example.com" (indexed)
  userPhone: String,             ← "9876543210"
  
  // Payment Details
  paymentId: String,             ← "pay_XXXXX" (unique, indexed)
  orderId: String,               ← "order_XXXXX" (indexed)
  
  // Course Information
  courseSlug: String,            ← "plan-4-premium"
  courseName: String,            ← "Adyapan Career Pro"
  planLabel: String,             ← "Career Pro Plan"
  
  // Amount Details (in INR)
  baseAmount: Number,            ← 12712 (before GST)
  gstAmount: Number,             ← 2288 (18% GST)
  totalAmount: Number,           ← 15000 (total)
  currency: String,              ← "INR"
  
  // Payment Status
  status: String,                ← "success" | "failed" | "pending"
  paymentMethod: String,         ← "upi" | "card" | "netbanking"
  
  // Verification
  signatureVerified: Boolean,    ← true (HMAC verified)
  isTestMode: Boolean,           ← false (live mode)
  
  // Notifications
  emailSent: Boolean,            ← true
  smsSent: Boolean,              ← false
  
  // Enrollment
  enrollmentCreated: Boolean,    ← true
  
  // Timestamps
  paidAt: Date,                  ← 2026-05-04T10:30:00Z
  createdAt: Date,               ← 2026-05-04T10:30:00Z
  updatedAt: Date                ← 2026-05-04T10:30:00Z
}

Indices:
├── paymentId (unique)
├── orderId
├── userEmail + createdAt
├── status + createdAt
└── userId + createdAt
```

---

## 5. API Endpoint Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      API ENDPOINTS                                  │
└─────────────────────────────────────────────────────────────────────┘

POST /api/payment/create-order
├── Input: { plan: "plan-4-premium" }
├── Process:
│   ├── Validate plan
│   ├── Check Razorpay keys
│   ├── Create order (live) or mock (test)
│   └── Return orderId
└── Output: { orderId, amount, keyId, testMode }

POST /api/payment/verify
├── Input: {
│   ├── razorpay_order_id
│   ├── razorpay_payment_id
│   ├── razorpay_signature
│   ├── customerName
│   ├── customerEmail
│   ├── customerPhone
│   ├── planName
│   ├── planLabel
│   ├── grandTotal
│   └── planKey
│ }
├── Process:
│   ├── Verify signature (HMAC SHA256)
│   ├── Check for duplicates
│   ├── Save payment
│   ├── Enroll user
│   ├── Send email
│   └── Return success
└── Output: { success, paymentId, orderId }

GET /api/payment/check-status
├── Input: ?orderId=order_XXXXX&...
├── Process:
│   ├── Check database (fast path)
│   ├── Check Razorpay API (fallback)
│   ├── Save payment if found
│   ├── Enroll user
│   └── Send email
└── Output: { paid: true/false, paymentId }
```

---

## 6. Security Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                                  │
└─────────────────────────────────────────────────────────────────────┘

Layer 1: Environment Variables
├── RAZORPAY_KEY_ID (from .env)
├── RAZORPAY_KEY_SECRET (from .env)
└── NODE_ENV (development/production)

Layer 2: Signature Verification
├── Frontend sends: orderId|paymentId|signature
├── Backend calculates: HMAC(orderId|paymentId, secret)
├── Backend compares: calculated === received
└── Result: Accept or Reject

Layer 3: Duplicate Detection
├── Check paymentId in database
├── If exists: Return cached success
└── If new: Save and process

Layer 4: Input Validation
├── Validate plan ID
├── Validate required fields
├── Validate email format
└── Validate phone format

Layer 5: Error Handling
├── Catch all exceptions
├── Log errors (no secrets)
├── Return safe error messages
└── Prevent information leakage

Layer 6: Audit Trail
├── Log all operations
├── Track timestamps
├── Record user actions
└── Enable debugging
```

---

## 7. Test Mode vs Live Mode

```
┌─────────────────────────────────────────────────────────────────────┐
│              TEST MODE vs LIVE MODE                                 │
└─────────────────────────────────────────────────────────────────────┘

TEST MODE (Development)
├── Keys: rzp_test_XXXXX
├── Orders: order_TEST_XXXXX
├── Payments: pay_TEST_XXXXX
├── Signature Verification: SKIPPED
├── Real Charges: NO
├── Database: Test data
├── Email: Sent (test)
└── Use Case: Development & Testing

                    ↕ (Automatic Detection)

LIVE MODE (Production)
├── Keys: rzp_live_XXXXX
├── Orders: order_XXXXX
├── Payments: pay_XXXXX
├── Signature Verification: REQUIRED
├── Real Charges: YES
├── Database: Real data
├── Email: Sent (real)
└── Use Case: Production

Detection Logic:
if (keyId.startsWith('rzp_') && !keyId.includes('your_')) {
  // LIVE MODE
} else {
  // TEST MODE
}
```

---

## 8. Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING                                   │
└─────────────────────────────────────────────────────────────────────┘

Error Occurs
    │
    ├─→ Catch Exception
    │
    ├─→ Log Error (no secrets)
    │   └─→ [Payment] ❌ Error message
    │
    ├─→ Determine Error Type
    │   ├─→ Validation Error (400)
    │   ├─→ Signature Error (400)
    │   ├─→ Database Error (500)
    │   ├─→ API Error (500)
    │   └─→ Unknown Error (500)
    │
    ├─→ Return Safe Error Response
    │   └─→ { success: false, error: "User-friendly message" }
    │
    └─→ Continue Execution
        └─→ No crash, graceful degradation
```

---

## 9. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                  DEPLOYMENT ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────┘

Development Environment
├── .env (test keys)
├── localhost:3000 (frontend)
├── localhost:5000 (backend)
├── MongoDB (local)
└── Test Razorpay keys

Staging Environment
├── .env (test keys)
├── staging.example.com
├── MongoDB (staging)
├── SendGrid (test)
└── Full testing

Production Environment
├── .env (real keys)
├── example.com
├── MongoDB (production)
├── SendGrid (production)
├── Monitoring & Alerts
└── Backup & Recovery

Environment Detection:
NODE_ENV=development  → Test mode
NODE_ENV=production   → Live mode
```

---

## 10. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA FLOW                                      │
└─────────────────────────────────────────────────────────────────────┘

User Input
    │
    ├─→ Frontend Validation
    │   └─→ Check required fields
    │
    ├─→ Send to Backend
    │   └─→ POST /api/payment/verify
    │
    ├─→ Backend Validation
    │   ├─→ Check required fields
    │   ├─→ Verify signature
    │   └─→ Check duplicates
    │
    ├─→ Database Operations
    │   ├─→ Save Payment
    │   ├─→ Create Enrollment
    │   ├─→ Update Progress
    │   └─→ Update User
    │
    ├─→ External Services
    │   ├─→ SendGrid (Email)
    │   ├─→ Fast2SMS (SMS)
    │   └─→ Razorpay (Verification)
    │
    ├─→ Response to Frontend
    │   └─→ { success: true, ... }
    │
    └─→ Frontend Actions
        ├─→ Show success message
        ├─→ Update UI
        └─→ Redirect to dashboard
```

---

## 11. Security Verification Process

```
┌─────────────────────────────────────────────────────────────────────┐
│              SECURITY VERIFICATION PROCESS                          │
└─────────────────────────────────────────────────────────────────────┘

Step 1: Receive Payment Data
├── From: Razorpay (via frontend)
├── Contains: orderId, paymentId, signature
└── Status: UNTRUSTED

Step 2: Extract Secret
├── From: Environment variable
├── Key: RAZORPAY_KEY_SECRET
└── Status: TRUSTED (server-side only)

Step 3: Calculate Expected Signature
├── Formula: HMAC-SHA256(orderId|paymentId, secret)
├── Algorithm: SHA256
└── Result: Expected signature

Step 4: Compare Signatures
├── Received: From Razorpay
├── Expected: Calculated by backend
├── Match: ✅ Valid
├── No Match: ❌ Invalid
└── Result: Accept or Reject

Step 5: Process Payment
├── If Valid: Save to database
├── If Invalid: Log error & reject
└── Result: Payment record created or error returned
```

---

## 12. Monitoring & Logging

```
┌─────────────────────────────────────────────────────────────────────┐
│              MONITORING & LOGGING                                   │
└─────────────────────────────────────────────────────────────────────┘

Log Levels:
├── ✅ SUCCESS: [Payment] ✅ Payment saved
├── ❌ ERROR: [Payment] ❌ INVALID SIGNATURE
├── ⚠️ WARNING: [Payment] ⚠️ Duplicate payment detected
└── ℹ️ INFO: [Payment] Order created

Monitored Metrics:
├── Total payments
├── Successful payments
├── Failed payments
├── Duplicate payments
├── Average response time
├── Email delivery rate
├── Error rate
└── User enrollment rate

Alerts:
├── High error rate (>5%)
├── Payment processing delay (>5s)
├── Email delivery failure
├── Database connection error
├── Razorpay API error
└── Signature verification failure
```

---

**These diagrams provide a visual understanding of the Razorpay integration architecture.**

For detailed information, refer to the comprehensive documentation files.
