/**
 * scripts/seedJobs.js
 *
 * Seed script — populates MongoDB with sample companies and active job postings
 * for testing the /jobs page.
 *
 * Usage:
 *   npm run seed:jobs
 *
 * Safe to run multiple times — uses upsert (jobTitle + companyId) to prevent duplicates.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');

/* ── MongoDB connection ─────────────────────────────────────── */
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adyapan';

/* ── Inline schemas (mirrors src/models/*.ts) ───────────────── */
const companyProfileSchema = new mongoose.Schema(
  {
    organizationUserId: { type: String, required: true, unique: true },
    companyName:        { type: String, required: true },
    companyEmail:       { type: String, required: true, lowercase: true },
    mobileNumber:       { type: String, default: '' },
    website:            { type: String, default: '' },
    logoUrl:            { type: String, default: '' },
    industry:           { type: String, default: '' },
    companySize:        { type: String, default: '' },
    gstOrCin:           { type: String, default: '' },
    address:            { type: String, default: '' },
    city:               { type: String, default: '' },
    state:              { type: String, default: '' },
    country:            { type: String, default: 'India' },
    verificationStatus: { type: String, enum: ['pending','verified','rejected'], default: 'pending' },
    verifiedBy:         { type: String, default: 'seed-script' },
    verifiedAt:         { type: Date, default: null },
    rejectionReason:    { type: String, default: '' },
  },
  { timestamps: true, collection: 'companyprofiles' }
);

