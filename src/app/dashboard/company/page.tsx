'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Briefcase, Users, TrendingUp } from 'lucide-react';
import axios from 'axios';
import ProfileMenu from '@/components/ProfileMenu';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  selectedProgram?: string | null;
  selectedAmount?: number | null;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const formattedSelectedAmount =
    user?.selectedAmount != null ? `₹${user.selectedAmount.toLocaleString('en-IN')}` : null;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.data.user.role !== 'COMPANY') {
          router.push('/dashboard/student');
          return;
        }
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
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a2a4e] to-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a2a4e] to-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/auth" className="text-orange-500 hover:text-orange-400 font-medium">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a2a4e] to-[#0f1419]">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-400">
            Manage your hiring pipeline and find the best talent
          </p>
        </motion.div>

        {(user?.selectedProgram || user?.selectedAmount) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 rounded-xl border border-green-300/40 bg-green-500/10 p-5"
          >
            <h2 className="text-lg font-semibold text-green-300 mb-2">Purchased Plan</h2>
            <p className="text-green-200">
              {user.selectedProgram ? user.selectedProgram : "Selected Program"}
              {formattedSelectedAmount ? ` - ${formattedSelectedAmount}` : ""}
            </p>
          </motion.div>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Briefcase, label: 'Posted Tasks', value: '0', color: 'orange' },
            { icon: Users, label: 'Applications', value: '0', color: 'blue' },
            { icon: TrendingUp, label: 'Completed', value: '0', color: 'green' },
            { icon: User, label: 'Profile', value: 'Complete', color: 'purple' },
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1a2a4e] rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-700"
            >
              <div className={`w-12 h-12 bg-${card.color}-900/30 rounded-lg flex items-center justify-center mb-4`}>
                <card.icon className={`w-6 h-6 text-${card.color}-500`} />
              </div>
              <p className="text-gray-400 text-sm mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1a2a4e] rounded-xl shadow-sm p-8 text-center border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Dashboard Coming Soon</h2>
          <p className="text-gray-400 mb-6">
            We're building an amazing dashboard experience for you. Check back soon for:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-2 text-gray-400 mb-8">
            <li>✓ Task posting and management</li>
            <li>✓ Application review and filtering</li>
            <li>✓ Candidate evaluation tools</li>
            <li>✓ Hiring analytics and insights</li>
            <li>✓ Team collaboration features</li>
          </ul>
          <Link
            href="/hiring"
            className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium"
          >
            Post a Task
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
