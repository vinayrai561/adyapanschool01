# Admin Invite System Documentation

## Overview

A secure, production-ready admin invite system that allows superadmins to generate invite links for creating admin and organization accounts. The system uses cryptographically secure tokens, mobile number verification, and comprehensive security measures.

## 🔐 Security Features

### Token Generation
- **Crypto-secure tokens**: 64-byte random tokens (128 hex characters) generated using Node.js `crypto.randomBytes()`
- **Single-use tokens**: Each token can only be used once
- **Expiration**: Configurable expiration (1-30 days)
- **Revocation**: Tokens can be revoked before use

### Verification Requirements
- ✅ Token must exist in database
- ✅ Token must not be expired
- ✅ Token must not be already used
- ✅ Token must not be revoked
- ✅ Email must exactly match invite email
- ✅ Mobile number must exactly match invite mobile number (timing-safe comparison)

### Rate Limiting
- **Invite creation**: 20 invites per hour per admin
- **Token verification**: 10 attempts per 15 minutes per IP
- **Signup attempts**: 5 attempts per 15 minutes per IP

### Security Logging
- Failed verification attempts logged on invite record
- All invite operations logged with admin email and IP
- Timing-safe string comparison for mobile number verification (prevents timing attacks)

## 📁 File Structure

```
src/
├── models/
│   └── AdminInvite.ts                    # MongoDB model for admin invites
├── app/
│   ├── api/
│   │   └── admin/
│   │       └── invites/
│   │           ├── route.ts              # GET (list) + POST (create)
│   │           ├── [id]/
│   │           │   └── revoke/
│   │           │       └── route.ts      # POST (revoke invite)
│   │           ├── verify/
│   │           │   └── route.ts          # POST (verify token - public)
│   │           └── signup/
│   │               └── route.ts          # POST (complete signup - public)
│   └── admin/
│       ├── invite/
│       │   └── [token]/
│       │       └── page.tsx              # Public invite signup page
│       └── invites/
│           └── page.tsx                  # Admin invite management
└── components/
    └── portal/
        └── AdminInvitesPage.tsx          # Admin UI component
```

## 🗄️ Database Schema

### AdminInvite Model

```typescript
{
  email: string;              // Locked email address
  mobileNumber: string;       // Locked mobile number (normalized)
  token: string;              // 128-char hex token (unique, indexed)
  role: 'ADMIN' | 'ORGANIZATION' | 'SUPERADMIN';
  used: boolean;              // Single-use flag
  usedBy?: string;            // User ID who redeemed
  usedAt?: Date;              // Redemption timestamp
  expiresAt: Date;            // Expiration date
  invitedBy: string;          // Superadmin user ID
  invitedByEmail: string;     // Superadmin email (audit)
  note?: string;              // Optional label
  revokedAt?: Date;           // Revocation timestamp
  revokedBy?: string;         // Revoking admin ID
  failedAttempts: number;     // Failed verification count
  lastFailedAt?: Date;        // Last failed attempt
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `token` (unique)
- `email` + `used`
- `used` + `expiresAt`
- `invitedBy` + `createdAt`

## 🔌 API Endpoints

### 1. Create Invite (Superadmin Only)

**POST** `/api/admin/invites`

**Auth Required:** Yes (ADMIN role)

**Request Body:**
```json
{
  "email": "user@example.com",
  "mobileNumber": "+1234567890",
  "role": "ADMIN" | "ORGANIZATION",
  "note": "Optional description",
  "expiresInDays": 7
}
```

**Response:**
```json
{
  "success": true,
  "invite": {
    "id": "...",
    "email": "user@example.com",
    "mobileNumber": "****7890",
    "role": "ADMIN",
    "expiresAt": "2026-05-14T...",
    "note": "...",
    "inviteLink": "https://adyapan.com/admin/invite/abc123...",
    "createdAt": "2026-05-07T..."
  }
}
```

**Rate Limit:** 20 invites per hour per admin

---

### 2. List Invites (Superadmin Only)

**GET** `/api/admin/invites?filter=all|active|used|expired|revoked`

**Auth Required:** Yes (ADMIN role)

**Response:**
```json
{
  "success": true,
  "invites": [
    {
      "id": "...",
      "email": "user@example.com",
      "mobileNumber": "****7890",
      "role": "ADMIN",
      "used": false,
      "usedBy": null,
      "usedAt": null,
      "expiresAt": "2026-05-14T...",
      "invitedBy": "admin_id",
      "invitedByEmail": "admin@adyapan.com",
      "note": "...",
      "revokedAt": null,
      "revokedBy": null,
      "failedAttempts": 0,
      "isExpired": false,
      "isRevoked": false,
      "isActive": true,
      "inviteLink": "https://...",
      "createdAt": "2026-05-07T..."
    }
  ],
  "total": 1
}
```

---

### 3. Revoke Invite (Superadmin Only)

**POST** `/api/admin/invites/[id]/revoke`

**Auth Required:** Yes (ADMIN role)

**Response:**
```json
{
  "success": true,
  "message": "Invite revoked successfully"
}
```

---

### 4. Verify Token (Public)

**POST** `/api/admin/invites/verify`

**Auth Required:** No

**Request Body:**
```json
{
  "token": "abc123..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "invite": {
    "email": "user@example.com",
    "mobileHint": "****7890",
    "role": "ADMIN",
    "expiresAt": "2026-05-14T...",
    "invitedBy": "admin@adyapan.com"
  }
}
```

**Response (Error):**
```json
{
  "error": "This invite has expired. Please request a new one."
}
```

**Rate Limit:** 10 attempts per 15 minutes per IP

---

### 5. Complete Signup (Public)

**POST** `/api/admin/invites/signup`

**Auth Required:** No

**Request Body:**
```json
{
  "token": "abc123...",
  "fullName": "John Doe",
  "email": "user@example.com",
  "mobileNumber": "+1234567890",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "companyName": "Acme Corp" // Optional, for ORGANIZATION role
}
```

**Validation:**
1. Token exists and is valid
2. Token not used, expired, or revoked
3. Email matches invite email exactly
4. Mobile number matches invite mobile number exactly
5. Password meets requirements (min 8 chars)
6. Passwords match

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN",
    "accountStatus": "approved"
  },
  "token": "jwt_token..."
}
```

