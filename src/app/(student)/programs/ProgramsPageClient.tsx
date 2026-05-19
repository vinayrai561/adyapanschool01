'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ALL_PROGRAMS } from '@/lib/courseData';

const programs = [
  {
    title: 'CSE / IT DOMAINS',
    count: '26 COURSES',
    color: '#ff9900',
    courses: [
      'Artificial Intelligence',
      'AI Engineering',
      'Generative AI',
      'Machine Learning',
      'Data Science',
      'Data Engineering',
      'Data Analytics',
      'Database Management (DBMS)',
      'Data Structures & Algorithms',
      'Web Development',
      'Web 3.0',
      'App Development',
      'Python Full Stack',
      'Python programming curriculum',
      'Java Programming',
      'Java Full Stack',
      'Selenium Testing with Java',
      'DevOps Engineering',
      'Cloud Computing',
      'AWS',
      'Cyber Security',
      'Blockchain & Bitcoin',
      'AR/VR Development',
      'UI/UX Design',
      'Graphic Design',
      'VFX',
    ],
  },
  {
    title: 'MANAGEMENT & COMMERCE',
    count: '15 COURSES',
    color: '#ff9900',
    courses: [
      'Finance',
      'Investment Banking',
      'Business Analytics',
      'Marketing Management',
      'Digital Marketing & Growth Strategy',
      'Social Media Marketing',
      'HRM',
      'Management Consultancy',
      'Supply Chain Management',
      'SAP FICA',
      'Salesforce',
      'Stock Marketing',
      'ACCA F4 (Business & Corporate Law)',
      'Chartered Accountancy / CFA',
      'Spoken English & Communication',
    ],
  },
  {
    title: 'ECE DOMAINS',
    count: '5 COURSES',
    color: '#ff9900',
    courses: [
      'Embedded Systems',
      'Hybrid & Electric Vehicle',
      'VLSI',
      'IoT & Robotics',
      'Power Systems',
    ],
  },
  {
    title: 'ECONOMICS',
    count: '4 COURSES',
    color: '#ff9900',
    courses: [
      'Business & Financial Economics',
      'Investment Analysis',
      'Data Analysis for Economics',
      'Financial Economics',
    ],
  },
  {
    title: 'MECHANICAL ENGINEERING',
    count: '4 COURSES',
    color: '#ff9900',
    courses: [
      'AutoCAD',
      'CATIA',
      'Car Design',
      'Quality & Safety Professionals',
    ],
  },
  {
    title: 'BIO & LIFE SCIENCES',
    count: '10 COURSES',
    color: '#ff9900',
    courses: [
      'Bioinformatics',
      'Microbiology',
      'Molecular Biology',
      'Genetic Engineering',
      'Pharmacovigilance',
      'Nano Technology',
      'Food Science & Technology',
      'Nutrition & Health Management',
      'Sensory Science',
      'Medical Coding',
    ],
  },
  {
    title: 'CIVIL ENGINEERING',
    count: '1 COURSE',
    color: '#ff9900',
    courses: [
      'Construction Planning',
    ],
  },
];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const courseSlugByTitle = new Map(
  ALL_PROGRAMS.map((course) => [normalize(course.title), course.slug])
);

function getCourseHref(courseTitle: string) {
  const slug = courseSlugByTitle.get(normalize(courseTitle));
  return slug ? `/courses/${slug}` : '/programs';
}

export default function ProgramsPageClient() {
  return (
    <section className="bg-[#1a1a2e] min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            All Programs
          </h1>
          <p className="text-lg text-gray-400">
            Explore our comprehensive range of courses across multiple domains
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((program, i) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ boxShadow: `0 0 30px ${program.color}40`, transition: { duration: 0.3 } }}
              className="rounded-3xl p-8 border-2"
              style={{ borderColor: program.color, background: 'rgba(255, 153, 0, 0.05)' }}
            >
              <div className="mb-6 pb-6 border-b border-gray-600">
                <h2 className="text-2xl font-extrabold text-white mb-2">
                  {program.title}
                </h2>
                <p className="text-lg font-bold" style={{ color: program.color }}>
                  {program.count}
                </p>
              </div>

              <ul className="space-y-3">
                {program.courses.map((course, j) => (
                  <motion.li
                    key={course}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.05, duration: 0.4 }}
                    className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                      style={{ background: program.color }}
                    />
                    <Link
                      href={getCourseHref(course)}
                      className="text-sm leading-relaxed underline hover:no-underline"
                    >
                      {course}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
