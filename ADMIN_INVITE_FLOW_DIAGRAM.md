# Admin Invite System - Flow Diagrams

## 🔄 Complete System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ADMIN INVITE SYSTEM                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  SUPERADMIN  │
│   (ADMIN)    │
└──────┬───────┘
       │
       │ 1. Login to /admin
       │
       ▼
┌──────────────────────┐
│  Admin Dashboard     │
│  /admin/invites      │
└──────┬───────────────┘
       │
       │ 2. Click "Create Invite"
       │
       ▼
┌──────────────────────────────────────┐
│  Create Invite Modal                 │
│  ┌────────────────────────────────┐  │
│  │ Email: newadmin@company.com    │  │
│  │ Mobile: +1234567890            │  │
│  │ Role: ADMIN                    │  │
│  │ Expires: 7 days                │  │
│  │ Note: New HR admin             │  │
│  └────────────────────────────────┘  │
└──────┬───────────────────────────────┘
       │
       │ 3. Submit form
       │
       ▼
┌──────────────────────────────────────┐
│  POST /api/admin/invites             │
│  ┌────────────────────────────────┐  │
│  │ ✓ Verify ADMIN role            │  │
│  │ ✓ Check rate limit (20/hour)   │  │
│  │ ✓ Validate email format        │  │
│  │ ✓ Validate mobile format       │  │
│  │ ✓ Check for duplicate          │  │
│  │ ✓ Generate crypto token        │  │
│  │   (64 bytes = 128 hex chars)   │  │
│  │ ✓ Save to MongoDB              │  │
│  └────────────────────────────────┘  │
└──────┬───────────────────────────────┘
       │
       │ 4. Return invite link
       │
       ▼
┌──────────────────────────────────────┐
│  Success Modal                       │
│  ┌────────────────────────────────┐  │
│  │ Invite Created! 🎉             │  │
│  │                                │  │
│  │ Link:                          │  │
│  │ https://adyapan.com/admin/     │  │
│  │ invite/abc123def456...         │  │
│  │                                │  │
│  │ [Copy Link] [Done]             │  │
│  └────────────────────────────────┘  │
└──────┬───────────────────────────────┘
       │
       │ 5. Copy & share link
       │
       ▼
┌──────────────────────────────────────┐
│  Share via:                          │
│  • Email                             │
│  • Slack                             │
│  • WhatsApp                          │
│  • Any secure channel                │
└──────┬───────────────────────────────┘
       │
       │ 6. Invited user receives link
       │
       ▼
┌──────────────┐
│ INVITED USER │
└──────┬───────┘
       │
       │ 7. Opens invite link
       │    /admin/invite/abc123def456...
       │
       ▼
┌──────────────────────────────────────┐
│  POST /api/admin/invites/verify      │
│  ┌────────────────────────────────┐  │
│  │ ✓ Check rate limit (10/15min)  │  │
│  │ ✓ Find token in database       │  │
│  │ ✓ Check not used               │  │
│  │ ✓ Check not expired            │  │
│  │ ✓ Check not revoked            │  │
│  │ ✓ Return invite details        │  │
│  └────────────────────────────────┘  │
└──────┬───────────────────────────────┘
       │
       │ 8. Show invite details
       │
       ▼
┌──────────────────────────────────────┐
│  Invite Signup Page                  │
│  ┌────────────────────────────────┐  │
│  │ You've Been Invited! 🎉        │  │
│  │                                │  │
│  │ Email: newadmin@company.com    │  │
│  │ Mobile: ****7890               │  │
│  │ Role: ADMIN                    │  │
│  │ Invited by: admin@adyapan.com  │  │
│  │                                │  │
│  │ ┌────────────────────────────┐ │  │
│  │ │ Full Name: [________]      │ │  │
│  │ │ Email: [pre-filled]        │ │  │
│  │ │ Mobile: [________]         │ │  │
│  │ │ Password: [________]       │ │  │
│  │ │ Confirm: [________]        │ │  │
│  │ │                            │ │  │
│  │ │ [Create Account]           │ │  │
│  │ └────────────────────────────┘ │  │
│  └────────────────────────────────┘  │
└──────┬───────────────────────────────┘
       │
       │ 9. Fill form & submit
       │
       ▼
┌──────────────────────────────────────┐
│  POST /api/admin/invites/signup      │
│  ┌────────────────────────────────┐  │
│  │ ✓ Check rate limit (5/15min)   │  │
│  │ ✓ Find token in database       │  │
│  │ ✓ Verify not used              │  │
│  │ ✓ Verify not expired           │  │
│  │ ✓ Verify not revoked           │  │
│  │ ✓ Match email (exact)          │  │
│  │ ✓ Match mobile (timing-safe)   │  │
│  │ ✓ Validate password (min 8)    │  │
│  │ ✓ Hash password (bcrypt)       │  │
│  │ ✓ Create user in MongoDB       │  │
│  │ ✓ Mark token as used           │  │
│  │ ✓ Issue JWT token              │  │
│  └────────────────────────────────┘  │
└──────┬───────────────────────────────┘
       │
       │ 10. Account created!
       │
       ▼