const jobPostSchema = new mongoose.Schema(
  {
    companyId:            { type: String, required: true },
    organizationUserId:   { type: String, required: true },
    companyName:          { type: String, required: true },
    companyEmail:         { type: String, required: true, lowercase: true },
    companyLogoUrl:       { type: String, default: '' },
    companyWebsite:       { type: String, default: '' },
    companyIndustry:      { type: String, default: '' },
    companyCity:          { type: String, default: '' },
    companyVerified:      { type: Boolean, default: false },
    jobTitle:             { type: String, required: true },
    category:             { type: String, required: true },
    description:          { type: String, required: true },
    responsibilities:     { type: [String], default: [] },
    requiredSkills:       { type: [String], default: [] },
    educationRequirement: { type: String, default: '' },
    experienceLevel:      { type: String, default: 'Fresher' },
    openings:             { type: Number, default: 1 },
    employmentType:       { type: String, default: 'internship' },
    workMode:             { type: String, default: 'onsite' },
    location:             { type: String, default: '' },
    salaryOrStipend:      { type: String, default: '' },
    deadline:             { type: Date, required: true },
    status:               { type: String, default: 'active' },
    applicantsCount:      { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'jobposts' }
);

/* ── Sample company data ────────────────────────────────────── */
const COMPANIES = [
  {
    _seedId: 'adyapan-edutech',
    companyName:  'Adyapan Edutech Pvt. Ltd.',
    companyEmail: 'careers@adyapan.com',
    mobileNumber: '+91 9876543210',
    website:      'https://adyapan.com',
    logoUrl:      '',
    industry:     'Education Technology',
    companySize:  '11–50',
    city:         'Jaipur',
    state:        'Rajasthan',
  },
  {
    _seedId: 'technova-solutions',
    companyName:  'TechNova Solutions',
    companyEmail: 'hr@technovasolutions.in',
    mobileNumber: '+91 9123456789',
    website:      'https://technovasolutions.in',
    logoUrl:      '',
    industry:     'Technology',
    companySize:  '51–200',
    city:         'Bengaluru',
    state:        'Karnataka',
  },
  {
    _seedId: 'skillbridge-careers',
    companyName:  'SkillBridge Careers',
    companyEmail: 'jobs@skillbridge.co.in',
    mobileNumber: '+91 9988776655',
    website:      'https://skillbridge.co.in',
    logoUrl:      '',
    industry:     'HR & Recruitment',
    companySize:  '11–50',
    city:         'Delhi',
    state:        'Delhi',
  },
  {
    _seedId: 'nextgen-softwares',
    companyName:  'NextGen Softwares',
    companyEmail: 'talent@nextgensoftwares.com',
    mobileNumber: '+91 9001122334',
    website:      'https://nextgensoftwares.com',
    logoUrl:      '',
    industry:     'Software Development',
    companySize:  '51–200',
    city:         'Hyderabad',
    state:        'Telangana',
  },
  {
    _seedId: 'brightfuture-labs',
    companyName:  'BrightFuture Labs',
    companyEmail: 'hello@brightfuturelabs.io',
    mobileNumber: '+91 8877665544',
    website:      'https://brightfuturelabs.io',
    logoUrl:      '',
    industry:     'Product & SaaS',
    companySize:  '1–10',
    city:         'Remote',
    state:        'Remote',
  },
];

/* ── Deadline helpers ───────────────────────────────────────── */
const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

/* ── Build job list after companies are seeded ──────────────── */
function buildJobs(companyMap) {
  const adyapan    = companyMap['adyapan-edutech'];
  const technova   = companyMap['technova-solutions'];
  const skillbridge= companyMap['skillbridge-careers'];
  const nextgen    = companyMap['nextgen-softwares'];
  const bright     = companyMap['brightfuture-labs'];

  return [
    /* 1 ─ Frontend Developer Intern */
    {
      companyId:            adyapan._id.toString(),
      organizationUserId:   adyapan._id.toString(),
      companyName:          adyapan.companyName,
      companyEmail:         adyapan.companyEmail,
      companyLogoUrl:       adyapan.logoUrl,
      companyWebsite:       adyapan.website,
      companyIndustry:      adyapan.industry,
      companyCity:          adyapan.city,
      companyVerified:      true,
      jobTitle:             'Frontend Developer Intern',
      category:             'Technology',
      description:          'Join Adyapan as a Frontend Developer Intern and work on real-world EdTech products. You will build responsive UIs, collaborate with designers, and ship features used by thousands of students.',
      responsibilities:     [
        'Build and maintain responsive web pages using React.js',
        'Collaborate with UI/UX designers to implement pixel-perfect designs',
        'Write clean, reusable, and well-documented code',
        'Participate in code reviews and daily standups',
        'Fix bugs and improve application performance',
      ],
      requiredSkills:       ['React.js', 'HTML', 'CSS', 'JavaScript', 'Tailwind CSS'],
      educationRequirement: 'B.Tech / BCA / B.Sc (CS) — Pursuing or Completed',
      experienceLevel:      'Fresher',
      openings:             3,
      employmentType:       'internship',
      workMode:             'hybrid',
      location:             'Jaipur, Rajasthan',
      salaryOrStipend:      '₹8,000/month',
      deadline:             daysFromNow(30),
      status:               'active',
      applicantsCount:      12,
    },

    /* 2 ─ Full Stack Developer */
    {
      companyId:            technova._id.toString(),
      organizationUserId:   technova._id.toString(),
      companyName:          technova.companyName,
      companyEmail:         technova.companyEmail,
      companyLogoUrl:       technova.logoUrl,
      companyWebsite:       technova.website,
      companyIndustry:      technova.industry,
      companyCity:          technova.city,
      companyVerified:      true,
      jobTitle:             'Full Stack Developer',
      category:             'Technology',
      description:          'TechNova Solutions is hiring a Full Stack Developer to build scalable web applications. You will work across the entire stack — from designing REST APIs to crafting beautiful frontends.',
      responsibilities:     [
        'Design and develop RESTful APIs using Node.js and Express',
        'Build dynamic frontends with React.js',
        'Manage MongoDB databases and write efficient queries',
        'Deploy applications on AWS / Vercel',
        'Collaborate with product managers and designers',
      ],
      requiredSkills:       ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'REST API', 'Git'],
      educationRequirement: 'B.Tech / MCA / B.Sc (CS)',
      experienceLevel:      '1–2 years',
      openings:             2,
      employmentType:       'full-time',
      workMode:             'hybrid',
      location:             'Bengaluru, Karnataka',
      salaryOrStipend:      '₹5–7 LPA',
      deadline:             daysFromNow(45),
      status:               'active',
      applicantsCount:      28,
    },

    /* 3 ─ React.js Developer */
    {
      companyId:            nextgen._id.toString(),
      organizationUserId:   nextgen._id.toString(),
      companyName:          nextgen.companyName,
      companyEmail:         nextgen.companyEmail,
      companyLogoUrl:       nextgen.logoUrl,
      companyWebsite:       nextgen.website,
      companyIndustry:      nextgen.industry,
      companyCity:          nextgen.city,
      companyVerified:      true,
      jobTitle:             'React.js Developer',
      category:             'Technology',
      description:          'NextGen Softwares is looking for a React.js Developer to join our growing product team. You will build high-performance SPAs and contribute to our component library.',
      responsibilities:     [
        'Develop reusable React components and hooks',
        'Integrate REST APIs and manage state with Redux / Zustand',
        'Optimize application performance and bundle size',
        'Write unit tests using Jest and React Testing Library',
        'Mentor junior developers',
      ],
      requiredSkills:       ['React.js', 'TypeScript', 'Redux', 'REST API', 'Jest', 'Webpack'],
      educationRequirement: 'B.Tech / B.Sc (CS) or equivalent',
      experienceLevel:      '1–2 years',
      openings:             1,
      employmentType:       'full-time',
      workMode:             'remote',
      location:             'Remote (India)',
      salaryOrStipend:      '₹6–8 LPA',
      deadline:             daysFromNow(40),
      status:               'active',
      applicantsCount:      35,
    },

    /* 4 ─ UI/UX Design Intern */
    {
      companyId:            bright._id.toString(),
      organizationUserId:   bright._id.toString(),
      companyName:          bright.companyName,
      companyEmail:         bright.companyEmail,
      companyLogoUrl:       bright.logoUrl,
      companyWebsite:       bright.website,
      companyIndustry:      bright.industry,
      companyCity:          bright.city,
      companyVerified:      true,
      jobTitle:             'UI/UX Design Intern',
      category:             'Design',
      description:          'BrightFuture Labs is looking for a creative UI/UX Design Intern to help design intuitive and beautiful product experiences. You will work closely with the product and engineering teams.',
      responsibilities:     [
        'Create wireframes, mockups, and prototypes in Figma',
        'Conduct user research and usability testing',
        'Design responsive UI components and design systems',
        'Collaborate with developers to ensure pixel-perfect implementation',
        'Iterate on designs based on user feedback',
      ],
      requiredSkills:       ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Adobe XD'],
      educationRequirement: 'B.Des / B.Tech / Any Graduate with design portfolio',
      experienceLevel:      'Fresher',
      openings:             2,
      employmentType:       'internship',
      workMode:             'remote',
      location:             'Remote',
      salaryOrStipend:      '₹10,000/month',
      deadline:             daysFromNow(25),
      status:               'active',
      applicantsCount:      19,
    },

    /* 5 ─ Digital Marketing Executive */
    {
      companyId:            adyapan._id.toString(),
      organizationUserId:   adyapan._id.toString(),
      companyName:          adyapan.companyName,
      companyEmail:         adyapan.companyEmail,
      companyLogoUrl:       adyapan.logoUrl,
      companyWebsite:       adyapan.website,
      companyIndustry:      adyapan.industry,
      companyCity:          adyapan.city,
      companyVerified:      true,
      jobTitle:             'Digital Marketing Executive',
      category:             'Marketing',
      description:          'Adyapan is hiring a Digital Marketing Executive to drive student acquisition and brand awareness. You will manage social media, run paid campaigns, and create engaging content.',
      responsibilities:     [
        'Plan and execute digital marketing campaigns (Google Ads, Meta Ads)',
        'Manage social media accounts (Instagram, LinkedIn, YouTube)',
        'Create and publish engaging content for students',
        'Track and report campaign performance using Google Analytics',
        'Collaborate with the design team for creatives',
      ],
      requiredSkills:       ['Google Ads', 'Meta Ads', 'SEO', 'Content Marketing', 'Analytics', 'Canva'],
      educationRequirement: 'BBA / B.Com / Any Graduate',
      experienceLevel:      '0–1 years',
      openings:             1,
      employmentType:       'full-time',
      workMode:             'onsite',
      location:             'Jaipur, Rajasthan',
      salaryOrStipend:      '₹3–4 LPA',
      deadline:             daysFromNow(35),
      status:               'active',
      applicantsCount:      22,
    },

    /* 6 ─ Data Analyst Intern */
    {
      companyId:            technova._id.toString(),
      organizationUserId:   technova._id.toString(),
      companyName:          technova.companyName,
      companyEmail:         technova.companyEmail,
      companyLogoUrl:       technova.logoUrl,
      companyWebsite:       technova.website,
      companyIndustry:      technova.industry,
      companyCity:          technova.city,
      companyVerified:      true,
      jobTitle:             'Data Analyst Intern',
      category:             'Data Science',
      description:          'TechNova Solutions is looking for a Data Analyst Intern to help extract insights from large datasets. You will work with the product team to drive data-informed decisions.',
      responsibilities:     [
        'Collect, clean, and analyze large datasets using Python and SQL',
        'Build dashboards and reports using Power BI / Tableau',
        'Identify trends and patterns to support business decisions',
        'Present findings to stakeholders in a clear manner',
        'Assist in A/B testing and experiment analysis',
      ],
      requiredSkills:       ['Python', 'SQL', 'Excel', 'Power BI', 'Data Visualization', 'Pandas'],
      educationRequirement: 'B.Tech / B.Sc (Statistics / CS / Math)',
      experienceLevel:      'Fresher',
      openings:             2,
      employmentType:       'internship',
      workMode:             'hybrid',
      location:             'Bengaluru, Karnataka',
      salaryOrStipend:      '₹12,000/month',
      deadline:             daysFromNow(28),
      status:               'active',
      applicantsCount:      41,
    },

    /* 7 ─ Backend Node.js Developer */
    {
      companyId:            nextgen._id.toString(),
      organizationUserId:   nextgen._id.toString(),
      companyName:          nextgen.companyName,
      companyEmail:         nextgen.companyEmail,
      companyLogoUrl:       nextgen.logoUrl,
      companyWebsite:       nextgen.website,
      companyIndustry:      nextgen.industry,
      companyCity:          nextgen.city,
      companyVerified:      true,
      jobTitle:             'Backend Node.js Developer',
      category:             'Technology',
      description:          'NextGen Softwares is hiring a Backend Node.js Developer to build robust and scalable server-side applications. You will design APIs, manage databases, and ensure high availability.',
      responsibilities:     [
        'Design and build RESTful and GraphQL APIs using Node.js',
        'Work with MongoDB and PostgreSQL databases',
        'Implement authentication and authorization (JWT, OAuth)',
        'Write unit and integration tests',
        'Optimize API performance and handle scaling challenges',
      ],
      requiredSkills:       ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'JWT', 'Docker'],
      educationRequirement: 'B.Tech / MCA or equivalent',
      experienceLevel:      '1–2 years',
      openings:             2,
      employmentType:       'full-time',
      workMode:             'remote',
      location:             'Remote (India)',
      salaryOrStipend:      '₹5–8 LPA',
      deadline:             daysFromNow(50),
      status:               'active',
      applicantsCount:      17,
    },

    /* 8 ─ Business Development Associate */
    {
      companyId:            skillbridge._id.toString(),
      organizationUserId:   skillbridge._id.toString(),
      companyName:          skillbridge.companyName,
      companyEmail:         skillbridge.companyEmail,
      companyLogoUrl:       skillbridge.logoUrl,
      companyWebsite:       skillbridge.website,
      companyIndustry:      skillbridge.industry,
      companyCity:          skillbridge.city,
      companyVerified:      true,
      jobTitle:             'Business Development Associate',
      category:             'Sales',
      description:          'SkillBridge Careers is looking for a Business Development Associate to drive B2B partnerships and grow our client base. You will identify leads, pitch our services, and close deals.',
      responsibilities:     [
        'Identify and reach out to potential B2B clients',
        'Conduct product demos and presentations',
        'Negotiate and close partnership deals',
        'Maintain CRM records and track pipeline',
        'Collaborate with the marketing team on campaigns',
      ],
      requiredSkills:       ['Sales', 'CRM', 'Communication', 'Lead Generation', 'Negotiation'],
      educationRequirement: 'BBA / MBA / Any Graduate',
      experienceLevel:      '0–1 years',
      openings:             3,
      employmentType:       'full-time',
      workMode:             'onsite',
      location:             'Delhi, NCR',
      salaryOrStipend:      '₹3.5–5 LPA + Incentives',
      deadline:             daysFromNow(20),
      status:               'active',
      applicantsCount:      9,
    },

    /* 9 ─ Graphic Designer */
    {
      companyId:            bright._id.toString(),
      organizationUserId:   bright._id.toString(),
      companyName:          bright.companyName,
      companyEmail:         bright.companyEmail,
      companyLogoUrl:       bright.logoUrl,
      companyWebsite:       bright.website,
      companyIndustry:      bright.industry,
      companyCity:          bright.city,
      companyVerified:      true,
      jobTitle:             'Graphic Designer',
      category:             'Design',
      description:          'BrightFuture Labs is hiring a Graphic Designer to create stunning visuals for our product, marketing, and social media. You will be the creative force behind our brand identity.',
      responsibilities:     [
        'Design social media creatives, banners, and infographics',
        'Create brand assets including logos, icons, and illustrations',
        'Design marketing collateral (brochures, presentations, email templates)',
        'Collaborate with the product team on UI assets',
        'Maintain brand consistency across all channels',
      ],
      requiredSkills:       ['Adobe Photoshop', 'Illustrator', 'Canva', 'Figma', 'Typography', 'Branding'],
      educationRequirement: 'B.Des / Fine Arts / Any Graduate with strong portfolio',
      experienceLevel:      '0–1 years',
      openings:             1,
      employmentType:       'part-time',
      workMode:             'remote',
      location:             'Remote',
      salaryOrStipend:      '₹15,000/month',
      deadline:             daysFromNow(22),
      status:               'active',
      applicantsCount:      14,
    },

    /* 10 ─ Python Developer Intern */
    {
      companyId:            skillbridge._id.toString(),
      organizationUserId:   skillbridge._id.toString(),
      companyName:          skillbridge.companyName,
      companyEmail:         skillbridge.companyEmail,
      companyLogoUrl:       skillbridge.logoUrl,
      companyWebsite:       skillbridge.website,
      companyIndustry:      skillbridge.industry,
      companyCity:          skillbridge.city,
      companyVerified:      true,
      jobTitle:             'Python Developer Intern',
      category:             'Technology',
      description:          'SkillBridge Careers is looking for a Python Developer Intern to work on automation, data pipelines, and backend services. Great opportunity to work on real production systems.',
      responsibilities:     [
        'Write Python scripts for automation and data processing',
        'Build and maintain REST APIs using FastAPI / Django',
        'Work with databases (PostgreSQL, MongoDB)',
        'Write unit tests and documentation',
        'Collaborate with the data and backend teams',
      ],
      requiredSkills:       ['Python', 'FastAPI', 'Django', 'SQL', 'Git', 'REST API'],
      educationRequirement: 'B.Tech / B.Sc (CS / IT) — Pursuing or Completed',
      experienceLevel:      'Fresher',
      openings:             2,
      employmentType:       'internship',
      workMode:             'hybrid',
      location:             'Delhi, NCR',
      salaryOrStipend:      '₹8,000–12,000/month',
      deadline:             daysFromNow(32),
      status:               'active',
      applicantsCount:      26,
    },
  ];
}

