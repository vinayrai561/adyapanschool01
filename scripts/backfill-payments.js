/**
 * Backfills the payments collection from existing enrollments.
 * Run once: node scripts/backfill-payments.js
 */
const mongoose = require('mongoose');

const GST_RATE = 0.18;

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/adyapan_users');
  const db = mongoose.connection.db;

  const enrollments = await db.collection('enrollments').find({}).toArray();
  const users       = await db.collection('authusers').find({}).toArray();
  const userMap     = Object.fromEntries(users.map(u => [u._id.toString(), u]));

  console.log(`\n💳 Backfilling ${enrollments.length} payments...\n`);

  let created = 0;
  for (const e of enrollments) {
    const existing = await db.collection('payments').findOne({ paymentId: e.paymentId });
    if (existing) { console.log(`  ⏭  Already exists: ${e.paymentId}`); continue; }

    const user  = userMap[e.userId] || {};
    const total = Number(e.amountPaid) || 0;
    const base  = parseFloat((total / (1 + GST_RATE)).toFixed(2));
    const gst   = parseFloat((total - base).toFixed(2));

    await db.collection('payments').insertOne({
      userId:        e.userId,
      userName:      user.name  || 'Unknown',
      userEmail:     user.email || '',
      userPhone:     user.phone || '',
      paymentId:     e.paymentId,
      orderId:       e.paymentId.replace('pay_', 'order_'),
      courseSlug:    e.courseSlug,
      courseName:    e.courseName,
      planLabel:     e.planLabel || '',
      baseAmount:    base,
      gstAmount:     gst,
      totalAmount:   total,
      currency:      'INR',
      status:        'success',
      paymentMethod: 'upi',
      isTestMode:    e.paymentId.includes('TEST'),
      paidAt:        e.enrolledAt || new Date(),
      createdAt:     e.createdAt  || new Date(),
      updatedAt:     new Date(),
    });
    console.log(`  ✅ ${e.paymentId} | ${user.name || 'Unknown'} | ₹${total} | ${e.courseName}`);
    created++;
  }

  console.log(`\n✅ Created ${created} payment records\n`);

  // Show all payments
  console.log('📊 All Payments in DB:');
  const payments = await db.collection('payments').find({}).sort({ paidAt: -1 }).toArray();
  payments.forEach(p => {
    console.log(`\n  💳 Payment ID:   ${p.paymentId}`);
    console.log(`     Order ID:     ${p.orderId}`);
    console.log(`     Name:         ${p.userName}`);
    console.log(`     Email:        ${p.userEmail}`);
    console.log(`     Phone:        ${p.userPhone || '(not set)'}`);
    console.log(`     Course:       ${p.courseName} (${p.planLabel})`);
    console.log(`     Base Amount:  ₹${p.baseAmount}`);
    console.log(`     GST (18%):    ₹${p.gstAmount}`);
    console.log(`     Total Paid:   ₹${p.totalAmount}`);
    console.log(`     Method:       ${p.paymentMethod}`);
    console.log(`     Test Mode:    ${p.isTestMode}`);
    console.log(`     Status:       ${p.status}`);
    console.log(`     Paid At:      ${new Date(p.paidAt).toLocaleString('en-IN')}`);
  });

  await mongoose.disconnect();
  console.log('\n✅ Done!\n');
}

run().catch(console.error);
