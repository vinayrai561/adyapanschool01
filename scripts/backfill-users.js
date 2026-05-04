/**
 * Backfills purchasedCourses for existing users based on their enrollments.
 * Run once: node scripts/backfill-users.js
 */
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/adyapan_users');
  const db = mongoose.connection.db;

  console.log('\n🔄 Backfilling purchasedCourses from enrollments...');
  const enrollments = await db.collection('enrollments').find({}).toArray();

  for (const e of enrollments) {
    await db.collection('authusers').updateOne(
      { _id: new mongoose.Types.ObjectId(e.userId) },
      { $addToSet: { purchasedCourses: e.courseName } }
    );
  }
  console.log(`  ✅ Processed ${enrollments.length} enrollments`);

  console.log('\n📊 Final user state:');
  const users = await db.collection('authusers')
    .find({}, { projection: { passwordHash: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  users.forEach(u => {
    console.log(`\n  👤 ${u.name} <${u.email}>`);
    console.log(`     Role:             ${u.role}`);
    console.log(`     Phone:            ${u.phone || '(not set)'}`);
    console.log(`     Login count:      ${u.loginCount || 0}`);
    console.log(`     Last login:       ${u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('en-IN') : '(never)'}`);
    console.log(`     Purchased courses:${u.purchasedCourses?.length ? ' ' + u.purchasedCourses.join(', ') : ' (none)'}`);
    console.log(`     Signup IP:        ${u.signupIp || '(not recorded)'}`);
    console.log(`     Joined:           ${new Date(u.createdAt).toLocaleString('en-IN')}`);
  });

  await mongoose.disconnect();
  console.log('\n✅ Done!\n');
}

run().catch(console.error);
