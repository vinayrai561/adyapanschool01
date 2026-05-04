/**
 * Course catalogue — matches plan slugs from checkout.
 * Used to seed MongoDB and as fallback for dashboard.
 */

export const COURSE_CATALOGUE = [
  {
    slug: 'plan-1',
    title: 'Adyapan Starter',
    subtitle: 'Build your foundation with core industry skills',
    duration: '2 Months',
    category: 'Foundation',
    level: 'Beginner' as const,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=600&q=80',
    modules: [
      {
        title: 'Module 1 — Introduction & Fundamentals',
        lessons: [
          { title: 'Welcome to Adyapan', duration: '5 min', isFree: true },
          { title: 'Course Overview & Roadmap', duration: '8 min', isFree: true },
          { title: 'Setting Up Your Environment', duration: '12 min', isFree: false },
          { title: 'Core Concepts Explained', duration: '18 min', isFree: false },
        ],
      },
      {
        title: 'Module 2 — Core Skills',
        lessons: [
          { title: 'Skill Building Session 1', duration: '20 min', isFree: false },
          { title: 'Skill Building Session 2', duration: '22 min', isFree: false },
          { title: 'Hands-on Exercise', duration: '30 min', isFree: false },
          { title: 'Quiz & Assessment', duration: '15 min', isFree: false },
        ],
      },
      {
        title: 'Module 3 — Practical Application',
        lessons: [
          { title: 'Real-world Project Intro', duration: '10 min', isFree: false },
          { title: 'Project Walkthrough', duration: '35 min', isFree: false },
          { title: 'Submission Guidelines', duration: '8 min', isFree: false },
        ],
      },
      {
        title: 'Module 4 — Certification',
        lessons: [
          { title: 'Final Assessment', duration: '20 min', isFree: false },
          { title: 'Certificate Walkthrough', duration: '5 min', isFree: false },
          { title: 'Next Steps & Career Guidance', duration: '12 min', isFree: false },
        ],
      },
    ],
  },
  {
    slug: 'plan-2',
    title: 'Adyapan Standard',
    subtitle: 'Hands-on projects with expert mentorship',
    duration: '2 Months',
    category: 'Professional',
    level: 'Intermediate' as const,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    modules: [
      {
        title: 'Module 1 — Foundation & Core Concepts',
        lessons: [
          { title: 'Program Introduction', duration: '6 min', isFree: true },
          { title: 'Industry Overview', duration: '14 min', isFree: true },
          { title: 'Tools & Technologies', duration: '20 min', isFree: false },
          { title: 'Best Practices', duration: '18 min', isFree: false },
          { title: 'Module Quiz', duration: '10 min', isFree: false },
        ],
      },
      {
        title: 'Module 2 — Hands-on Projects',
        lessons: [
          { title: 'Project 1: Setup & Planning', duration: '25 min', isFree: false },
          { title: 'Project 1: Development', duration: '45 min', isFree: false },
          { title: 'Project 1: Review & Feedback', duration: '20 min', isFree: false },
          { title: 'Project 2: Advanced Features', duration: '40 min', isFree: false },
        ],
      },
      {
        title: 'Module 3 — Industry Case Studies',
        lessons: [
          { title: 'Case Study 1', duration: '30 min', isFree: false },
          { title: 'Case Study 2', duration: '28 min', isFree: false },
          { title: 'Discussion & Analysis', duration: '20 min', isFree: false },
        ],
      },
      {
        title: 'Module 4 — Mentorship Sessions',
        lessons: [
          { title: 'Mentor Session 1: Career Path', duration: '45 min', isFree: false },
          { title: 'Mentor Session 2: Technical Review', duration: '45 min', isFree: false },
          { title: 'Portfolio Building', duration: '30 min', isFree: false },
        ],
      },
      {
        title: 'Module 5 — Assessment & Certification',
        lessons: [
          { title: 'Final Project Submission', duration: '60 min', isFree: false },
          { title: 'Peer Review', duration: '20 min', isFree: false },
          { title: 'Certificate & Next Steps', duration: '10 min', isFree: false },
        ],
      },
    ],
  },
  {
    slug: 'plan-3',
    title: 'Adyapan Professional',
    subtitle: 'Real projects, placement support & 1:1 mentorship',
    duration: '3 Months',
    category: 'Advanced',
    level: 'Advanced' as const,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    modules: [
      {
        title: 'Module 1 — Advanced Concepts',
        lessons: [
          { title: 'Advanced Architecture Overview', duration: '20 min', isFree: true },
          { title: 'Design Patterns', duration: '35 min', isFree: false },
          { title: 'Performance Optimization', duration: '28 min', isFree: false },
          { title: 'Security Best Practices', duration: '22 min', isFree: false },
          { title: 'Module Assessment', duration: '15 min', isFree: false },
        ],
      },
      {
        title: 'Module 2 — Real-world Project Development',
        lessons: [
          { title: 'Project Scoping & Planning', duration: '30 min', isFree: false },
          { title: 'Sprint 1: Core Features', duration: '60 min', isFree: false },
          { title: 'Sprint 2: Advanced Features', duration: '60 min', isFree: false },
          { title: 'Sprint 3: Testing & QA', duration: '45 min', isFree: false },
          { title: 'Sprint 4: Deployment', duration: '40 min', isFree: false },
        ],
      },
      {
        title: 'Module 3 — Industry Expert Sessions',
        lessons: [
          { title: 'Expert Talk: Industry Trends', duration: '50 min', isFree: false },
          { title: 'Expert Talk: Career Growth', duration: '45 min', isFree: false },
          { title: 'Live Q&A Session', duration: '60 min', isFree: false },
        ],
      },
      {
        title: 'Module 4 — Portfolio Building',
        lessons: [
          { title: 'Portfolio Strategy', duration: '20 min', isFree: false },
          { title: 'GitHub Profile Optimization', duration: '25 min', isFree: false },
          { title: 'LinkedIn Profile', duration: '20 min', isFree: false },
          { title: 'Resume Building', duration: '30 min', isFree: false },
        ],
      },
      {
        title: 'Module 5 — Placement Preparation',
        lessons: [
          { title: 'Mock Interview 1', duration: '45 min', isFree: false },
          { title: 'Mock Interview 2', duration: '45 min', isFree: false },
          { title: 'Aptitude & Coding Tests', duration: '60 min', isFree: false },
        ],
      },
      {
        title: 'Module 6 — Certification',
        lessons: [
          { title: 'Final Capstone Project', duration: '90 min', isFree: false },
          { title: 'Evaluation & Feedback', duration: '30 min', isFree: false },
          { title: 'Certificate Ceremony', duration: '10 min', isFree: false },
        ],
      },
    ],
  },
  {
    slug: 'plan-4-premium',
    title: 'Adyapan Career Pro',
    subtitle: 'Placement guarantee, 1:1 mentorship & industry projects',
    duration: '4 Months',
    category: 'Career',
    level: 'Advanced' as const,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    modules: [
      {
        title: 'Module 1 — Deep-dive Core Curriculum',
        lessons: [
          { title: 'Program Kickoff & Goal Setting', duration: '15 min', isFree: true },
          { title: 'Core Technology Deep Dive', duration: '45 min', isFree: false },
          { title: 'Advanced Patterns & Architecture', duration: '40 min', isFree: false },
          { title: 'System Design Fundamentals', duration: '50 min', isFree: false },
          { title: 'Module 1 Assessment', duration: '20 min', isFree: false },
        ],
      },
      {
        title: 'Module 2 — Industry-grade Projects',
        lessons: [
          { title: 'Project 1: E-commerce Platform', duration: '90 min', isFree: false },
          { title: 'Project 2: Real-time Application', duration: '90 min', isFree: false },
          { title: 'Project 3: Data Pipeline', duration: '75 min', isFree: false },
          { title: 'Code Review & Optimization', duration: '45 min', isFree: false },
        ],
      },
      {
        title: 'Module 3 — Expert Masterclasses',
        lessons: [
          { title: 'Masterclass: Scaling Systems', duration: '60 min', isFree: false },
          { title: 'Masterclass: Cloud Architecture', duration: '60 min', isFree: false },
          { title: 'Masterclass: AI/ML Integration', duration: '60 min', isFree: false },
          { title: 'Live Workshop', duration: '90 min', isFree: false },
        ],
      },
      {
        title: 'Module 4 — Mock Interviews & GD',
        lessons: [
          { title: 'Technical Interview Prep', duration: '45 min', isFree: false },
          { title: 'Mock Interview Round 1', duration: '60 min', isFree: false },
          { title: 'Mock Interview Round 2', duration: '60 min', isFree: false },
          { title: 'Group Discussion Practice', duration: '45 min', isFree: false },
          { title: 'HR Interview Prep', duration: '30 min', isFree: false },
        ],
      },
      {
        title: 'Module 5 — Resume & Portfolio',
        lessons: [
          { title: 'ATS-Optimized Resume', duration: '35 min', isFree: false },
          { title: 'Portfolio Website', duration: '45 min', isFree: false },
          { title: 'LinkedIn Optimization', duration: '25 min', isFree: false },
          { title: 'GitHub Profile', duration: '20 min', isFree: false },
        ],
      },
      {
        title: 'Module 6 — Placement Drive',
        lessons: [
          { title: 'Company Shortlisting', duration: '20 min', isFree: false },
          { title: 'Application Strategy', duration: '25 min', isFree: false },
          { title: 'Offer Negotiation', duration: '20 min', isFree: false },
        ],
      },
      {
        title: 'Module 7 — Certification',
        lessons: [
          { title: 'Final Capstone Presentation', duration: '60 min', isFree: false },
          { title: 'Peer & Mentor Evaluation', duration: '30 min', isFree: false },
          { title: 'Certificate & Alumni Network', duration: '15 min', isFree: false },
        ],
      },
    ],
  },
];

/** Compute totalLessons from modules */
export function withTotalLessons(course: typeof COURSE_CATALOGUE[0]) {
  const total = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  return { ...course, totalLessons: total };
}
