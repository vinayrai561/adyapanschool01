/**
 * Adyapan — Organization Users Seed Script
 *
 * Seeds pre-approved organization accounts into the separate
 * "organizationusers" MongoDB collection.
 *
 * Usage:
 *   npm run seed:organization-users
 *
 * Safe to run multiple times — updates existing records, never duplicates.
 */

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adyapan_users';
const SALT_ROUNDS = 12;

/* ── Pre-approved organization accounts ── */
// Passwords are loaded from environment variables — never hardcode credentials here.
// Set these in backend/.env before running this script:
//   ORG_USER_1_EMAIL, ORG_USER_1_PASS, ORG_USER_1_NAME
//   ORG_USER_2_EMAIL, ORG_USER_2_PASS, ORG_USER_2_NAME
//   ORG_USER_3_EMAIL, ORG_USER_3_PASS, ORG_USER_3_NAME
const ORG_USERS = [
  { name: process.env.ORG_USER_1_NAME || 'Org User 1', email: process.env.ORG_USER_1_EMAIL || '', password: process.env.ORG_USER_1_PASS || '' },
  { name: process.env.ORG_USER_2_NAME || 'Org User 2', email: process.env.ORG_USER_2_EMAIL || '', password: process.env.ORG_USER_2_PASS || '' },
  { name: process.env.ORG_USER_3_NAME || 'Org User 3', email: process.env.ORG_USER_3_EMAIL || '', password: process.env.ORG_USER_3_PASS || '' },
].filter(u => u.email && u.password); // skip entries with missing env vars

const orgUserSchema = new mongoose.Schema(
  {
    name:                { type: String, required: true, trim: true },
    email:               { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash:        { type: String, required: true },
    role:                { type: String, default: 'organization' },
    isApproved:          { type: Boolean, default: true },
    accountStatus:       { type: String, default: 'active' },
    loginCount:          { type: Number, default: 0 },
    failedLoginAttempts: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'organizationusers' }
);

async function main() {
  console.log('\n🔗 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { dbName: 'adyapan' });
  console.log('✅ Connected:', MONGODB_URI);

  const OrgUser = mongoose.models.OrganizationUser
    || mongoose.model('OrganizationUser', orgUserSchema);

  console.log('\n📋 Seeding organization users...\n');

  for (const u of ORG_USERS) {
    const passwordHash = await bcrypt.hash(u.password, SALT_ROUNDS);
    const existing     = await OrgUser.findOne({ email: u.email.toLowerCase() });

    if (existing) {
      // Safely update — reset password hash, ensure approved/active, clear lockout
      existing.name                = u.name;
      existing.passwordHash        = passwordHash;
      existing.role                = 'organization';
      existing.isApproved          = true;
      existing.accountStatus       = 'active';
      existing.failedLoginAttempts = 0;
      existing.lockedUntil         = undefined;
      await existing.save();
      console.log(`   ✏️  Updated:  ${u.email}`);
    } else {
      await OrgUser.create({
        name:          u.name,
        email:         u.email.toLowerCase(),
        passwordHash,
        role:          'organization',
        isApproved:    true,
        accountStatus: 'active',
      });
      console.log(`   ✅ Created:  ${u.email}`);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   Collection: organizationusers');
  console.log(`   Total seeded: ${ORG_USERS.length} accounts`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🔐 Login at: /organization/login\n');

  await mongoose.disconnect();
  console.log('🔌 Disconnected');
}

main().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
