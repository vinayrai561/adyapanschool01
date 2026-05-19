/**
 * Adyapan — Superadmin Seed Script
 *
 * Creates the first SUPERADMIN account directly in MongoDB.
 * Run ONCE to bootstrap the system.
 *
 * Usage:
 *   node scripts/seed-super-admin.js
 *
 * Custom credentials via env:
 *   ADMIN_EMAIL=you@adyapan.com ADMIN_PASSWORD=yourpassword node scripts/seed-super-admin.js
 *
 * After running, log in at: /superadmin/login
 * Then use the Superadmin Dashboard → Generate Invite to create admin invite links.
 */

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adyapan_users';

const SA_EMAIL    = process.env.ADMIN_EMAIL    || 'superadmin@adyapan.com';
const SA_PASSWORD = process.env.ADMIN_PASSWORD || 'Adyapan@SuperAdmin2025!';
const SA_NAME     = process.env.ADMIN_NAME     || 'Adyapan Super admin';

async function main() {
  console.log('🔗 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { dbName: 'adyapan' });
  console.log('✅ Connected to:', MONGODB_URI);

  /* Use a minimal schema — avoids conflicts with existing model registrations */
  const AuthUser = mongoose.models.AuthUser || mongoose.model('AuthUser', new mongoose.Schema({
    name:                { type: String },
    email:               { type: String, unique: true, lowercase: true },
    passwordHash:        { type: String },
    role:                { type: String },
    accountStatus:       { type: String, default: 'approved' },
    phone:               { type: String, default: '' },
    companyName:         { type: String, default: '' },
    authProvider:        { type: String, default: 'local' },
    purchasedCourses:    { type: [String], default: [] },
    enrolledCourses:     { type: [String], default: [] },
    wishlist:            { type: [String], default: [] },
    isActive:            { type: Boolean, default: true },
    isEmailVerified:     { type: Boolean, default: true },
    loginCount:          { type: Number, default: 0 },
    failedLoginAttempts: { type: Number, default: 0 },
    signupAt:            { type: Date, default: Date.now },
  }, { timestamps: true }));

  const existing = await AuthUser.findOne({ email: SA_EMAIL.toLowerCase() });

  if (existing) {
    if (existing.role === 'SUPERADMIN') {
      console.log(`\n⚠️  Superadmin already exists: ${SA_EMAIL}`);
      console.log('   To reset password, delete the account and re-run this script.');
    } else if (existing.role === 'ADMIN') {
      /* Upgrade existing ADMIN to SUPERADMIN */
      existing.role = 'SUPERADMIN';
      await existing.save();
      console.log(`\n✅ Upgraded existing ADMIN to SUPERADMIN: ${SA_EMAIL}`);
      console.log('   Password unchanged. Login at: /superadmin/login');
    } else {
      console.log(`\n❌ Email ${SA_EMAIL} exists with role: ${existing.role}`);
      console.log('   Use a different email or delete the existing account first.');
    }
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(SA_PASSWORD, 12);

  const superadmin = await AuthUser.create({
    name:            SA_NAME,
    email:           SA_EMAIL.toLowerCase(),
    passwordHash,
    role:            'SUPERADMIN',
    accountStatus:   'approved',
    isActive:        true,
    isEmailVerified: true,
    signupAt:        new Date(),
  });

  console.log('\n✅ Superadmin created successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Name:     ${superadmin.name}`);
  console.log(`   Email:    ${superadmin.email}`);
  console.log(`   Password: ${SA_PASSWORD}`);
  console.log(`   Role:     ${superadmin.role}`);
  console.log(`   ID:       ${superadmin._id}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🔐 Login at:   /superadmin/login');
  console.log('📋 Dashboard:  /superadmin/dashboard');
  console.log('🔑 Generate invites from the dashboard to create admin accounts\n');

  await mongoose.disconnect();
  console.log('🔌 Disconnected');
}

main().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
