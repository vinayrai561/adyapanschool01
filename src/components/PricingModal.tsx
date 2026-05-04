'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Crown, Sparkles, X } from 'lucide-react';
import AuthModal from './AuthModal';

type PricingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Plan = {
  name: string;
  slug: string;
  price: string;
  priceNum: number;
  cta: string;
  features: string[];
  isPremium?: boolean;
};

const plans: Plan[] = [
  {
    name: 'Plan 1',
    slug: 'plan-1',
    price: '₹3,000',
    priceNum: 3000,
    cta: 'Buy Basic',
    features: ['Industry-ready training', 'Project completion certificate', 'Community support'],
  },
  {
    name: 'Plan 2',
    slug: 'plan-2',
    price: '₹3,500',
    priceNum: 3500,
    cta: 'Buy Standard',
    features: ['Live projects + mentoring', 'Internship completion certificate', 'Priority doubt sessions'],
  },
  {
    name: 'Plan 3',
    slug: 'plan-3',
    price: '₹5,000',
    priceNum: 5000,
    cta: 'Buy Pro',
    features: ['3-month learning path', 'Mock interviews + resume review', 'Job-ready capstone project'],
  },
  {
    name: 'Plan 4',
    slug: 'plan-4-premium',
    price: '₹15,000',
    priceNum: 15000,
    cta: 'Get Premium Access',
    isPremium: true,
    features: ['Premium career support', 'Referral opportunities', 'Placement-focused coaching'],
  },
];

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEsc);
    return () => { document.body.style.overflow = 'unset'; window.removeEventListener('keydown', onEsc); };
  }, [isOpen, onClose]);

  const handlePlanSelect = async (plan: Plan) => {
    setChecking(true);
    // Save plan to sessionStorage for post-auth redirect
    sessionStorage.setItem('selectedPlan', JSON.stringify({ id: plan.slug, name: plan.name, price: plan.priceNum, label: plan.price }));

    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        // Already logged in — go straight to checkout
        onClose();
        router.push(`/checkout?plan=${encodeURIComponent(plan.slug)}`);
      } else {
        // Not logged in — show auth modal
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
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close pricing modal"
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative z-10 w-full max-w-6xl overflow-hidden rounded-3xl border border-white/30 bg-white/75 p-5 shadow-2xl backdrop-blur-xl sm:p-8"
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition-all hover:bg-gray-900 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-8 text-center">
                <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                  <Sparkles className="h-3.5 w-3.5" /> Limited Seats Available
                </p>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Choose Your Growth Plan</h2>
                <p className="mt-2 text-sm text-gray-600 sm:text-base">
                  Pick the plan that matches your career speed and unlock premium outcomes.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {plans.map((plan) => (
                  <div
                    key={plan.slug}
                    className={[
                      'group relative rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl',
                      plan.isPremium
                        ? 'scale-[1.02] border-orange-300 bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 text-white shadow-orange-300/40'
                        : 'border-gray-200 bg-white/90 text-gray-900 shadow-lg hover:border-orange-300',
                    ].join(' ')}
                  >
                    {plan.isPremium && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
                        <span className="inline-flex items-center gap-1">
                          <Crown className="h-3.5 w-3.5" /> Best Value
                        </span>
                      </div>
                    )}

                    <p className="text-sm font-semibold opacity-90">{plan.name}</p>
                    <p className="mt-2 text-3xl font-extrabold">{plan.price}</p>

                    <ul className="mt-4 space-y-2 text-sm">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className={`mt-0.5 h-4 w-4 ${plan.isPremium ? 'text-white' : 'text-orange-600'}`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      disabled={checking}
                      onClick={() => handlePlanSelect(plan)}
                      className={[
                        'mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 disabled:opacity-60',
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
