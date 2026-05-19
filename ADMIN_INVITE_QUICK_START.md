# Admin Invite System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Create Superadmin Account

Run the seed script to create your first superadmin:

```bash
node scripts/seed-super-admin.js
```

**Default credentials:**
- Email: `rupeshrupak609.com`
- Password: `Adyapan@Admin2025!`

Or use custom credentials:

```bash
ADMIN_EMAIL=you@adyapan.com ADMIN_PASSWORD=YourPassword123! node scripts/seed-super-admin.js
```

### Step 2: Login to Admin Portal

1. Navigate to `/auth?type=organization`
2. Login with superadmin credentials
3. You'll be redirected to `/admin`

### Step 3: Create Your First Invite

1. Click **"Admin Invites"** in the sidebar
2. Click **"Create Invite"** button
3. Fill in the form:
   - **Email:** newadmin@company.com
   - **Mobile Number:** +1234567890
   - **Role:** ADMIN or ORGANIZATION
   - **Expires In:** 7 days (default)
   - **Note:** Optional description
4. Click **"Create Invite"**
5. Copy the invite link

### Step 4: Share the Invite Link

Send the invite link to the user via:
- Email
- Slack
- WhatsApp
- Any secure channel

**Example link:**
```
https://adyapan.com/admin/invite/abc123def456...
```

### Step 5: User Signs Up

The invited user:
1. Opens the invite link
2. Sees their email and role
3. Fills the signup form:
   - Full Name
   - Mobile Number (must match invite)
   - Company Name (if organization)
   - Password (min 8 characters)
4. Submits the form
5. Account created and logged in automatically!

## 📋 Common Tasks

### View All Invites

Navigate to `/admin/invites` to see:
- All invites with status
- Filter by: all, active, used, expired, revoked
- Search by email or note
- Statistics dashboard

### Revoke an Invite

1. Go to `/admin/invites`
2. Find the invite
3. Click **"Revoke"** button
4. Confirm revocation

The invite link will no longer work.

### Check Invite Status

Each invite shows:
- ✅ **Active** - Ready to use
- 🟣 **Used** - Already redeemed
- 🟠 **Expired** - Past expiration date
- 🔴 **Revoked** - Manually revoked

### Copy Invite Link

1. Find the invite in the list
2. Click **"Show Invite Link"**
3. Click the **copy icon** 📋
4. Link copied to clipboard!

## 🔐 Security Checklist

Before going to production:

- [ ] Change default superadmin password
- [ ] Set `JWT_SECRET` environment variable
- [ ] Set `NEXT_PUBLIC_APP_URL` to your domain
- [ ] Enable HTTPS in production
- [ ] Review rate limits in API files
- [ ] Set up monitoring for failed attempts
- [ ] Document your invite creation process
- [ ] Train admins on security best practices

## 🎯 Best Practices

### Creating Invites

✅ **DO:**
- Use work email addresses
- Include country code in mobile numbers
- Add descriptive notes
- Set appropriate expiration (7 days default)
- Share links securely

❌ **DON'T:**
- Share invite links publicly
- Use personal email addresses
- Create invites without verification
- Set very long expiration periods
- Reuse revoked invites

### Managing Invites

✅ **DO:**
- Review active invites regularly
- Revoke unused expired invites
- Monitor failed attempt counts
- Keep notes descriptive
- Clean up old invites

❌ **DON'T:**
- Leave unused invites active indefinitely
- Ignore high failed attempt counts
- Create duplicate invites
- Share the same link multiple times

## 🐛 Troubleshooting

### "Invalid invite link"

**Possible causes:**
- Link expired
- Link already used
- Link revoked
- Invalid token

**Solution:** Create a new invite

---

### "Email does not match"

**Cause:** User entered different email than invite

**Solution:** User must use exact email from invite

---

### "Mobile number does not match"

**Cause:** User entered different mobile than invite

**Solution:** 
- Check mobile number format: +1234567890
- Include country code
- Match exactly with invite

---

### "Too many attempts"

**Cause:** Rate limit reached

**Solution:** Wait 15 minutes and try again

---

### Can't see "Admin Invites" in sidebar

**Cause:** Not logged in as ADMIN role

**Solution:** Login with superadmin account

## 📞 Need Help?

- 📖 Full documentation: `ADMIN_INVITE_SYSTEM.md`
- 💬 Support: support@adyapan.com
- 🐛 Report issues: GitHub Issues

## 🎉 You're All Set!

Your admin invite system is ready to use. Start creating invites and onboarding your team!

---

**Quick Links:**
- Admin Portal: `/admin`
- Admin Invites: `/admin/invites`
- Auth Page: `/auth?type=organization`
