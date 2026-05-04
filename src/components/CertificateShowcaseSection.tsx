'use client';

import { motion } from 'framer-motion';

const certificates = [
  {
    title: 'Career Boost Program Certificate',
    description:
      'This certificate is awarded to interns in recognition of their successful completion of the Career Boost Program at ADYAPAN. During their tenure, interns contribute significantly to specific projects and gain practical exposure.',
    points: [
      'Validates practical experience and boosts job prospects.',
      "Demonstrates the intern's acquired skills and competencies.",
      'Opens doors to potential employers and mentors.',
      'Can be included in the professional portfolio.',
      'Signifies dedication to learning and professional development.',
    ],
    imageLeft: false,
    image: '/images/certificate-career-boost.jpg',
  },
  {
    title: 'Skill Development Program Certificate',
    description:
      'This certificate is awarded to participants who successfully complete the Skill Development Program at ADYAPAN. The program equips learners with a comprehensive set of skills and knowledge for professional and personal growth.',
    points: [
      'Demonstrates commitment to personal and professional development.',
      'Adds value to resumes and improves employability.',
      'Shows hands-on experience and mastery of key skills.',
    ],
    imageLeft: true,
    image: '/images/certificate-skill-development.jpg',
  },
  {
    title: 'Special Recognition & Recommendation',
    description:
      'Top-performing students and interns at ADYAPAN may receive letters of recommendation recognizing their outstanding contribution and excellence during programs.',
    points: [
      'Highlights achievements to potential employers.',
      'Strengthens applications for jobs, internships, and higher studies.',
      'Encourages continued learning and skill development.',
    ],
    imageLeft: false,
    image: '/images/certificate-special-recognition.jpg',
  },
];

const CertificateShowcaseSection = () => {
  return (
    <section className="bg-[#f5f0eb] py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl font-extrabold text-[#1a1a2e] mb-4"
          >
            Work-Ready Certification
          </motion.h2>
        </div>

        {/* Certificate Cards */}
        <div className="space-y-20">
          {certificates.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Certificate Image — left */}
              {cert.imageLeft && (
                <motion.div
                  whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(0,0,0,0.12)', transition: { duration: 0.3 } }}
                  className="order-1 rounded-2xl overflow-hidden shadow-xl"
                >
                  <img src={cert.image} alt={cert.title} className="w-full h-auto object-cover" />
                </motion.div>
              )}

              {/* Text Content */}
              <div className={cert.imageLeft ? 'order-2' : 'order-2 lg:order-1'}>
                <h3 className="text-3xl font-extrabold text-[#1a1a2e] mb-4 leading-tight">
                  {cert.title}
                </h3>
                <p className="text-[#666] text-base leading-relaxed mb-6">
                  {cert.description}
                </p>
                <ul className="space-y-3">
                  {cert.points.map((point, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-start gap-3"
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: '#ff9900' }}
                      >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-[#444] text-sm leading-relaxed">{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Certificate Image — right */}
              {!cert.imageLeft && (
                <motion.div
                  whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(0,0,0,0.12)', transition: { duration: 0.3 } }}
                  className="order-1 lg:order-2 rounded-2xl overflow-hidden shadow-xl"
                >
                  <img src={cert.image} alt={cert.title} className="w-full h-auto object-cover" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificateShowcaseSection;
