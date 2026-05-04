const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/adyapan_users';

const courses = [
  {
    slug: 'plan-1',
    title: 'Adyapan Starter',
    subtitle: 'Build your foundation with core industry skills',
    totalLessons: 14,
    duration: '2 Months',
    category: 'Foundation',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=600&q=80',
  },
  {
    slug: 'plan-2',
    title: 'Adyapan Standard',
    subtitle: 'Hands-on projects with expert mentorship',
    totalLessons: 18,
    duration: '2 Months',
    category: 'Professional',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  },
  {
    slug: 'plan-3',
    title: 'Adyapan Professional',
    subtitle: 'Real projects, placement support & 1:1 mentorship',
    totalLessons: 22,
    duration: '3 Months',
    category: 'Advanced',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
  },
  {
    slug: 'plan-4-premium',
    title: 'Adyapan Career Pro',
    subtitle: 'Placement guarantee, 1:1 mentorship & industry projects',
    totalLessons: 27,
    duration: '4 Months',
    category: 'Career',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  console.log('\n📦 Seeding courses...');
  for (const c of courses) {
    await db.collection('courses').updateOne(
      { slug: c.slug },
      { $set: { ...c, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    console.log(`  ✅ ${c.slug} — ${c.title} (${c.totalLessons} lessons)`);
  }

  console.log('\n📊 Database Summary:');
  const collections = ['authusers', 'enrollments', 'progresses', 'courses'];
  for (const col of collections) {
    const count = await db.collection(col).countDocuments();
    console.log(`  ${col}: ${count} documents`);
  }

  console.log('\n👥 All Users:');
  const users = await db.collection('authusers')
    .find({}, { projection: { passwordHash: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
  users.forEach(u => {
    console.log(`  [${u.role}] ${u.name} <${u.email}> — joined ${new Date(u.createdAt).toLocaleDateString('en-IN')}`);
  });

  console.log('\n📚 All Enrollments:');
  const enrollments = await db.collection('enrollments')
    .find({})
    .sort({ enrolledAt: -1 })
    .toArray();
  enrollments.forEach(e => {
    console.log(`  userId:${e.userId.toString().slice(-6)} → ${e.courseName} (${e.planLabel}) ₹${e.amountPaid} | ${e.paymentId.slice(0, 20)}...`);
  });

  console.log('\n📈 All Progress Records:');
  const progresses = await db.collection('progresses').find({}).toArray();
  progresses.forEach(p => {
    console.log(`  userId:${p.userId.toString().slice(-6)} → ${p.courseSlug} | ${p.progressPercent}% (${p.completedLessons?.length ?? 0}/${p.totalLessons} lessons)`);
  });

  await mongoose.disconnect();
  console.log('\n✅ Done!\n');
}

seed().catch(console.error);
