# Adyapan — Production Deployment Guide

## Architecture

```
Frontend (Next.js)  →  Vercel
Backend (Express)   →  Render
Database            →  MongoDB Atlas
Media CDN           →  Cloudinary
Payments            →  Razorpay
```

---

## 1. MongoDB Atlas Setup

1. Create cluster at https://cloud.mongodb.com
2. Create database user with read/write access
3. Whitelist IPs: `0.0.0.0/0` (Render uses dynamic IPs)
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/adyapan_production`
5. Create indexes (run once):
   ```js
   // Users
   db.authusers.createIndex({ email: 1 }, { unique: true })
   db.authusers.createIndex({ role: 1, isActive: 1 })
   // Payments
   db.payments.createIndex({ paymentId: 1 }, { unique: true })
   db.payments.createIndex({ userEmail: 1, createdAt: -1 })
   // Enrollments
   db.enrollments.createIndex({ userId: 1, courseSlug: 1 }, { unique: true })
   // Courses
   db.courses.createIndex({ slug: 1 }, { unique: true })
   db.courses.createIndex({ title: 'text', description: 'text' })
   ```

---

## 2. Vercel (Frontend)

1. Connect GitHub repo to Vercel
2. Set **Root Directory**: `/` (project root)
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `.next`
5. Add all environment variables from `.env.example`
6. Set `NODE_ENV=production`
7. Deploy

**Required Vercel env vars:**
```
MONGODB_URI
JWT_SECRET
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID
SENDGRID_API_KEY
ADMIN_EMAIL
NEXT_PUBLIC_APP_URL=https://adyapan.com
NEXT_PUBLIC_BACKEND_URL=https://api.adyapan.com
```

---

## 3. Render (Backend)

1. Create new **Web Service** on Render
2. Connect GitHub repo
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Set **Environment**: Node
7. Add environment variables:
```
MONGO_URI=<atlas connection string>
JWT_SECRET=<32+ char secret>
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_APP_URL=https://adyapan.com
NODE_ENV=production
BACKEND_PORT=5000
```

---

## 4. Razorpay Production

1. Complete KYC at https://dashboard.razorpay.com
2. Switch to **Live Mode**
3. Get live keys: `rzp_live_...`
4. Add webhook: `https://adyapan.com/api/payment/webhook`
5. Webhook events: `payment.captured`, `payment.failed`
6. Copy webhook secret to `RAZORPAY_WEBHOOK_SECRET` env var

---

## 5. Pre-deployment Checklist

- [ ] All env vars set in Vercel and Render
- [ ] MongoDB Atlas IP whitelist updated
- [ ] Razorpay live keys configured
- [ ] `NODE_ENV=production` set everywhere
- [ ] `NEXT_PUBLIC_APP_URL` points to production domain
- [ ] Admin email set in `ADMIN_EMAIL`
- [ ] Run `npm run build` locally — zero errors
- [ ] Test payment flow end-to-end in staging
- [ ] Verify webhook signature verification works
- [ ] Check CORS allows only production domain

---

## 6. Security Checklist

- [ ] JWT_SECRET is 32+ random characters
- [ ] No secrets in git history
- [ ] `.env` in `.gitignore`
- [ ] Rate limiting active on auth/payment routes
- [ ] Helmet security headers enabled
- [ ] MongoDB sanitization active
- [ ] httpOnly cookies for JWT
- [ ] HTTPS enforced (Vercel/Render handle this)
- [ ] Admin routes protected by role check

---

## 7. Performance Checklist

- [ ] Next.js Image component used everywhere
- [ ] `loading="lazy"` on below-fold images
- [ ] `output: 'standalone'` in next.config.js
- [ ] `removeConsole` enabled in production
- [ ] Cloudinary CDN for user-uploaded media
- [ ] Static assets cached with immutable headers