/* ── Main seed function ─────────────────────────────────────── */
async function seed() {
  console.log('\n🌱 Adyapan Jobs Seed Script');
  console.log('━'.repeat(50));
  console.log(`📡 Connecting to: ${MONGO_URI}\n`);

  await mongoose.connect(MONGO_URI, { dbName: 'adyapan' });
  console.log('✅ MongoDB connected\n');

  const CompanyProfile = mongoose.models.CompanyProfile
    || mongoose.model('CompanyProfile', companyProfileSchema);
  const JobPost = mongoose.models.JobPost
    || mongoose.model('JobPost', jobPostSchema);

  /* ── 1. Seed companies ── */
  console.log('🏢 Seeding companies…');
  const companyMap = {};

  for (const c of COMPANIES) {
    const { _seedId, ...data } = c;
    const orgId = `seed-${_seedId}`;

    const company = await CompanyProfile.findOneAndUpdate(
      { organizationUserId: orgId },
      {
        ...data,
        organizationUserId: orgId,
        verificationStatus: 'verified',
        verifiedBy:         'seed-script',
        verifiedAt:         new Date(),
        country:            'India',
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    companyMap[_seedId] = company;
    console.log(`   ✓ ${company.companyName} (${company.verificationStatus})`);
  }

  /* ── 2. Seed jobs ── */
  console.log('\n💼 Seeding jobs…');
  const jobs = buildJobs(companyMap);
  let created = 0;
  let updated = 0;

  for (const job of jobs) {
    const result = await JobPost.findOneAndUpdate(
      // Unique key: jobTitle + companyId
      { jobTitle: job.jobTitle, companyId: job.companyId },
      job,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    const isNew = result.createdAt.getTime() === result.updatedAt.getTime();
    if (isNew) {
      created++;
      console.log(`   ✨ Created: ${job.jobTitle} @ ${job.companyName}`);
    } else {
      updated++;
      console.log(`   ↻  Updated: ${job.jobTitle} @ ${job.companyName}`);
    }
  }

  /* ── 3. Summary ── */
  const totalJobs = await JobPost.countDocuments({ status: 'active' });
  console.log('\n' + '━'.repeat(50));
  console.log(`✅ Done!`);
  console.log(`   Companies seeded : ${COMPANIES.length}`);
  console.log(`   Jobs created     : ${created}`);
  console.log(`   Jobs updated     : ${updated}`);
  console.log(`   Total active jobs: ${totalJobs}`);
  console.log('\n🚀 Visit http://localhost:3000/jobs to see the results\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
