'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { 
  Users, Target, Award, Briefcase, DollarSign, Clock, CheckCircle,
  Globe, TrendingUp, Shield, BookOpen, Zap, ChevronRight
} from 'lucide-react';
import AuthNavButtons from '@/components/AuthNavButtons';
import MarqueeBanner from '@/components/MarqueeBanner';

const customEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: customEase } },
};

const staggerContainer = (stagger = 0.12, delayChildren = 0.1) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export default function CampusAmbassadorPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
          }}
        >
          <source src="/videos/7969486-uhd_3840_2160_30fps.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            zIndex: 0,
          }}
        />

        <div className="max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: customEase }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Become a
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffa800] to-[#ff6b00]">
                Campus Ambassador
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Bridge the gap between students and industry. Empower your campus with Adyapan and earn up to ₹15,000/month while making a real impact.
            </p>

            {/* Key Stats */}
            <motion.div
              variants={staggerContainer(0.1, 0.2)}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            >
              <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-4xl font-black text-[#ffa800] mb-2">₹1K - 15K</div>
                <p className="text-gray-700 font-semibold">Monthly Stipend</p>
                <p className="text-sm text-gray-600">Incentive Based</p>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-4xl font-black text-[#ffa800] mb-2">All</div>
                <p className="text-gray-700 font-semibold">Academic Programs</p>
                <p className="text-sm text-gray-600">Engineering, Management & More</p>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-4xl font-black text-[#ffa800] mb-2">Flexible</div>
                <p className="text-gray-700 font-semibold">Work Schedule</p>
                <p className="text-sm text-gray-600">Balance with Studies</p>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-4xl font-black text-[#ffa800] mb-2">100%</div>
                <p className="text-gray-700 font-semibold">Remote Friendly</p>
                <p className="text-sm text-gray-600">Work from Anywhere</p>
              </motion.div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href="https://unstop.com/internships/campus-ambassador-srs-adyapan-private-limited-1677071"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-[#ffa800] to-[#ff8c00] text-white rounded-full font-bold text-lg hover:from-[#e69500] hover:to-[#e67e00] transition-all duration-300 shadow-lg"
                >
                  Apply Now on Unstop
                  <ChevronRight className="w-5 h-5 ml-2" />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Banner — Premium accent after hero */}
      <MarqueeBanner variant="orange" speed={30} />

      {/* About Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: customEase }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 text-center">About Adyapan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-[#ffa800] rounded-full mr-3"></span>
                    Who We Are
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    SR's Adyapan Edutech Private Limited is a dynamic e-learning organization dedicated to bridging the gap between academic learning and industry skills. We are committed to upskilling learners and fostering career opportunities.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-[#ffa800] rounded-full mr-3"></span>
                    Our Vision
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    To empower individuals with accessible, quality, and skill-based learning solutions. We enhance employability and career growth within a rapidly evolving landscape, ensuring professionals are equipped with practical, industry-aligned skills.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-[#ffa800] rounded-full mr-3"></span>
                    Our Approach
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our focus on a learner-centric approach and strong industry alignment helps us create meaningful pathways for students and young professionals to transition into the workforce with the skills and confidence they need.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-[#ffa800] rounded-full mr-3"></span>
                    Why Join Us
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Be part of a mission to transform education and empower the next generation of professionals. Make a real impact on your campus while building valuable experience and earning competitive incentives.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Role Details Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: customEase }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-16 text-center"
          >
            The Role
          </motion.h2>

          <motion.div
            variants={staggerContainer(0.15, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {[
              {
                icon: Users,
                title: "Bridge Between Students & Company",
                description: "Serve as the primary connection between students interested in training or internships and Adyapan Edutech."
              },
              {
                icon: Target,
                title: "Gather Student Insights",
                description: "Collect valuable feedback regarding academic programs, campus life, and internship expectations."
              },
              {
                icon: Zap,
                title: "Promote Initiatives",
                description: "Facilitate webinars, grassroots development, and encourage student participation in organizational programs."
              },
              {
                icon: Globe,
                title: "Distribute Information",
                description: "Help share important updates and information with the student community effectively."
              },
              {
                icon: TrendingUp,
                title: "Drive Engagement",
                description: "Represent student interests and drive meaningful engagement across your campus."
              },
              {
                icon: Shield,
                title: "Maintain Communication",
                description: "Ensure clear and consistent communication between students, peers, and company staff."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-[#ffa800] to-[#ff6b00] rounded-xl flex items-center justify-center mb-6"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Requirements & Skills Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: customEase }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-16 text-center"
          >
            Requirements & Skills
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: customEase }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Briefcase className="w-6 h-6 text-[#ffa800] mr-3" />
                Requirements
              </h3>
              <div className="space-y-4">
                {[
                  "Currently enrolled in a relevant academic program",
                  "Interest in student affairs and community engagement",
                  "Passion for campus representation",
                  "Ability to work independently and as part of a team",
                  "Commitment to making a positive impact"
                ].map((req, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-[#ffa800] flex-shrink-0 mt-1" />
                    <span className="text-gray-700 font-medium">{req}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: customEase }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Award className="w-6 h-6 text-[#ffa800] mr-3" />
                Key Skills
              </h3>
              <div className="space-y-4">
                {[
                  "Excellent interpersonal and communication skills",
                  "Strong organizational abilities with attention to detail",
                  "Collaborative approach to problem-solving",
                  "Ability to engage and inspire diverse groups",
                  "Self-motivated and proactive mindset"
                ].map((skill, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-[#ffa800] flex-shrink-0 mt-1" />
                    <span className="text-gray-700 font-medium">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: customEase }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-16 text-center"
          >
            Who Can Apply?
          </motion.h2>

          <motion.div
            variants={staggerContainer(0.15, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Engineering Students",
                items: ["Undergraduates", "Postgraduates", "Freshers"]
              },
              {
                title: "Management Students",
                items: ["MBA Students", "BBA Students", "All Levels"]
              },
              {
                title: "Other Disciplines",
                items: ["Arts", "Commerce", "Sciences", "All Programs"]
              }
            ].map((category, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{category.title}</h3>
                <div className="space-y-3">
                  {category.items.map((item, j) => (
                    <motion.div
                      key={j}
                      className="flex items-center justify-center space-x-2 text-gray-700"
                      whileHover={{ x: 5 }}
                    >
                      <span className="w-2 h-2 bg-[#ffa800] rounded-full"></span>
                      <span className="font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#ffa800]/10 to-[#ff6b00]/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: customEase }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-gray-700 mb-10 leading-relaxed">
              Join our community of campus ambassadors and become the bridge between students and industry. Earn competitive incentives while making a real difference on your campus.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href="https://unstop.com/internships/campus-ambassador-srs-adyapan-private-limited-1677071"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-[#ffa800] to-[#ff8c00] text-white rounded-full font-bold text-lg hover:from-[#e69500] hover:to-[#e67e00] transition-all duration-300 shadow-xl"
              >
                Apply Now on Unstop
                <ChevronRight className="w-6 h-6 ml-2" />
              </a>
            </motion.div>

            <p className="text-gray-600 text-sm mt-8">
              Stipend: ₹1,000 - ₹15,000/Month (Incentive Based) • Flexible Schedule • Remote Friendly
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}