'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogOut, User, BookOpen, Award, Briefcase } from 'lucide-react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        setUser(response.data.user);
      } catch (err) {
        setError('Failed to load user data');
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/auth" className="text-orange-600 hover:text-orange-700 font-medium">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">ady.</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Adyapan</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Continue your learning journey and track your progress
          </p>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: BookOpen, label: 'Courses', value: '0', color: 'blue' },
            { icon: Award, label: 'Certificates', value: '0', color: 'green' },
            { icon: Briefcase, label: 'Opportunities', value: '0', color: 'purple' },
            { icon: User, label: 'Profile', value: 'Complete', color: 'orange' },
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 bg-${card.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                <card.icon className={`w-6 h-6 text-${card.color}-600`} />
              </div>
              <p className="text-gray-600 text-sm mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            We're building an amazing dashboard experience for you. Check back soon for:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600 mb-8">
            <li>✓ Course enrollment and progress tracking</li>
            <li>✓ Skill assessments and certifications</li>
            <li>✓ Micro-internship opportunities</li>
            <li>✓ Mentor connections</li>
            <li>✓ Career pathway recommendations</li>
          </ul>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium"
          >
            Explore Courses
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
