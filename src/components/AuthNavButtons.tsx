'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';

interface NavUser {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
}

interface Props {
  /** Pass 'light' for dark backgrounds (white text), 'dark' for light backgrounds */
  theme?: 'light' | 'dark';
  authType?: 'student' | 'organization';
}

export default function AuthNavButtons({ theme = 'light', authType = 'student' }: Props) {
  const [user, setUser] = useState<NavUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const fetchUser = () => {
      fetch('/api/auth/me')
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          setUser(data?.user ?? null);
          setChecked(true);
        })
        .catch(() => { setUser(null); setChecked(true); });
    };
    fetchUser();
    window.addEventListener('auth-change', fetchUser);
    return () => window.removeEventListener('auth-change', fetchUser);
  }, []);

  // Don't flash anything until we know auth state
  if (!checked) return <div className="w-32 h-8" />;

  if (user) {
    return (
      <ProfileDropdown
        user={user}
        onUserUpdate={(updated) => setUser(prev => ({ ...prev, ...updated }))}
      />
    );
  }

  const authHref = authType === 'organization' ? '/auth?type=organization' : '/auth';
  const textCls = theme === 'light'
    ? 'text-white hover:text-gray-300'
    : 'text-gray-700 hover:text-gray-900';

  return (
    <div className="flex items-center gap-4">
      <Link href={authHref} className={`text-sm font-medium transition-colors ${textCls}`}>
        Login
      </Link>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href={authHref}
          className="px-5 py-2 bg-[#ffa800] text-white rounded-full text-sm font-semibold hover:bg-[#e69500] transition-colors"
        >
          Sign Up
        </Link>
      </motion.div>
    </div>
  );
}
