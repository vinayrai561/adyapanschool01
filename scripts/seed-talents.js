/**
 * Seed talent profiles into MongoDB Atlas
 * Run: node scripts/seed-talents.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const schema = new mongoose.Schema({
  name: String, company: String, role: String,
  status: { type: String, default: 'available' },
  placed: Boolean, availability: String, packageExpectation: String,
  skills: [String], education: String, course: String,
  experienceLevel: String, projectsCount: Number, certificatesCount: Number,
  rating: Number, portfolio: String, github: String, linkedin: String,
  email: { type: String, lowercase: true }, phone: String, location: String,
  resumeUrl: String, profileSummary: String, objective: String,
  experience: mongoose.Schema.Types.Mixed,
  projects: mongoose.Schema.Types.Mixed,
  certifications: [String],
}, { timestamps: true, collection: 'studenttalents' });

const talents = [
  {
    name: 'Rupesh Kumar Rupak', company: 'Adyapanschool', role: 'Full Stack Developer',
    status: 'placed', placed: true, availability: 'Not Available', packageExpectation: 'Not disclosed',
    skills: ['HTML','CSS','JavaScript','React.js','Node.js','Express.js','MongoDB','Firebase','Docker','Jenkins','CI/CD','Git','GitHub','AWS','MySQL'],
    education: 'B.Tech CSE, Vivekananda Global University, 2022-2026, CGPA 8.00/10.00',
    course: 'Full Stack Development', experienceLevel: 'Fresher',
    projectsCount: 8, certificatesCount: 2, rating: 4.8,
    portfolio: 'https://grand-platypus-6af7d5.netlify.app/',
    github: 'https://github.com/Rupeshrupak222',
    linkedin: 'https://www.linkedin.com/in/rupesh-kumar-rupak-bb4b44265/',
    email: 'rupeshrupak609@gmail.com', phone: '8292244709',
    location: 'Jaipur, Rajasthan, India', resumeUrl: '/resume/RupeshAD.pdf',
    objective: 'B.Tech CSE final-year student specializing in Web Development and DevOps with hands-on experience in React, JavaScript, CI/CD, Docker, and cloud deployment.',
    profileSummary: 'Placed Full Stack Developer at Adyapanschool with skills in React, Node.js, MongoDB, Docker, Jenkins, CI/CD, and cloud deployment.',
    experience: [
      { company: 'LinuxWorld Pvt Ltd', role: 'Tech Intern', duration: 'Jun 2025 - Aug 2025', location: 'Jaipur, Rajasthan',
        points: ['Built and managed CI/CD pipelines using Jenkins and Docker.','Assisted in deploying scalable web apps using Kubernetes.','Contributed to frontend and backend modules.','Built responsive UI components and enhanced user experience.'] },
      { company: 'Adayapanschool.com', role: 'Community Development Intern', duration: 'March 2026 - Present', location: 'Hyderabad, Telangana',
        points: ['Team lead.','Combined community building with data analysis to drive user acquisition.','Monitored KPIs like engagement rate, conversion rate, and lead performance.','Assisted in designing and optimizing sales funnels.','Delivered insights to improve marketing effectiveness and student onboarding.'] }
    ],
    projects: [
      { name: 'ShareGO', type: 'Full Stack Web Application', tools: ['React','Firebase','Netlify'], description: 'Developed a full-stack ride-sharing web application enabling users to connect with fellow travelers, share rides, reduce travel costs, and promote eco-friendly commuting.' },
      { name: 'Portfolio Website', type: 'Personal Project', tools: ['HTML','CSS','JavaScript','Bootstrap'], description: 'Designed and developed a responsive personal portfolio website showcasing projects, technical skills, education, and achievements.' }
    ],
    certifications: ['NPTEL: Management Information System','LinuxWorld Pvt Ltd: JAZBAA 4.0 Webinar'],
  },
  {
    name: 'Vinay Kumar', company: 'Adyapan School', role: 'Full Stack Developer',
    status: 'placed', placed: true, availability: 'Not Available', packageExpectation: 'Not disclosed',
    skills: ['Python','Java','C++','R','SQL','JavaScript','Node.js','Express.js','REST API','PostgreSQL','MySQL','Supabase','ETL','Power BI','DAX','Power Query','Tableau','Excel','Git','GitHub','Postman','Docker','AWS','OOP','DSA'],
    education: 'B.Tech CSE, Lovely Professional University, Since Aug 2022, CGPA 7.00/10',
    course: 'Full Stack Development', experienceLevel: 'Fresher',
    projectsCount: 3, certificatesCount: 3, rating: 4.5,
    portfolio: '',
    github: 'https://github.com/vinayrai561',
    linkedin: 'https://linkedin.com/in/vinayrai561',
    email: 'vinayrailkw@gmail.com', phone: '+91-8558877045',
    location: 'Punjab, India', resumeUrl: '',
    objective: 'Full-stack data analytics developer experienced in building REST APIs, dashboards, ETL workflows, and scalable data-driven applications. Strong foundation in DSA, SQL, backend development, and BI.',
    profileSummary: 'Placed Full Stack Developer at Adyapan School. Skilled in Node.js, Express.js, PostgreSQL, Supabase, Power BI, and data analytics. Built REST APIs, ETL pipelines, and BI dashboards.',
    experience: [
      {
        company: 'CipherSchools & LPU', role: 'DSA Intern', duration: 'Aug 2022 – Dec 2022', location: 'Punjab, India',
        points: [
          'Completed advanced DSA curriculum; mastered trees, graphs, and dynamic programming.',
          'Built Java Library Management System using OOP and DSA principles.',
        ]
      }
    ],
    projects: [
      {
        name: 'Web3 Customer Query Management System', type: 'Full Stack Web Application',
        tools: ['Node.js','Express.js','Supabase','PostgreSQL','Web3.js'],
        description: 'Built REST APIs for customer query tracking and agent workflow automation. Added immutable transaction IDs using Supabase + Web3 concepts. Optimized PostgreSQL schema for fast query performance.'
      },
      {
        name: 'Employee Analytics Dashboard', type: 'BI / Data Analytics',
        tools: ['Power BI','DAX','Power Query','Excel'],
        description: 'Designed dashboards showing KPIs (revenue, profit, YoY growth). Performed ETL with Power Query and automated data refresh.'
      },
      {
        name: 'Responsive Coding Practice Platform', type: 'Frontend Web Application',
        tools: ['HTML','CSS','JavaScript'],
        description: 'Built a responsive coding practice platform with real-time code execution.'
      }
    ],
    certifications: [
      'Data Structures using C & C++ — Udemy (Nov 2024 – Jan 2025)',
      'R Programming for Data Science — Udemy (Sep 2024 – Nov 2024)',
      'Data Structures and Algorithms — CipherSchools (Oct 2022 – Dec 2022)',
    ],
  },
  {
    name: 'Rukhsana Azami', company: '', role: 'Nursing Intern',
    status: 'available', placed: false, availability: 'Immediate', packageExpectation: 'Internship',
    skills: ['Patient Care','Clinical Support','Communication','Emergency Assistance','Healthcare Basics'],
    education: 'B.Sc. Nursing', course: 'B.Sc. Nursing', experienceLevel: 'Internship',
    projectsCount: 2, certificatesCount: 1, rating: 4.5,
    portfolio: '', github: '', linkedin: '', email: '', phone: '',
    location: 'India', resumeUrl: '',
    objective: 'B.Sc. Nursing student looking for internship opportunities in hospitals and healthcare organizations. Available immediately and eager to gain clinical experience.',
    profileSummary: 'Dedicated B.Sc. Nursing student looking for internship opportunities. Available immediately and eager to gain clinical experience.',
    experience: [], projects: [], certifications: [],
  }
];

async function seed() {
  await mongoose.connect(MONGO_URI, { dbName: 'adyapan', serverSelectionTimeoutMS: 15000 });
  console.log('Connected to Atlas:', mongoose.connection.host);

  const Model = mongoose.models.StudentTalent || mongoose.model('StudentTalent', schema);

  let inserted = 0, skipped = 0;
  for (const t of talents) {
    const orConds = [];
    if (t.email) orConds.push({ email: t.email });
    if (t.phone) orConds.push({ phone: t.phone });
    const exists = orConds.length ? await Model.findOne({ $or: orConds }) : null;
    if (exists) { console.log('Skipped (exists):', t.name); skipped++; continue; }
    await Model.create(t);
    console.log('Inserted:', t.name);
    inserted++;
  }
  console.log('\nDone. Inserted:', inserted, '| Skipped:', skipped);
  await mongoose.disconnect();
}

seed().catch(e => { console.error('Seed failed:', e.message); process.exit(1); });
