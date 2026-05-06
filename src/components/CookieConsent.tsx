'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const STORAGE_KEY = 'adyapan_cookie_consent';

interface CookiePrefs {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const defaultPrefs: CookiePrefs = {
  necessary: true,
  analytics: true,
  marketing: false,
  functional: true,
};

function Toggle({ checked, disabled, onChange }: {
  checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative flex-shrink-0 w-9 h-5 rounded-full transition-colors duration-300 focus:outline-none ${
        disabled ? 'bg-[#ffa800] cursor-not-allowed opacity-70'
        : checked  ? 'bg-[#ffa800] cursor-pointer'
        : 'bg-gray-200 cursor-pointer'
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
        checked ? 'translate-x-4' : 'translate-x-0'
      }`} />
    </button>
  );
}

export default function CookieConsent() {
  const [visible,       setVisible]       = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [prefs,         setPrefs]         = useState<CookiePrefs>(defaultPrefs);

  /* ── Show only if user hasn't consented yet ── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return; // already consented — never show again
    } catch {}
    // First visit — show after short delay
    const t = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(t);
  }, []);

  const save = (p: CookiePrefs) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
    setVisible(false);
  };

  const acceptAll  = () => save({ necessary: true, analytics: true, marketing: true, functional: true });
  const rejectAll  = () => save({ necessary: true, analytics: false, marketing: false, functional: false });
  const saveChoice = () => save(prefs);

  const toggle = (key: keyof CookiePrefs) => (val: boolean) => {
    if (key === 'necessary') return;
    setPrefs(p => ({ ...p, [key]: val }));
  };

  const cookieTypes = [
    { key: 'necessary' as const,  label: 'Necessary',  desc: 'Auth, sessions, security',       required: true  },
    { key: 'analytics' as const,  label: 'Analytics',  desc: 'Page views & usage data',        required: false },
    { key: 'functional' as const, label: 'Functional', desc: 'Preferences & settings',         required: false },
    { key: 'marketing' as const,  label: 'Marketing',  desc: 'Ad targeting & measurement',     required: false },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
            style={{ zIndex: 998 }}
          />

          {/* Banner */}
          <motion.div
            key="banner"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            style={{ zIndex: 999 }}
            className="fixed bottom-3 left-3 right-3 sm:bottom-5 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[min(96vw,720px)]"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

              {/* Orange top bar */}
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#ffa800,#ff6b00,#ffa800)' }} />

              {!showCustomize ? (
                /* ── Main banner ── */
                <div className="p-4 sm:p-5">

                  {/* Header row */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-gray-900 text-base leading-tight">We use cookies</h3>
                      <p className="text-gray-500 text-xs leading-relaxed mt-0.5">
                        Adyapan uses cookies to improve your experience and personalise content.{' '}
                        <Link href="/privacy" className="text-[#ffa800] font-semibold hover:underline">
                          Privacy Policy
                        </Link>
                      </p>
                    </div>
                  </div>

                  {/* Cookie type pills — wrap on small screens */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cookieTypes.map(({ key, label, required }) => (
                      <span key={key}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                          required || prefs[key]
                            ? 'border-orange-300 text-orange-600 bg-orange-50'
                            : 'border-gray-200 text-gray-400 bg-gray-50'
                        }`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons — stack on mobile, row on sm+ */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={acceptAll}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
                      style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}
                    >
                      Accept All
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setShowCustomize(true)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Customize
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={rejectAll}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      Reject
                    </motion.button>
                  </div>
                </div>

              ) : (
                /* ── Customize panel ── */
                <div className="p-4 sm:p-5">

                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-gray-900 text-base">Cookie Preferences</h3>
                    <button
                      onClick={() => setShowCustomize(false)}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm transition-colors"
                      aria-label="Back"
                    >
                      ←
                    </button>
                  </div>

                  {/* Toggle rows — 2 col on sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6 mb-4">
                    {cookieTypes.map(({ key, label, desc, required }) => (
                      <div key={key} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0 sm:[&:nth-last-child(-n+2)]:border-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-800">{label}</span>
                            {required && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 uppercase tracking-wide">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400 leading-snug">{desc}</p>
                        </div>
                        <Toggle
                          checked={required ? true : prefs[key]}
                          disabled={required}
                          onChange={required ? undefined : toggle(key)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={acceptAll}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
                      style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}
                    >
                      Accept All
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={saveChoice}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      Save Choices
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={rejectAll}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 border border-gray-200 transition-colors"
                    >
                      Reject All
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
