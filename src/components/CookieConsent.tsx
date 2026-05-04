'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/* ─── Types ──────────────────────────────────────────────────── */
interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const defaultPrefs: CookiePreferences = {
  necessary: true,
  analytics: true,
  marketing: false,
  functional: true,
};

/* ─── Toggle switch ──────────────────────────────────────────── */
function Toggle({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffa800] ${
        disabled
          ? 'bg-[#ffa800] cursor-not-allowed opacity-70'
          : checked
          ? 'bg-[#ffa800] cursor-pointer'
          : 'bg-gray-200 cursor-pointer'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

/* ─── Cookie row (landscape: icon + text + toggle in one line) ── */
function CookieRow({
  icon,
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  icon: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-lg flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-gray-800">{label}</span>
          {disabled && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#ffa800]/15 text-[#ffa800] uppercase tracking-wide">
              Required
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-500 leading-snug truncate">{description}</p>
      </div>
      <Toggle checked={checked} disabled={disabled} onChange={onChange} />
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function CookieConsent() {
  // Always show on every page load / refresh
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(defaultPrefs);

  useEffect(() => {
    // Show after a short delay so the page renders first
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  const toggle = (key: keyof CookiePreferences) => (val: boolean) => {
    if (key === 'necessary') return;
    setPrefs(p => ({ ...p, [key]: val }));
  };

  const acceptAll = () => {
    setPrefs({ necessary: true, analytics: true, marketing: true, functional: true });
    setVisible(false);
  };

  const saveSelected = () => setVisible(false);

  const rejectAll = () => {
    setPrefs({ necessary: true, analytics: false, marketing: false, functional: false });
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* ── Semi-transparent backdrop ── */}
          <motion.div
            key="cookie-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[998] bg-black/30 backdrop-blur-[2px]"
          />

          {/* ── White landscape card — centred on screen ── */}
          <motion.div
            key="cookie-banner"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed z-[999] inset-x-4 bottom-4 sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-3xl"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

              {/* ── Top orange stripe ── */}
              <div className="h-1 w-full bg-gradient-to-r from-[#ffa800] via-[#ff6b00] to-[#ffa800]" />

              {!showCustomize ? (
                /* ════════════════════════════════════════════════
                   LANDSCAPE BANNER — two columns side by side
                ════════════════════════════════════════════════ */
                <div className="flex flex-col sm:flex-row items-stretch">

                  {/* Left — text */}
                  <div className="flex-1 px-6 py-5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🍪</span>
                      <h3 className="text-gray-900 font-extrabold text-lg leading-tight">
                        We use cookies
                      </h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Adyapan uses cookies to improve your experience, analyse traffic, and
                      personalise content. You can accept all, customise your choices, or
                      reject non-essential cookies.{' '}
                      <Link
                        href="/privacy"
                        className="text-[#ffa800] font-semibold hover:underline"
                      >
                        Privacy Policy ↗
                      </Link>
                    </p>

                    {/* Cookie type pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {[
                        { label: '🔒 Necessary', active: true },
                        { label: '📊 Analytics', active: true },
                        { label: '⚙️ Functional', active: true },
                        { label: '📣 Marketing', active: false },
                      ].map(({ label, active }) => (
                        <span
                          key={label}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                            active
                              ? 'border-[#ffa800]/40 text-[#ffa800] bg-[#ffa800]/8'
                              : 'border-gray-200 text-gray-400 bg-gray-50'
                          }`}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-px bg-gray-100 my-4" />

                  {/* Right — buttons */}
                  <div className="flex flex-col justify-center gap-2.5 px-6 py-5 sm:w-52 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={acceptAll}
                      className="w-full py-2.5 bg-[#ffa800] hover:bg-[#e69500] text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-[#ffa800]/30"
                    >
                      ✓ Accept All
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowCustomize(true)}
                      className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
                    >
                      ⚙ Customize
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={rejectAll}
                      className="w-full py-2 text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors underline underline-offset-2"
                    >
                      Reject non-essential
                    </motion.button>
                  </div>
                </div>

              ) : (
                /* ════════════════════════════════════════════════
                   CUSTOMIZE PANEL — landscape grid of toggles
                ════════════════════════════════════════════════ */
                <div className="px-6 py-5">

                  {/* Header */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚙️</span>
                      <h3 className="text-gray-900 font-extrabold text-base">
                        Cookie Preferences
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowCustomize(false)}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors text-lg leading-none"
                      aria-label="Back"
                    >
                      ←
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">
                    Toggle each category. Necessary cookies are always active.
                  </p>

                  {/* 2-column grid of toggles on sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8">
                    <CookieRow
                      icon="🔒"
                      label="Necessary"
                      description="Auth, sessions, security — always required"
                      checked={true}
                      disabled
                    />
                    <CookieRow
                      icon="📊"
                      label="Analytics"
                      description="Page views, clicks, scroll depth"
                      checked={prefs.analytics}
                      onChange={toggle('analytics')}
                    />
                    <CookieRow
                      icon="⚙️"
                      label="Functional"
                      description="Saved preferences, chat, language"
                      checked={prefs.functional}
                      onChange={toggle('functional')}
                    />
                    <CookieRow
                      icon="📣"
                      label="Marketing"
                      description="Ad targeting, campaign measurement"
                      checked={prefs.marketing}
                      onChange={toggle('marketing')}
                    />
                  </div>

                  {/* Action row */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-5 pt-4 border-t border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={acceptAll}
                      className="flex-1 py-2.5 bg-[#ffa800] hover:bg-[#e69500] text-white text-sm font-bold rounded-xl transition-colors"
                    >
                      Accept All
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={saveSelected}
                      className="flex-1 py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      Save My Choices
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={rejectAll}
                      className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm font-semibold rounded-xl transition-colors"
                    >
                      Reject All
                    </motion.button>
                  </div>

                  <p className="text-[11px] text-gray-400 text-center mt-3">
                    Read our{' '}
                    <Link href="/privacy" className="text-[#ffa800] hover:underline font-medium">
                      Privacy Policy
                    </Link>{' '}
                    for full details.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
