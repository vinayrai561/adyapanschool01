'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Zap, Layers, ArrowRight, Star, Briefcase } from 'lucide-react';

const buildFeatures = [
  'Submit project requirements',
  'Pay minimum ₹3000',
  'Track progress in real-time',
  'Get completed work delivered',
];

const jobFeatures = [
  'Post verified jobs & internships',
  'Reach 1000+ job-ready students',
  'Review applications & shortlist',
  'Hire full-time, part-time or intern',
];

export default function PostWorkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <Link
          href="/company"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Company
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-widest mb-4">
            <motion.span
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-orange-500"
            />
            Post Work
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            How would you like to{' '}
            <span className="text-orange-500">get work done?</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Post a job vacancy for students, or submit a full project for our team to build.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

          {/* Post a Job */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(249,115,22,0.12)' }}
            className="relative bg-white rounded-3xl border-2 border-gray-200 hover:border-orange-300 p-8 flex flex-col transition-all duration-300 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border-2 border-orange-200 flex items-center justify-center mb-5">
              <Briefcase className="w-7 h-7 text-orange-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Post a Job</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Post verified jobs, internships, part-time, full-time, and project opportunities for Adyapan students.
            </p>
            <ul className="space-y-3 mb-8 flex-1">
              {jobFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-orange-500 border-2 border-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-200"
            >
              Post a Job <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Build My Project — Featured */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -6, boxShadow: '0 24px 64px rgba(249,115,22,0.25)' }}
            className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl border-2 border-orange-400 p-8 flex flex-col transition-all duration-300 overflow-hidden"
          >
            {/* Popular badge */}
            <div className="absolute top-5 right-5 flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm">
              <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
              <span className="text-xs font-bold text-white">Popular</span>
            </div>

            <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center mb-5 relative z-10">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2 relative z-10">Build My Project</h2>
            <p className="text-orange-100 text-sm leading-relaxed mb-6 relative z-10">
              Have a full project idea? Submit your requirements, make a payment, and our team will build it for you end-to-end.
            </p>
            <ul className="space-y-3 mb-8 flex-1 relative z-10">
              {buildFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white">
                  <CheckCircle className="w-4 h-4 text-orange-200 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/company/post-work/build-project"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-orange-600 bg-white hover:bg-orange-50 transition-all duration-200 relative z-10 shadow-lg shadow-orange-700/20"
            >
              Build My Project <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Bottom notes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10 space-y-2"
        >
          <p className="text-sm text-gray-400">
            Already submitted a project?{' '}
            <Link href="/company/my-projects" className="text-orange-500 font-semibold hover:underline">
              Track your projects →
            </Link>
          </p>
          <p className="text-sm text-gray-400">
            Want to browse student talent?{' '}
            <Link href="/jobs" className="text-orange-500 font-semibold hover:underline">
              View all jobs →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
