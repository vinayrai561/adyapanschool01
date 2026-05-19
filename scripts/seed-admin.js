/**
 * Adyapan — Admin Seed Script
 *
 * Creates or updates the single pre-approved admin account.
 * Run with:  npm run seed:admin
 *
 * This is the ONLY way to create an admin account.
 * No public signup. No invite codes. Just this script.
 */

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const MONGODB_URI  = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adyapan_users';
// Admin credentials must be set via environment variables — never hardcode them.
// Set ADMIN_EMAIL, ADMIN_PASS, and ADMIN_NAME in your .env before running this script.
const ADMIN_EMAIL  = process.env.ADMIN_EMAIL;
const ADMIN_PASS   = process.env.ADMIN_PASS;
const ADMIN_NAME   = process.env.ADMIN_NAME || 'Admin';

if (!ADMIN_EMAIL || !ADMIN_PASS) {
  console.error('❌ ADMIN_EMAIL and ADMIN_PASS must be set in environment variables.');
  console.error('   Add them to backend/.env and re-run.');
  process.exit(1);
}

async function main() {
  console.log('\n🔗 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { dbName: 'adyapan' });
  console.log('✅ Connected:', MONGODB_URI);

  const AuthUser = mongoose.models.AuthUser || mongoose.model('AuthUser', new mongoose.Schema({
    name:                { type: String },
    email:               { type: String, unique: true, lowercase: true },
    passwordHash:        { type: String },
    role:                { type: String },
    accountStatus:       { type: String, default: 'approved' },
    isActive:            { type: Boolean, default: true },
    isEmailVerified:     { type: Boolean, default: true },
    loginCount:          { type: Number, default: 0 },
    failedLoginAttempts: { type: Number, default: 0 },
    signupAt:            { type: Date, default: Date.now },
  }, { timestamps: true }));

  const passwordHash = await bcrypt.hash(ADMIN_PASS, 12);
  const existing     = await AuthUser.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    // Update role + password safely
    existing.role          = 'ADMIN';
    existing.passwordHash  = passwordHash;
    existing.accountStatus = 'approved';
    existing.isActive      = true;
    // Reset any lockout
    existing.failedLoginAttempts = 0;
    existing.lockedUntil         = undefined;
    await existing.save();

    console.log('\n✅ Admin account updated!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASS}  (now hashed in DB)`);
    console.log(`   Role:     ADMIN`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } else {
    const admin = await AuthUser.create({
      name:            ADMIN_NAME,
      email:           ADMIN_EMAIL,
      passwordHash,
      role:            'ADMIN',
      accountStatus:   'approved',
      isActive:        true,
      isEmailVerified: true,
      signupAt:        new Date(),
    });

    console.log('\n✅ Admin account created!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Name:     ${admin.name}`);
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: ${ADMIN_PASS}  (hashed in DB)`);
    console.log(`   Role:     ${admin.role}`);
    console.log(`   ID:       ${admin._id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  console.log('\n🔐 Login at: /admin/login\n');
  await mongoose.disconnect();
  console.log('🔌 Disconnected');
}

main().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