┌──────────────────────────────────────┐
│  Success & Redirect                  │
│  ┌────────────────────────────────┐  │
│  │ ✓ Account created!             │  │
│  │   Redirecting...               │  │
│  └────────────────────────────────┘  │
└──────┬───────────────────────────────┘
       │
       │ 11. Redirect based on role
       │
       ▼
┌──────────────────────────────────────┐
│  Role-Based Redirect                 │
│  ┌────────────────────────────────┐  │
│  │ ADMIN → /admin                 │  │
│  │ ORGANIZATION → /organization   │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

## 🔐 Security Validation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SECURITY VALIDATION LAYERS                      │
└─────────────────────────────────────────────────────────────────────┘

USER SUBMITS SIGNUP
       │
       ▼
┌──────────────────────┐
│ Layer 1: Rate Limit  │
│ ✓ 5 attempts/15min   │
│ ✓ Per IP address     │
└──────┬───────────────┘
       │ PASS
       ▼
┌──────────────────────┐
│ Layer 2: Token Valid │
│ ✓ Token exists       │
│ ✓ Token format valid │
└──────┬───────────────┘
       │ PASS
       ▼
┌──────────────────────┐
│ Layer 3: Token State │
│ ✓ Not used           │
│ ✓ Not expired        │
│ ✓ Not revoked        │
└──────┬───────────────┘
       │ PASS
       ▼
┌──────────────────────┐
│ Layer 4: Email Match │
│ ✓ Exact match        │
│ ✓ Case-insensitive   │
└──────┬───────────────┘
       │ PASS
       ▼
┌──────────────────────┐
│ Layer 5: Mobile Match│
│ ✓ Timing-safe compare│
│ ✓ Normalized format  │
└──────┬───────────────┘
       │ PASS
       ▼
┌──────────────────────┐
│ Layer 6: Password    │
│ ✓ Min 8 characters   │
│ ✓ Passwords match    │
└──────┬───────────────┘
       │ PASS
       ▼
┌──────────────────────┐
│ Layer 7: Duplicate   │
│ ✓ Email not in use   │
└──────┬───────────────┘
       │ PASS
       ▼
┌──────────────────────┐
│ ✅ CREATE ACCOUNT    │
└──────────────────────┘
```

## 📊 Database State Transitions

```
┌─────────────────────────────────────────────────────────────────────┐
│                    INVITE LIFECYCLE STATES                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   CREATED    │  Initial state after creation
│              │  • used: false
│  Status:     │  • expiresAt: future date
│  🟢 ACTIVE   │  • revokedAt: null
└──────┬───────┘
       │
       ├─────────────────────────────────────┐
       │                                     │
       │ User signs up                       │ Admin revokes
       │                                     │
       ▼                                     ▼
┌──────────────┐                      ┌──────────────┐
│     USED     │                      │   REVOKED    │
│              │                      │              │
│  Status:     │                      │  Status:     │
│  🟣 USED     │                      │  🔴 REVOKED  │
│              │                      │              │
│  • used: true│                      │  • revokedAt:│
│  • usedBy: X │                      │    timestamp │
│  • usedAt: T │                      │  • revokedBy:│
└──────────────┘                      │    admin_id  │
                                      └──────────────┘
       │
       │ Time passes
       │
       ▼
