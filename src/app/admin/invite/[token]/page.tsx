'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight, Shield, Lock, Mail, Phone, User, Building2 } from 'lucide-react';
import axios from 'axios';

/* ── Floating orb background ─────────────────────────────────── */
function Orbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#ffa800]/30 to-orange-300/10 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-orange-400/20 to-amber-200/10 blur-3xl"
      />
    </div>
  );
}

/* ── Floating input field ────────────────────────────────────── */
function FloatInput({
  label, name, type = 'text', value, onChange, placeholder, required, autoComplete, disabled, icon: Icon,
  rightEl,
}: {
  label: string; name: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; required?: boolean; autoComplete?: string; disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  rightEl?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={active ? placeholder : ''}
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
        suppressHydrationWarning
        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 pt-6 pb-2 rounded-xl border-2 bg-white text-gray-900 text-sm outline-none transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${focused ? 'border-[#ffa800] shadow-[0_0_0_4px_rgba(255,168,0,0.12)]' : 'border-gray-200 hover:border-gray-300'}
          ${rightEl ? 'pr-12' : ''}`}
      />
      <label
        className={`absolute ${Icon ? 'left-11' : 'left-4'} transition-all duration-200 pointer-events-none font-medium
          ${active ? 'top-2 text-[10px] text-[#ffa800] uppercase tracking-wider' : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'}`}
      >
        {label}
      </label>
      {rightEl && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
      )}
    </div>
  );
}

export default function AdminInviteSignupPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const [verifying, setVerifying] = useState(true);
  const [inviteData, setInviteData] = useState<any>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    companyName: '',
  });

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setVerifyError('Invalid invite link');
      setVerifying(false);
      return;
    }

    axios.post('/api/admin/invites/verify', { token })
      .then(res => {
        setInviteData(res.data.invite);
        setFormData(prev => ({ ...prev, email: res.data.invite.email }));
        setVerifying(false);
      })
      .catch(err => {
        setVerifyError(err.response?.data?.error || 'Invalid or expired invite link');
        setVerifying(false);
      });
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await axios.post('/api/admin/invites/signup', {
        token,
        ...formData,
      });

      setSuccess('Account created successfully! Redirecting...');
      window.dispatchEvent(new Event('auth-change'));

      // Redirect based on role
      setTimeout(() => {
        if (inviteData.role === 'ADMIN' || inviteData.role === 'SUPERADMIN') {
          router.push('/admin');
        } else {
          router.push('/organization');
        }
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ffa800] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying invite...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (verifyError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invite</h1>
          <p className="text-gray-600 mb-6">{verifyError}</p>
          <Link href="/auth?type=organization"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ffa800] text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors">
            Go to Login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  const isOrgRole = inviteData?.role === 'ORGANIZATION';

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-orange-50 via-amber-50 to-white relative overflow-hidden">
      <Orbs />

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-16 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <img src="/adyapan-logo.png" alt="Adyapan" className="h-9 w-auto group-hover:scale-105 transition-transform" />
          </Link>

          {/* Invite info card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-[#ffa800] to-orange-600 rounded-2xl p-6 mb-6 text-white shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-1">You've Been Invited! 🎉</h2>
                <p className="text-sm text-white/90 mb-3">
                  {inviteData?.invitedBy} has invited you to join Adyapan as{' '}
                  <span className="font-bold">{inviteData?.role === 'ADMIN' ? 'an Admin' : inviteData?.role === 'SUPERADMIN' ? 'a Superadmin' : 'an Organization'}</span>.
                </p>
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <Mail className="w-3 h-3" />
                  <span className="font-mono">{inviteData?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
                  <Phone className="w-3 h-3" />
                  <span className="font-mono">{inviteData?.mobileHint}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              Complete Your Account 🚀
            </h1>
            <p className="text-gray-500 text-sm mt-1.5">
              Fill in your details to activate your account
            </p>
          </motion.div>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-start gap-2.5"
              >
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FloatInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              icon={User}
              required
            />

            <FloatInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              icon={Mail}
              disabled
              required
            />

            <FloatInput
              label="Mobile Number"
              name="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="e.g. +1234567890"
              icon={Phone}
              required
            />
            <p className="text-xs text-gray-500 -mt-2 pl-1">
              Must match the mobile number registered with this invite (ends with {inviteData?.mobileHint?.slice(-4)})
            </p>

            {isOrgRole && (
              <FloatInput
                label="Company / Organization Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                icon={Building2}
                required
              />
            )}

            <FloatInput
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="new-password"
              icon={Lock}
              required
              rightEl={
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <FloatInput
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              autoComplete="new-password"
              icon={Lock}
              required
              rightEl={
                <button type="button" onClick={() => setShowConfirmPassword(v => !v)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.02, boxShadow: '0 8px 30px rgba(255,168,0,0.4)' }}
              whileTap={loading ? {} : { scale: 0.98 }}
              className="w-full mt-6 py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #ffa800 0%, #ff6b00 100%)' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Security note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800">
                <p className="font-semibold mb-1">Secure Invite System</p>
                <p className="text-blue-700">
                  This invite link is single-use and expires on{' '}
                  {new Date(inviteData?.expiresAt).toLocaleDateString()}. Your email and mobile number must match the invite.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