**Response (Error):**
```json
{
  "error": "The mobile number does not match the invite. Please use the mobile number registered with this invite."
}
```

**Rate Limit:** 5 attempts per 15 minutes per IP

## 🎨 User Interface

### Admin Dashboard (`/admin/invites`)

**Features:**
- ✅ Create new invites with modal form
- ✅ View all invites with filtering (all/active/used/expired/revoked)
- ✅ Search by email or note
- ✅ Real-time statistics dashboard
- ✅ Copy invite link to clipboard
- ✅ Revoke unused invites
- ✅ View failed attempt counts
- ✅ Modern Adyapan orange/white theme
- ✅ Fully responsive (mobile/tablet/desktop)

**Stats Cards:**
- Total invites
- Active invites
- Used invites
- Expired invites
- Revoked invites

**Invite Card Details:**
- Email address
- Masked mobile number (****7890)
- Role badge (ADMIN/ORGANIZATION)
- Status badge (Active/Used/Expired/Revoked)
- Expiration date
- Optional note
- Show/hide invite link
- Copy link button
- Open link button
- Revoke button (for active invites)
- Failed attempts count
- Created by info
- Usage info (if used)

### Invite Signup Page (`/admin/invite/[token]`)

**Features:**
- ✅ Token verification on page load
- ✅ Display invite details (email, role, invited by)
- ✅ Mobile number hint (last 4 digits)
- ✅ Secure signup form with validation
- ✅ Password visibility toggle
- ✅ Real-time error messages
- ✅ Success confirmation with redirect
- ✅ Security notice with expiration date
- ✅ Modern gradient design
- ✅ Fully responsive

**Form Fields:**
- Full Name (required)
- Email (pre-filled, disabled)
- Mobile Number (required, must match invite)
- Company Name (required for ORGANIZATION role)
- Password (min 8 chars, required)
- Confirm Password (required)

**Validation Messages:**
- Invalid/expired token
- Email mismatch
- Mobile number mismatch
- Password requirements
- Generic errors

## 🚀 Usage Flow

### 1. Superadmin Creates Invite

```bash
# Superadmin logs into /admin
# Navigates to Admin Invites
# Clicks "Create Invite"
# Fills form:
#   - Email: newadmin@company.com
#   - Mobile: +1234567890
#   - Role: ADMIN
#   - Expires: 7 days
#   - Note: "New HR admin"
# Submits
# Copies invite link
```

### 2. Superadmin Shares Link

```bash
# Option 1: Copy link and send via email/Slack/WhatsApp
# Option 2: Integrate with email service (future enhancement)
```

### 3. Invited User Signs Up

```bash
# User receives link: https://adyapan.com/admin/invite/abc123...
# Opens link in browser
# Sees invite details (email, role, invited by)
# Fills signup form:
#   - Full Name
#   - Mobile Number (must match invite)
#   - Company Name (if org)
#   - Password
# Submits
# Account created and logged in
# Redirected to /admin or /organization
```

### 4. Token Marked as Used

```bash
# Token automatically marked as used
# Cannot be reused
# Invite shows "Used" status in admin dashboard
```

## 🔧 Configuration

### Environment Variables

```bash
# MongoDB connection
MONGODB_URI=mongodb://127.0.0.1:27017/adyapan_users

# JWT secret for auth tokens
JWT_SECRET=your-secret-key-here

# App URL for invite links
NEXT_PUBLIC_APP_URL=https://adyapan.com

# Node environment
NODE_ENV=production
```

### Customization

**Expiration Range:**
Edit `src/app/api/admin/invites/route.ts`:
```typescript
expiresInDays: z.number().int().min(1).max(30).default(7)
// Change max(30) to your preferred maximum
```

**Rate Limits:**
Edit rate limit constants in API files:
```typescript
const MAX_CREATES = 20;        // Invites per hour
const MAX_VERIFY = 10;         // Verifications per 15 min
const MAX_ATTEMPTS = 5;        // Signups per 15 min
```