┌──────────────┐
│   EXPIRED    │  expiresAt < now
│              │  • used: false
│  Status:     │  • expiresAt: past date
│  🟠 EXPIRED  │  • revokedAt: null
└──────────────┘
```

## 🔄 Admin Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ADMIN MANAGEMENT ACTIONS                         │
└─────────────────────────────────────────────────────────────────────┘

ADMIN DASHBOARD (/admin/invites)
       │
       ├─────────────┬─────────────┬─────────────┬─────────────┐
       │             │             │             │             │
       ▼             ▼             ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  CREATE  │  │   VIEW   │  │  FILTER  │  │  SEARCH  │  │  REVOKE  │
│  INVITE  │  │   LIST   │  │  STATUS  │  │  EMAIL   │  │  INVITE  │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │             │
     │             │             │             │             │
     ▼             ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         INVITE RECORDS                              │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ ID: 123                                                       │  │
│  │ Email: user@company.com                                       │  │
│  │ Mobile: ****7890                                              │  │
│  │ Role: ADMIN                                                   │  │
│  │ Status: 🟢 ACTIVE                                             │  │
│  │ Expires: May 14, 2026                                         │  │
│  │ Created: May 7, 2026 by admin@adyapan.com                    │  │
│  │ Failed Attempts: 0                                            │  │
│  │                                                               │  │
│  │ [Show Link] [Copy] [Revoke]                                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## 📱 Responsive UI Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      RESPONSIVE BREAKPOINTS                         │
└─────────────────────────────────────────────────────────────────────┘

MOBILE (320px - 767px)
┌─────────────────────┐
│ ☰  Admin Invites    │  ← Hamburger menu
├─────────────────────┤
│ [+ Create Invite]   │  ← Full width button
├─────────────────────┤
│ Stats (2 columns)   │
│ ┌────────┬────────┐ │
│ │ Total  │ Active │ │
│ ├────────┼────────┤ │
│ │ Used   │ Expired│ │
│ └────────┴────────┘ │
├─────────────────────┤
│ [Search]            │
│ [Filter Buttons]    │
├─────────────────────┤
│ Invite Card 1       │
│ (Stacked layout)    │
├─────────────────────┤
│ Invite Card 2       │
└─────────────────────┘

TABLET (768px - 1023px)
┌──────┬──────────────────────────┐
│      │ Admin Invites            │
│ Nav  ├──────────────────────────┤
│ Bar  │ [+ Create Invite]        │
│      ├──────────────────────────┤
│      │ Stats (3-4 columns)      │
│      │ ┌─────┬─────┬─────┬────┐│
│      │ │Total│Activ│Used │Exp │││
│      │ └─────┴─────┴─────┴────┘│
│      ├──────────────────────────┤
│      │ [Search] [Filters]       │
│      ├──────────────────────────┤
│      │ Invite Cards (1 column)  │
└──────┴──────────────────────────┘

DESKTOP (1024px+)
┌──────┬────────────────────────────────────┐
│      │ Admin Invites    [+ Create Invite] │
│      ├────────────────────────────────────┤
│ Nav  │ Stats (5 columns)                  │
│ Bar  │ ┌─────┬──────┬─────┬────┬────────┐│
│      │ │Total│Active│Used │Exp │Revoked │││
│      │ └─────┴──────┴─────┴────┴────────┘│
│      ├────────────────────────────────────┤
│      │ [Search............] [Filters]     │
│      ├────────────────────────────────────┤
│      │ Invite Cards (1 column, wider)     │
│      │ ┌────────────────────────────────┐ │
│      │ │ Full details with all actions  │ │
│      │ └────────────────────────────────┘ │
└──────┴────────────────────────────────────┘
```

## 🎯 Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ERROR SCENARIOS                              │
└─────────────────────────────────────────────────────────────────────┘

USER ACTION
    │
    ▼
┌─────────────────┐
│ Validation      │
│ Check           │
└────┬────────────┘
     │
     ├─── PASS ──────────────────────────────────────┐
     │                                                │
     └─── FAIL                                        │
          │                                           │
          ▼                                           ▼
     ┌─────────────────────────────────┐      ┌──────────────┐
     │ Error Type?                     │      │   SUCCESS    │
     └─┬───────────────────────────────┘      │   RESPONSE   │
       │                                       └──────────────┘
       ├─── Invalid Token
       │    └─> "Invalid invite link. Please contact admin."
       │
       ├─── Expired Token
       │    └─> "This invite has expired. Request new one."
       │
       ├─── Used Token
       │    └─> "This invite has already been used."
       │
       ├─── Revoked Token
       │    └─> "This invite has been revoked. Contact admin."
       │
       ├─── Email Mismatch
       │    └─> "Email does not match invite."
       │
       ├─── Mobile Mismatch
       │    └─> "Mobile number does not match invite."
       │
       ├─── Rate Limited
       │    └─> "Too many attempts. Try again in 15 minutes."
       │
       └─── Duplicate Email
            └─> "Email already registered."
```

## 🔄 Token Lifecycle Timeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                      TOKEN LIFECYCLE                                │
└─────────────────────────────────────────────────────────────────────┘

Day 0                Day 3                Day 7                Day 8
│                    │                    │                    │
│ Token Created      │                    │ Token Expires      │
│ ✅ ACTIVE          │                    │ ⚠️ EXPIRED         │
│                    │                    │                    │
├────────────────────┼────────────────────┼────────────────────┤
│                    │                    │                    │
│ Can be:            │ Can be:            │ Can be:            │ Cannot be:
│ • Used             │ • Used             │ • Viewed           │ • Used
│ • Revoked          │ • Revoked          │ • Revoked          │ • Revoked
│ • Viewed           │ • Viewed           │                    │
│                    │                    │                    │
│                    │                    │                    │
│                    │ User Signs Up      │                    │
│                    │ 🟣 USED            │                    │
│                    │                    │                    │
│                    │ Cannot be:         │                    │
│                    │ • Used again       │                    │
│                    │ • Revoked          │                    │
│                    │                    │                    │
│ Admin Revokes      │                    │                    │
│ 🔴 REVOKED         │                    │                    │
│                    │                    │                    │
│ Cannot be:         │                    │                    │
│ • Used             │                    │                    │
│ • Revoked again    │                    │                    │
└────────────────────┴────────────────────┴────────────────────┘
```

---

**Visual Guide Version:** 1.0.0
**Last Updated:** May 7, 2026
