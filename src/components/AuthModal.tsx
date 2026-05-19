'use client';

import api from '@/lib/api';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, X, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** After successful auth, called with the user object */
  onSuccess: (user: { name: string; email: string; role: string }) => void;
  /** Pre-selected plan to show in the modal */
  planLabel?: string;
  planPrice?: string;
  /** Default tab */
  defaultTab?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, onSuccess, planLabel, planPrice, defaultTab = 'login' }: Props) {
  const [tab, setTab]               = useState<'login' | 'signup'>(defaultTab);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [showPwd, setShowPwd]       = useState(false);
  const [showCPwd, setShowCPwd]     = useState(false);

  /* login fields */
  const [lEmail, setLEmail]   = useState('');
  const [lPwd,   setLPwd]     = useState('');

  /* signup fields */
  const [sFirst, setSFirst]   = useState('');
  const [sLast,  setSLast]    = useState('');
  const [sEmail, setSEmail]   = useState('');
  const [sPhone, setSPhone]   = useState('');
  const [sPwd,   setSPwd]     = useState('');
  const [sCPwd,  setSCPwd]    = useState('');
  const [agreed, setAgreed]   = useState(false);

  /* reset on open */
  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setError(''); setSuccess('');
      setLEmail(''); setLPwd('');
      setSFirst(''); setSLast(''); setSEmail(''); setSPhone(''); setSPwd(''); setSCPwd('');
      setAgreed(false);
    }
  }, [isOpen, defaultTab]);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* â”€â”€ Login â”€â”€ */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email: lEmail, password: lPwd });
      setSuccess('Welcome back! Redirecting to checkoutâ€¦');
      window.dispatchEvent(new Event('auth-change'));
      setTimeout(() => { onSuccess(res.data.user); }, 800);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  /* â”€â”€ Signup â”€â”€ */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (sPwd !== sCPwd) { setError('Passwords do not match.'); return; }
    if (!agreed) { setError('Please accept the Terms & Conditions.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/api/auth/signup', {
        role: 'student',
        firstName: sFirst,
        lastName: sLast,
        email: sEmail,
        password: sPwd,
        confirmPassword: sCPwd,
      });
      setSuccess('Account created! Redirecting to checkoutâ€¦');
      window.dispatchEvent(new Event('auth-change'));
      setTimeout(() => { onSuccess(res.data.user); }, 800);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally { setLoading(false); }
  };

  const inp = 'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* saffron top bar */}
            <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #f97316, #fbbf24, #f97316)' }} />

            {/* close */}
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10">
              <X className="w-4 h-4 text-gray-600" />
            </button>

            {/* plan reminder banner */}
            {planLabel && (
              <div className="mx-5 mt-5 rounded-2xl bg-orange-50 border border-orange-100 px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">ðŸŽ¯</span>
                <div>
                  <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide">Selected Plan</p>
                  <p className="text-sm font-bold text-gray-800">{planLabel} {planPrice && <span className="text-orange-600">â€” {planPrice}</span>}</p>
                </div>
              </div>
            )}

            {/* header */}
            <div className="px-6 pt-5 pb-2 text-center">
              <img src="/adyapan-logo.png" alt="Adyapan" className="h-8 w-auto mx-auto mb-3" />
              <h2 className="text-xl font-black text-gray-900">
                {tab === 'login' ? 'Welcome Back ðŸ‘‹' : 'Create Your Account ðŸš€'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {tab === 'login' ? 'Sign in to continue your enrollment' : 'Join 20,000+ students on Adyapan'}
              </p>
            </div>

            {/* tabs */}
            <div className="mx-6 mt-4 flex rounded-xl bg-gray-100 p-1">
              {(['login', 'signup'] as const).map(t => (
                <button key={t} onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {t === 'login' ? 'Login' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* alerts */}
            <div className="px-6 mt-3">
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}
                  </motion.div>
                )}
                {success && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-start gap-2 rounded-xl bg-green-50 border border-green-200 px-3 py-2.5 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />{success}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* forms */}
            <div className="px-6 pb-6 pt-3">
              <AnimatePresence mode="wait">
                {tab === 'login' ? (
                  <motion.form key="login" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.18 }} onSubmit={handleLogin} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                      <input type="email" required value={lEmail} onChange={e => setLEmail(e.target.value)} placeholder="you@email.com" className={inp} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                      <div className="relative">
                        <input type={showPwd ? 'text' : 'password'} required value={lPwd} onChange={e => setLPwd(e.target.value)} placeholder="Your password" className={`${inp} pr-11`} />
                        <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <a href="/auth/forgot-password" className="text-xs text-orange-600 hover:underline">Forgot password?</a>
                    </div>
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                      {loading ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Signing inâ€¦</> : 'ðŸ”“ Login & Continue to Checkout'}
                    </motion.button>
                    <p className="text-center text-xs text-gray-500">
                      Don't have an account?{' '}
                      <button type="button" onClick={() => { setTab('signup'); setError(''); }} className="text-orange-600 font-semibold hover:underline">Sign Up Free</button>
                    </p>
                  </motion.form>
                ) : (
                  <motion.form key="signup" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }} onSubmit={handleSignup} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">First Name</label>
                        <input required value={sFirst} onChange={e => setSFirst(e.target.value)} placeholder="Rupesh" className={inp} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Last Name</label>
                        <input required value={sLast} onChange={e => setSLast(e.target.value)} placeholder="Kumar" className={inp} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                      <input type="email" required value={sEmail} onChange={e => setSEmail(e.target.value)} placeholder="you@email.com" className={inp} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
                      <div className="flex gap-2">
                        <span className="rounded-xl border border-gray-200 px-3 py-3 text-sm bg-gray-50 text-gray-600 shrink-0">ðŸ‡®ðŸ‡³ +91</span>
                        <input value={sPhone} onChange={e => setSPhone(e.target.value.replace(/\D/,'').slice(0,10))} placeholder="9876543210" className={inp} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                      <div className="relative">
                        <input type={showPwd ? 'text' : 'password'} required value={sPwd} onChange={e => setSPwd(e.target.value)} placeholder="Min 6 characters" className={`${inp} pr-11`} />
                        <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password</label>
                      <div className="relative">
                        <input type={showCPwd ? 'text' : 'password'} required value={sCPwd} onChange={e => setSCPwd(e.target.value)} placeholder="Repeat password" className={`${inp} pr-11`} />
                        <button type="button" onClick={() => setShowCPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showCPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="accent-orange-500 mt-0.5 shrink-0" />
                      I agree to Adyapan's <a href="#" className="text-orange-600 hover:underline">Terms</a> & <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>
                    </label>
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                      {loading ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Creating accountâ€¦</> : 'ðŸš€ Create Account & Enroll'}
                    </motion.button>
                    <p className="text-center text-xs text-gray-500">
                      Already have an account?{' '}
                      <button type="button" onClick={() => { setTab('login'); setError(''); }} className="text-orange-600 font-semibold hover:underline">Login</button>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* footer trust */}
            <div className="px-6 pb-5 flex items-center justify-center gap-4 text-xs text-gray-400 border-t border-gray-100 pt-3">
              <span>ðŸ”’ SSL Secured</span>
              <span>â€¢</span>
              <span>ðŸ‘¨â€ðŸŽ“ 20,000+ Students</span>
              <span>â€¢</span>
              <span>â­ 4.9 Rating</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
