/**
 * backend/scripts/createSuperAdmin.js
 *
 * Creates the first SUPERADMIN account directly in MongoDB.
 * Run from the backend/ folder:
 *
 *   node scripts/createSuperAdmin.js
 *
 * Or with custom values:
 *   SA_EMAIL=you@adyapan.com SA_PASSWORD=yourpassword node scripts/createSuperAdmin.js
 */

require('dotenv').config({ path: '../.env' });
require('dotenv').config({ path: '.env' });

const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const SA_EMAIL    = process.env.SA_EMAIL    || process.env.ADMIN_EMAIL;
const SA_PASSWORD = process.env.SA_PASSWORD || process.env.ADMIN_PASSWORD;
const SA_NAME     = process.env.SA_NAME     || process.env.ADMIN_NAME     || 'Adyapan Superadmin';

const userSchema = new mongoose.Schema({
  name:                String,
  email:               { type: String, unique: true, lowercase: true },
  passwordHash:        String,
  role:                String,
  accountStatus:       { type: String, default: 'approved' },
  phone:               { type: String, default: '' },
  isActive:            { type: Boolean, default: true },
  isEmailVerified:     { type: Boolean, default: true },
  loginCount:          { type: Number, default: 0 },
  failedLoginAttempts: { type: Number, default: 0 },
  signupAt:            { type: Date, default: Date.now },
}, { timestamps: true });

async function main() {
  if (!MONGODB_URI || !SA_EMAIL || !SA_PASSWORD) {
    throw new Error('MONGODB_URI, SA_EMAIL/ADMIN_EMAIL, and SA_PASSWORD/ADMIN_PASSWORD are required.');
  }

  console.log('\n🔗 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { dbName: 'adyapan' });
  console.log('✅ Connected');

  const AuthUser = mongoose.models.AuthUser || mongoose.model('AuthUser', userSchema);

  const existing = await AuthUser.findOne({ email: SA_EMAIL.toLowerCase() });

  if (existing) {
    if (existing.role === 'SUPERADMIN') {
      console.log(`\n⚠️  Superadmin already exists: ${SA_EMAIL}`);
      console.log('   Delete the account and re-run to reset.');
    } else {
      /* Upgrade to SUPERADMIN */
      existing.role = 'SUPERADMIN';
      await existing.save();
      console.log(`\n✅ Upgraded ${existing.role} → SUPERADMIN: ${SA_EMAIL}`);
    }
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(SA_PASSWORD, 12);

  const sa = await AuthUser.create({
    name:            SA_NAME,
    email:           SA_EMAIL.toLowerCase(),
    passwordHash,
    role:            'SUPERADMIN',
    accountStatus:   'approved',
    isActive:        true,
    isEmailVerified: true,
    signupAt:        new Date(),
  });

  console.log('\n✅ Superadmin created!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Name:     ${sa.name}`);
  console.log(`   Email:    ${sa.email}`);
  console.log('   Password: [configured from environment]');
  console.log(`   Role:     ${sa.role}`);
  console.log(`   ID:       ${sa._id}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🔐 Login at:  /superadmin/login');
  console.log('📋 Dashboard: /superadmin/dashboard\n');

  await mongoose.disconnect();
  console.log('🔌 Disconnected');
}

main().catch(err => {
  console.error('❌ Failed:', err.message);
  process.exit(1);
});
