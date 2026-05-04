# Payment Integration - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get Razorpay Keys

1. Go to https://dashboard.razorpay.com/app/keys
2. Copy **Key ID** and **Key Secret**
3. Test keys start with `rzp_test_`

### Step 2: Configure Environment

**Frontend (.env):**
```env
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
NODE_ENV=development
```

**Backend (backend/.env):**
```env
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
NODE_ENV=development
```

### Step 3: Start Development

```bash
# Frontend
npm run dev

# Backend (in another terminal)
cd backend && npm run dev
```

### Step 4: Test Payment Flow

1. Go to http://localhost:3000/checkout
2. Select a plan
3. Click "Pay Now"
4. In test mode, payment succeeds automatically
5. Check database: `db.payments.findOne()`

---

## 📋 Payment Plans

| Plan | Amount | Duration |
|------|--------|----------|
| Starter | ₹3,000 | 2 Months |
| Standard | ₹3,500 | 2 Months |
| Professional | ₹5,000 | 3 Months |
| Career Pro | ₹15,000 | 4 Months |

---

## 🔐 Security Checklist

- ✅ Keys in `.env` (not in code)
- ✅ `.env` in `.gitignore`
- ✅ Signature verified server-side
- ✅ Duplicate payments prevented
- ✅ No secrets in logs

---

## 🐛 Common Issues

### "Invalid plan selected"
- Check plan key: `plan-1`, `plan-2`, `plan-3`, `plan-4-premium`

### "Payment verification failed"
- Verify `RAZORPAY_KEY_SECRET` is correct
- Check for extra spaces in `.env`

### "Duplicate payment detected"
- This is normal (idempotency)
- Payment was already processed
- Safe to retry

### Email not sent
- Verify SendGrid API key
- Check email configuration
- See logs for errors

---

## 📊 Database Queries

### Find all payments
```javascript
db.payments.find()
```

### Find successful payments
```javascript
db.payments.find({ status: "success" })
```

### Find failed payments
```javascript
db.payments.find({ status: "failed" })
```

### Find payments by email
```javascript
db.payments.find({ userEmail: "john@example.com" })
```

### Find test mode payments
```javascript
db.payments.find({ isTestMode: true })
```

---

## 🧪 Test Mode vs Live Mode

### Test Mode (Development)
- Keys: `rzp_test_XXXXX`
- Orders: `order_TEST_XXXXX`
- Signature verification: Skipped
- Real charges: No

### Live Mode (Production)
- Keys: `rzp_live_XXXXX`
- Orders: `order_XXXXX`
- Signature verification: Required
- Real charges: Yes

---

## 📝 API Endpoints

### Create Order
```bash
POST /api/payment/create-order
Content-Type: application/json

{
  "plan": "plan-4-premium"
}
```

### Verify Payment
```bash
POST /api/payment/verify
Content-Type: application/json

{
  "razorpay_order_id": "order_XXXXX",
  "razorpay_payment_id": "pay_XXXXX",
  "razorpay_signature": "signature_hash",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "9876543210",
  "planName": "Adyapan Career Pro",
  "planLabel": "Career Pro Plan",
  "grandTotal": 17700,
  "planKey": "plan-4-premium"
}
```

### Check Status
```bash
GET /api/payment/check-status?orderId=order_XXXXX&name=John&email=john@example.com&phone=9876543210&planName=Adyapan+Career+Pro&planLabel=Career+Pro+Plan&planKey=plan-4-premium&grandTotal=17700
```

---

## 🔍 Debugging

### Enable Detailed Logs
```bash
# Watch payment logs
tail -f logs/payment.log | grep "\[Payment\]"
```

### Check Payment Record
```javascript
// In MongoDB
db.payments.findOne({ paymentId: "pay_XXXXX" })
```

### Verify Signature
```javascript
// In Node.js
const crypto = require('crypto');
const body = 'order_XXXXX|pay_XXXXX';
const signature = crypto
  .createHmac('sha256', 'your_secret')
  .update(body)
  .digest('hex');
console.log(signature);
```

---

## 📚 Full Documentation

For detailed information, see:
- `RAZORPAY_INTEGRATION_GUIDE.md` - Complete guide
- `REFACTORING_SUMMARY.md` - What changed
- `backend/config/razorpay.js` - Configuration code
- `backend/controllers/paymentController.js` - Business logic

---

## ✅ Deployment Checklist

Before going live:

- [ ] Set real Razorpay keys
- [ ] Test payment flow end-to-end
- [ ] Verify email notifications
- [ ] Check database indices
- [ ] Monitor logs for errors
- [ ] Set up alerts
- [ ] Document support process
- [ ] Train support team

---

## 🆘 Need Help?

1. Check logs: `[Payment]` prefix
2. Verify environment variables
3. Test with test keys first
4. See troubleshooting guide
5. Contact Razorpay support

---

**Ready to go live?** Update `.env` with real keys and deploy! 🚀
