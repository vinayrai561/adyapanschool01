/**
 * POST /api/talents/seed
 *
 * Seeds default talent profiles into MongoDB Atlas.
 * Prevents duplicates by email or phone.
 * Safe to call multiple times — idempotent.
 */

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StudentTalent from '@/models/StudentTalent';

const SEED_TALENTS = [
  {
    name:               'Rupesh Kumar Rupak',
    company:            'Adyapanschool',
    role:               'Full Stack Developer',
    status:             'placed',
    placed:             true,
    availability:       'Not Available',
    packageExpectation: 'Not disclosed',
    skills: [
      'HTML', 'CSS', 'JavaScript', 'React.js', 'Node.js',
      'Express.js', 'MongoDB', 'Firebase', 'Docker', 'Jenkins',
      'CI/CD', 'Git', 'GitHub', 'AWS', 'MySQL',
    ],
    education:       'B.Tech CSE, Vivekananda Global University, 2022–2026, CGPA 8.00/10.00',
    course:          'Full Stack Development',
    experienceLevel: 'Fresher',
    projectsCount:   8,
    certificatesCount: 2,
    rating:          4.8,
    portfolio:       'https://grand-platypus-6af7d5.netlify.app/',
    github:          'https://github.com/Rupeshrupak222',
    linkedin:        'https://www.linkedin.com/in/rupesh-kumar-rupak-bb4b44265/',
    email:           'talent@example.com',
    phone:           '9999999999',
    location:        'Jaipur, Rajasthan, India',
    resumeUrl:       '/resume/RupeshAD.pdf',
    objective:
      'B.Tech CSE final-year student specializing in Web Development and DevOps with hands-on experience in React, JavaScript, CI/CD, Docker, and cloud deployment.',
    profileSummary:
      'Placed Full Stack Developer at Adyapanschool with skills in React, Node.js, MongoDB, Docker, Jenkins, CI/CD, and cloud deployment.',
    experience: [
      {
        company:  'LinuxWorld Pvt Ltd',
        role:     'Tech Intern',
        duration: 'Jun 2025 – Aug 2025',
        location: 'Jaipur, Rajasthan',
        points: [
          'Built and managed CI/CD pipelines using Jenkins and Docker.',
          'Assisted in deploying scalable web apps using Kubernetes.',
          'Contributed to frontend and backend modules.',
          'Built responsive UI components and enhanced user experience using modern frontend technologies.',
        ],
      },
      {
        company:  'Adayapanschool.com',
        role:     'Community Development Intern',
        duration: 'March 2026 – Present',
        location: 'Hyderabad, Telangana',
        points: [
          'Team lead.',
          'Combined community building with data analysis to drive user acquisition.',
          'Monitored KPIs like engagement rate, conversion rate, and lead performance.',
          'Assisted in designing and optimizing sales funnels.',
          'Delivered insights to improve marketing effectiveness and student onboarding.',
        ],
      },
    ],
    projects: [
      {
        name:        'ShareGO',
        type:        'Full Stack Web Application',
        tools:       ['React', 'Firebase', 'Netlify'],
        description:
          'Developed a full-stack ride-sharing web application enabling users to connect with fellow travelers, share rides, reduce travel costs, and promote eco-friendly commuting.',
      },
      {
        name:        'Portfolio Website',
        type:        'Personal Project',
        tools:       ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
        description:
          'Designed and developed a responsive personal portfolio website showcasing projects, technical skills, education, and achievements.',
      },
    ],
    certifications: [
      'NPTEL: Management Information System',
      'LinuxWorld Pvt Ltd: JAZBAA 4.0 Webinar',
    ],
  },
  {
    name:               'Rukhsana Azami',
    company:            '',
    role:               'Nursing Intern',
    status:             'available',
    placed:             false,
    availability:       'Immediate',
    packageExpectation: 'Internship',
    skills: [
      'Patient Care',
      'Clinical Support',
      'Communication',
      'Emergency Assistance',
      'Healthcare Basics',
    ],
    education:        'B.Sc. Nursing',
    course:           'B.Sc. Nursing',
    experienceLevel:  'Internship',
    projectsCount:    2,
    certificatesCount: 1,
    rating:           4.5,
    portfolio:        '',
    github:           '',
    linkedin:         '',
    email:            '',
    phone:            '',
    location:         'India',
    resumeUrl:        '',
    objective:
      'B.Sc. Nursing student looking for internship opportunities in hospitals and healthcare organizations. Available immediately and eager to gain clinical experience.',
    profileSummary:
      'Dedicated B.Sc. Nursing student looking for internship opportunities in hospitals and healthcare organizations. Available immediately and eager to gain clinical experience.',
    experience:     [],
    projects:       [],
    certifications: [],
  },
];

export async function POST() {
  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Database connection failed. Please check MongoDB Atlas.' },
      { status: 503 }
    );
  }

  try {
    const results: { name: string; action: 'inserted' | 'skipped'; reason?: string }[] = [];

    for (const talent of SEED_TALENTS) {
      // Duplicate check by email or phone
      const orConditions: Record<string, string>[] = [];
      if (talent.email) orConditions.push({ email: talent.email.toLowerCase() });
      if (talent.phone) orConditions.push({ phone: talent.phone });

      const existing = orConditions.length
        ? await StudentTalent.findOne({ $or: orConditions }).lean()
        : null;

      if (existing) {
        results.push({ name: talent.name, action: 'skipped', reason: 'already exists' });
        continue;
      }

      await StudentTalent.create(talent);
      results.push({ name: talent.name, action: 'inserted' });
    }

    const inserted = results.filter(r => r.action === 'inserted').length;
    const skipped  = results.filter(r => r.action === 'skipped').length;

    console.log(`[Talents Seed] Inserted: ${inserted}, Skipped: ${skipped}`);

    return NextResponse.json({
      success: true,
      message: `Seed complete. Inserted: ${inserted}, Skipped: ${skipped}`,
      results,
    });
  } catch (err: any) {
    console.error('[Talents Seed]', err.message);
    return NextResponse.json(
      { success: false, error: 'Seed failed: ' + err.message },
      { status: 500 }
    );
  }
}
