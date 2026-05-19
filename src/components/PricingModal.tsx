'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Crown, Sparkles, X } from 'lucide-react';
import AuthModal from './AuthModal';
import { ALL_PLANS, type PlanDetail } from '@/lib/planData';

type PricingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Map planData to the shape PricingModal needs
const plans = ALL_PLANS.map(p => ({
  name: p.label,
  slug: p.id,
  price: `₹${p.price.toLocaleString('en-IN')}`,
  priceNum: p.price,
  cta: p.isPremium ? 'Get Premium Access' : `Buy ${p.label.split(' ')[0]}`,
  features: p.benefits.slice(0, 3),
  isPremium: p.isPremium ?? false,
  badge: p.badge,
  emoji: p.emoji,
  duration: p.duration,
}));

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<(typeof plans)[0] | null>(null);
  const [checking, setChecking] = useState(false);

  /* Lock body scroll while open */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onEsc);
    };
  }, [isOpen, onClose]);

  const handlePlanSelect = async (plan: typeof plans[0]) => {
    setChecking(true);
    sessionStorage.setItem(
      'selectedPlan',
      JSON.stringify({ id: plan.slug, name: plan.name, price: plan.priceNum, label: plan.price })
    );
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        onClose();
        router.push(`/checkout?plan=${encodeURIComponent(plan.slug)}`);
      } else {
        setPendingPlan(plan);
        setAuthOpen(true);
      }
    } catch {
      setPendingPlan(plan);
      setAuthOpen(true);
    } finally {
      setChecking(false);
    }
  };

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    onClose();
    if (pendingPlan) {
      router.push(`/checkout?plan=${encodeURIComponent(pendingPlan.slug)}`);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          /* ── Backdrop ── */
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Clickable backdrop */}
            <button
              type="button"
              aria-label="Close pricing modal"
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={onClose}
            />

            {/* ── Modal panel ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={[
                /* Positioning & sizing */
                'relative z-10 my-auto',
                'w-[95vw] max-w-[1400px]',
                /* Appearance */
                'rounded-2xl sm:rounded-3xl',
                'border border-white/30',
                'bg-white/90 backdrop-blur-xl',
                'shadow-2xl',
                /* Prevent overflow */
                'overflow-hidden',
              ].join(' ')}
            >
              {/* ── Scrollable inner area ── */}
              <div className="max-h-[92vh] overflow-y-auto overscroll-contain px-4 py-6 sm:px-6 sm:py-8 md:px-8">

                {/* Close button — sticky top-right */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-3 top-3 z-20 rounded-full border border-gray-200 bg-white p-1.5 text-gray-600 shadow-sm transition-all hover:bg-gray-900 hover:text-white sm:right-4 sm:top-4 sm:p-2"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* ── Header ── */}
                <div className="mb-6 pr-8 text-center sm:mb-8 sm:pr-0">
                  <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
                    Limited Seats Available
                  </p>
                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                    Choose Your Growth Plan
                  </h2>
                  <p className="mt-2 text-xs text-gray-600 sm:text-sm lg:text-base">
                    Pick the plan that matches your career speed and unlock premium outcomes.
                  </p>
                </div>

                {/* ── Plans grid ── */}
                {/*
                  mobile  : 1 column
                  tablet  : 2 columns  (sm: 640px+)
                  desktop : 4 columns  (lg: 1024px+)
                */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.slug}
                      className={[
                        'group relative flex flex-col rounded-2xl border p-4 transition-all duration-300',
                        'hover:-translate-y-1 hover:shadow-2xl',
                        'sm:p-5',
                        plan.isPremium
                          ? 'border-orange-300 bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 text-white shadow-lg shadow-orange-300/40 lg:scale-[1.02]'
                          : 'border-gray-200 bg-white text-gray-900 shadow-md hover:border-orange-300',
                      ].join(' ')}
                    >
                      {/* Best Value badge */}
                      {plan.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
                          <span className="inline-flex items-center gap-1">
                            <Crown className="h-3.5 w-3.5" /> {plan.badge}
                          </span>
                        </div>
                      )}

                      {/* Plan name + price */}
                      <p className="text-sm font-semibold opacity-90">{plan.emoji} {plan.name}</p>
                      <p className="mt-1.5 text-2xl font-extrabold sm:text-3xl">{plan.price}</p>
                      <p className="text-xs opacity-70 mt-0.5">{plan.duration}</p>

                      {/* Features */}
                      <ul className="mt-4 flex-1 space-y-2 text-sm">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check
                              className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                                plan.isPremium ? 'text-white' : 'text-orange-600'
                              }`}
                            />
                            <span className="break-words leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA button — full width, always at bottom */}
                      <button
                        type="button"
                        disabled={checking}
                        onClick={() => handlePlanSelect(plan)}
                        className={[
                          'mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold',
                          'transition-all duration-300 disabled:opacity-60',
                          plan.isPremium
                            ? 'bg-white text-orange-600 hover:bg-black hover:text-white'
                            : 'bg-orange-500 text-white hover:bg-black',
                        ].join(' ')}
                      >
                        {checking ? '…' : plan.cta}
                      </button>
                    </div>
                  ))}
                </div>

                {/* ── Footer note ── */}
                <p className="mt-6 text-center text-xs text-gray-400">
                  All plans include GST. Secure payment via Razorpay.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth modal — shown when user is not logged in */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        planLabel={pendingPlan?.name}
        planPrice={pendingPlan?.price}
        defaultTab="login"
      />
    </>
  );
}