**Mobile Number Format:**
Edit validation regex in `CreateInviteSchema`:
```typescript
mobileNumber: z.string()
  .min(10)
  .max(15)
  .regex(/^\+?[0-9\s\-()]+$/, 'Invalid mobile number format')
```

## 🧪 Testing

### Manual Testing Checklist

**Create Invite:**
- [ ] Create invite with valid data
- [ ] Try creating duplicate active invite (should fail)
- [ ] Try creating invite for existing user (should fail)
- [ ] Verify rate limiting (21st invite in hour should fail)

**Verify Token:**
- [ ] Verify valid token
- [ ] Verify expired token (should fail)
- [ ] Verify used token (should fail)
- [ ] Verify revoked token (should fail)
- [ ] Verify invalid token (should fail)
- [ ] Verify rate limiting (11th attempt should fail)

**Signup:**
- [ ] Complete signup with matching email and mobile
- [ ] Try signup with wrong email (should fail)
- [ ] Try signup with wrong mobile (should fail)
- [ ] Try signup with weak password (should fail)
- [ ] Try signup with mismatched passwords (should fail)
- [ ] Try reusing same token (should fail)
- [ ] Verify rate limiting (6th attempt should fail)

**Revoke:**
- [ ] Revoke unused invite
- [ ] Try revoking used invite (should fail)
- [ ] Try revoking already-revoked invite (should fail)
- [ ] Try using revoked token (should fail)

**UI:**
- [ ] Test on mobile (320px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] Test all filters (all/active/used/expired/revoked)
- [ ] Test search functionality
- [ ] Test copy to clipboard
- [ ] Test show/hide invite link

## 🔒 Security Best Practices

### Token Security
- ✅ Never expose tokens in logs (except creation)
- ✅ Never return full token in list responses
- ✅ Use HTTPS in production
- ✅ Tokens are single-use only
- ✅ Tokens expire automatically

### Mobile Verification
- ✅ Timing-safe comparison prevents timing attacks
- ✅ Normalized format (strip spaces/dashes)
- ✅ Masked in UI (****7890)
- ✅ Required for signup

### Rate Limiting
- ✅ Per-IP limits on public endpoints
- ✅ Per-admin limits on creation
- ✅ Failed attempts logged
- ✅ Automatic reset windows

### Audit Trail
- ✅ All operations logged with admin email
- ✅ IP addresses captured
- ✅ User agents captured
- ✅ Failed attempts tracked
- ✅ Timestamps on all actions

## 📊 Monitoring

### Key Metrics to Track

1. **Invite Creation Rate**
   - Monitor for unusual spikes
   - Alert if rate limit hit frequently

2. **Failed Verification Attempts**
   - High failure rate may indicate attack
   - Check `failedAttempts` field on invites

3. **Expired Invites**
   - Clean up old expired invites periodically
   - Consider shorter expiration for high-security roles

4. **Revocation Rate**
   - High revocation rate may indicate process issues
   - Review invite creation workflow

### Database Queries

```javascript
// Find invites with high failed attempts
db.admininvites.find({ failedAttempts: { $gte: 5 } })

// Find expired unused invites
db.admininvites.find({ 
  used: false, 
  revokedAt: { $exists: false },
  expiresAt: { $lt: new Date() }
})

// Count active invites by role
db.admininvites.aggregate([
  { $match: { used: false, expiresAt: { $gt: new Date() } } },
  { $group: { _id: "$role", count: { $sum: 1 } } }
])
```

## 🚨 Troubleshooting

### "Invalid invite link"
- Token may be expired, used, or revoked
- Check invite status in admin dashboard
- Create new invite if needed

### "Email does not match"
- User must use exact email from invite
- Email comparison is case-insensitive
- Check for typos

### "Mobile number does not match"
- User must use exact mobile from invite
- Include country code (e.g., +1)
- Format: +1234567890 or +1 234-567-8900

### "Too many attempts"
- Rate limit hit
- Wait 15 minutes and try again
- Check IP address if using VPN/proxy

### "Email already registered"
- User already has account
- Use password reset instead
- Or create invite with different email

## 🔄 Future Enhancements

### Email Integration
- [ ] Automatic email sending on invite creation
- [ ] Email templates with invite link
- [ ] Reminder emails before expiration

### Advanced Features
- [ ] Bulk invite creation (CSV upload)
- [ ] Custom expiration per invite
- [ ] Role-based invite permissions
- [ ] Invite analytics dashboard
- [ ] Webhook notifications

### Security Enhancements
- [ ] 2FA requirement for admin accounts
- [ ] IP whitelist for invite creation
- [ ] Geolocation tracking
- [ ] Device fingerprinting

## 📝 License

This system is part of the Adyapan platform. All rights reserved.

## 👥 Support

For issues or questions:
- Email: support@adyapan.com
- Slack: #admin-support
- Docs: https://docs.adyapan.com/admin-invites

---

**Last Updated:** May 7, 2026
**Version:** 1.0.0
**Author:** Adyapan Development Team
