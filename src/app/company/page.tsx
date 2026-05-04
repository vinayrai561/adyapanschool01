'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Briefcase, Users, Zap, TrendingUp, Award } from 'lucide-react';
import { useState, useEffect } from 'react';

const customEase = [0.22, 1, 0.36, 1] as const;

// Typing animation component with loop
const TypingText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    let isDeleting = false;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (!isDeleting) {
          // Typing forward
          if (index < text.length) {
            setDisplayedText(text.slice(0, index + 1));
            index++;
          } else {
            // Pause at end before deleting
            isDeleting = true;
            setTimeout(() => {
              isDeleting = false;
              index = 0;
            }, 1500); // Pause for 1.5 seconds before restarting
          }
        }
      }, 50); // Typing speed

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="inline-block w-1 h-8 bg-[#f90] ml-1"
      />
    </span>
  );
};

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

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#1a202c] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/company">
            <img src="/images/adyapan-logo-bg.png" alt="Adyapan" className="h-10 w-auto" />
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[['/company', 'Home'], ['/company/about', 'About Us'], ['/company/gallery', 'Our Gallery'], ['/company/hire-talent', 'Hire Talent']].map(([h, l]) => (
              <Link key={l} href={h} className={`transition-colors ${l === 'Home' ? 'text-[#ffa800]' : 'text-white hover:text-gray-300'}`}>
                {l}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link href="/auth?type=organization" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
              Login
            </Link>
            <Link href="/auth?type=organization" className="px-6 py-2 bg-[#ffa800] text-white rounded-full text-sm font-semibold hover:bg-[#e69500] transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Exact Match to Image */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url("/images/company-background.png")',
          }}
        />
        
        {/* Dark Overlay - Minimal for better texture visibility */}
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Gradient Overlay - Light for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1419]/40 via-[#0f1419]/20 to-transparent" />

        {/* Background gradient effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#f90]/5 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-20">
          {/* Left Content - Full Width */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: customEase }}
            className="space-y-8 max-w-2xl"
          >
            {/* Main Headline */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-6xl md:text-7xl font-extrabold leading-[1.1] mb-6"
              >
                <span className="text-white">Hire </span>
                <span style={{ color: '#f90' }}>
                  <TypingText text="Job-Ready" delay={300} />
                </span>
                <br />
                <span style={{ color: '#f90' }}>
                  <TypingText text="Talent" delay={800} />
                </span>
                <span className="text-white">,</span>
                <br />
                <span className="text-white">Not Just</span>
                <br />
                <span className="text-white">Freelancers</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-400 text-lg leading-relaxed max-w-lg"
              >
                Skip the training. Hire vetted candidates who have already worked on real projects and are ready to contribute from Day 1.
              </motion.p>
            </div>

            {/* Features Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-400/40 backdrop-blur-md border border-gray-500/30 rounded-3xl p-8 space-y-5 shadow-2xl"
            >
              <div className="space-y-4">
                {[
                  'Verified skills & performance',
                  'No training cost required',
                  'Faster hiring turnaround',
                  'Flexible hiring: intern, freelancer, full-time'
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f90' }}>
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-base font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/company/hire-talent"
                  className="px-8 py-4 bg-[#f90] text-white rounded-lg font-bold text-center hover:bg-[#e07000] transition-colors text-lg"
                >
                  Hire Talent
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#"
                  className="px-8 py-4 border-2 border-gray-600 text-white rounded-lg font-bold text-center hover:border-gray-400 transition-colors text-lg"
                >
                  Find Talent
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Adyapan Section */}
      <section className="py-20 bg-[#0f1419] border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why <span style={{ color: '#f90' }}>Adyapan</span> Talent?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Access pre-vetted, job-ready professionals who have proven their skills on real projects
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Award,
                title: 'Pre-trained on Real Industry Projects',
                description: 'Our candidates have completed real-world projects and understand industry standards'
              },
              {
                icon: Zap,
                title: 'Ready to Work from Day 1',
                description: 'No onboarding delays. They hit the ground running with proven skills'
              },
              {
                icon: CheckCircle,
                title: 'Proven Skills with Verified Performance',
                description: 'Every candidate has been assessed and verified for their technical abilities'
              },
              {
                icon: TrendingUp,
                title: 'Flexible Hiring Options',
                description: 'Hire as interns, freelancers, or full-time employees based on your needs'
              },
              {
                icon: Users,
                title: 'Direct-to-Hire Pipeline',
                description: 'Build your team with candidates who are already familiar with your industry'
              },
              {
                icon: Briefcase,
                title: 'See Real Project Portfolios',
                description: 'Review actual work samples and project portfolios before hiring'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 hover:border-[#f90]/50 hover:shadow-lg transition-all group"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-[#f90]/10 rounded-lg flex items-center justify-center group-hover:bg-[#f90]/20 transition-colors">
                    <item.icon className="w-6 h-6" style={{ color: '#f90' }} />
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-[#0f1419] to-[#1a2a4e]/30 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg">
              Get started in 4 simple steps
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.2, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                step: '01',
                title: 'Post Your Task',
                description: 'Describe the work you need done in minutes'
              },
              {
                step: '02',
                title: 'Browse Talent',
                description: 'Access pre-vetted candidates with proven skills'
              },
              {
                step: '03',
                title: 'Hire & Collaborate',
                description: 'Start working with your chosen talent immediately'
              },
              {
                step: '04',
                title: 'Scale Your Team',
                description: 'Convert to full-time or continue with flexible hiring'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="relative"
              >
                <div className="bg-white border border-gray-300 rounded-2xl p-8 h-full shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-5xl font-bold mb-4" style={{ color: '#f90' }}>
                    {item.step}
                  </div>
                  <h3 className="text-[#1a1a2e] font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-8 bg-[#f90] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">›</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
              Ready to Hire <span style={{ color: '#f90' }}>Job-Ready Talent?</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Post your first task and start building your dream team today
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/hiring"
                className="inline-block px-10 py-4 bg-[#f90] text-white rounded-lg font-bold text-lg hover:bg-[#e07000] transition-colors"
              >
                Post Your First Task →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <img
                  src="/images/adyapan-logo-bg.png"
                  alt="Adyapan Logo"
                  className="h-8 w-auto"
                />
              </Link>
              <p className="text-gray-600 text-sm">Hire job-ready talent, not just freelancers</p>
            </div>
            <div>
              <h4 className="text-[#1a1a2e] font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/company/hire-talent" className="hover:text-[#1a1a2e] transition-colors">Hire Talent</Link></li>
                <li><Link href="#" className="hover:text-[#1a1a2e] transition-colors">Find Work</Link></li>
                <li><Link href="#" className="hover:text-[#1a1a2e] transition-colors">Programs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#1a1a2e] font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="#" className="hover:text-[#1a1a2e] transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-[#1a1a2e] transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-[#1a1a2e] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#1a1a2e] font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="#" className="hover:text-[#1a1a2e] transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-[#1a1a2e] transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-[#1a1a2e] transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-gray-600 text-sm">
            <p>&copy; 2024 Adyapan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
