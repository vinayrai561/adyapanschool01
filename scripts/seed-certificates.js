/**
 * Seed script: inserts/updates the 4 default certificate templates in MongoDB.
 * Run with: npm run seed:certificates
 */
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adyapan';

const TEMPLATES = [
  {
    type:     'best_performance',
    title:    'Best Performance Certificate',
    imageUrl: '/certificates/templates/best-performance.png',
    isActive: true,
  },
  {
    type:     'course_completion',
    title:    'Course Completion Certificate',
    imageUrl: '/certificates/templates/course-completion.png',
    isActive: true,
  },
  {
    type:     'internship_completion',
    title:    'Internship Completion Certificate',
    imageUrl: '/certificates/templates/internship-completion.png',
    isActive: true,
  },
  {
    type:     'project_completion',
    title:    'Project Completion Certificate',
    imageUrl: '/certificates/templates/project-completion.png',
    isActive: true,
  },
];

async function seed() {
  console.log('\n🔗 Connecting to MongoDB…');
  await mongoose.connect(MONGO_URI, { dbName: 'adyapan' });
  const db = mongoose.connection.db;

  console.log('📜 Seeding certificate templates…\n');

  for (const tpl of TEMPLATES) {
    const result = await db.collection('certificatetemplates').updateOne(
      { type: tpl.type },
      {
        $set: { ...tpl, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    const action = result.upsertedCount > 0 ? '✅ Inserted' : '🔄 Updated';
    console.log(`  ${action}: ${tpl.title}`);
  }

  console.log('\n📊 Certificate Templates in DB:');
  const all = await db.collection('certificatetemplates').find({}).toArray();
  all.forEach(t => {
    console.log(`  [${t.type}] ${t.title} — ${t.imageUrl} (active: ${t.isActive})`);
  });

  await mongoose.disconnect();
  console.log('\n✅ Seed complete!\n');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
