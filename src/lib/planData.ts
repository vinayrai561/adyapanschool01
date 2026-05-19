/**
 * Centralized plan data — single source of truth for all plan details.
 * Used by: checkout page, pricing modal, payment API, order summary.
 * Dates are calculated dynamically from the current system date.
 */

export interface PlanDetail {
  id: string;
  label: string;           // "Career Pro Plan"
  name: string;            // "Adyapan Career Pro"
  price: number;           // base price in INR (before GST)
  originalPrice: number;   // crossed-out price
  discount: number;        // % discount shown
  duration: string;        // "4 Months"
  totalDays: number;       // 120
  startDate: string;       // "10th May 2026"
  endDate: string;         // "10th Aug 2026"
  classTime: string;       // "Morning 10:00 AM – 1:00 PM IST"
  validTill: string;       // "15th Aug 2026"
  emoji: string;           // plan icon
  tagline: string;         // short marketing line
  benefits: string[];      // feature list
  badge?: string;          // optional badge text e.g. "Most Popular"
  isPremium?: boolean;
}

/* ── Date helpers ── */

/** Format a Date as "15th May 2026" */
export function formatDate(date: Date): string {
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11 ? 'st' :
    day % 10 === 2 && day !== 12 ? 'nd' :
    day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  const month = date.toLocaleString('en-IN', { month: 'long' });
  const year = date.getFullYear();
  return `${day}${suffix} ${month} ${year}`;
}

/** Add days to a date */
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Add months to a date */
function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

/**
 * Generate dynamic plan dates from today.
 * startDate = today
 * endDate   = today + durationMonths
 * validTill = endDate + 5 days buffer
 */
function makeDates(durationMonths: number): {
  startDate: string;
  endDate: string;
  validTill: string;
  totalDays: number;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = addMonths(today, durationMonths);
  const valid = addDays(end, 5);
  const totalDays = Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return {
    startDate: formatDate(today),
    endDate:   formatDate(end),
    validTill: formatDate(valid),
    totalDays,
  };
}

/* ── Static plan config (no dates) ── */
interface PlanConfig {
  id: string;
  label: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  durationMonths: number;
  duration: string;
  classTime: string;
  emoji: string;
  tagline: string;
  benefits: string[];
  badge?: string;
  isPremium?: boolean;
}

const PLAN_CONFIGS: Record<string, PlanConfig> = {
  'plan-1': {
    id: 'plan-1',
    label: 'Starter Plan',
    name: 'Adyapan Starter',
    price: 3000,
    originalPrice: 4110,
    discount: 27,
    durationMonths: 2,
    duration: '2 Months',
    classTime: 'Evening 6:00 PM – 8:00 PM IST',
    emoji: '🌱',
    tagline: 'Perfect to get started',
    benefits: [
      'Live Online Classes',
      'Study Material & Notes',
      'Course Completion Certificate',
      'Community Support',
      'Doubt Clearing Sessions',
    ],
  },
  'plan-2': {
    id: 'plan-2',
    label: 'Standard Plan',
    name: 'Adyapan Standard',
    price: 3500,
    originalPrice: 4795,
    discount: 27,
    durationMonths: 2,
    duration: '2 Months',
    classTime: 'Morning 9:00 AM – 12:00 PM IST',
    emoji: '⚡',
    tagline: 'Build real skills fast',
    benefits: [
      'Live Online Classes',
      'Real-World Projects',
      'Internship Completion Certificate',
      'Priority Doubt Sessions',
      '1:1 Mentorship (2 sessions)',
      'Resume Review',
    ],
  },
  'plan-3': {
    id: 'plan-3',
    label: 'Professional Plan',
    name: 'Adyapan Professional',
    price: 5000,
    originalPrice: 6850,
    discount: 27,
    durationMonths: 3,
    duration: '3 Months',
    classTime: 'Morning 10:00 AM – 1:00 PM IST',
    emoji: '🚀',
    tagline: 'Career-ready in 3 months',
    badge: 'Most Popular',
    benefits: [
      'Live Online Classes',
      'Industry-Grade Projects',
      'Project Completion Certificate',
      'Placement Support',
      '1:1 Mentorship (5 sessions)',
      'Resume Building',
      'Mock Interview (1 round)',
    ],
  },
  'plan-4-premium': {
    id: 'plan-4-premium',
    label: 'Career Pro Plan',
    name: 'Adyapan Career Pro',
    price: 15000,
    originalPrice: 20550,
    discount: 27,
    durationMonths: 4,
    duration: '4 Months',
    classTime: 'Morning 10:00 AM – 1:00 PM IST',
    emoji: '👑',
    tagline: 'Full placement guarantee',
    badge: 'Best Value',
    isPremium: true,
    benefits: [
      'Live Online Classes',
      'Industry Projects',
      'Best Performance Certificate',
      'Placement Guarantee',
      '1:1 Mentorship (Unlimited)',
      'Resume Building',
      'Mock Interviews (3 rounds)',
      'LinkedIn Profile Optimization',
      'Referral to Hiring Partners',
    ],
  },
};

/** Build a full PlanDetail with live-calculated dates */
function buildPlan(config: PlanConfig): PlanDetail {
  const { startDate, endDate, validTill, totalDays } = makeDates(config.durationMonths);
  return {
    id:            config.id,
    label:         config.label,
    name:          config.name,
    price:         config.price,
    originalPrice: config.originalPrice,
    discount:      config.discount,
    duration:      config.duration,
    totalDays,
    startDate,
    endDate,
    classTime:     config.classTime,
    validTill,
    emoji:         config.emoji,
    tagline:       config.tagline,
    benefits:      config.benefits,
    badge:         config.badge,
    isPremium:     config.isPremium,
  };
}

/** Fallback plan if an unknown key is passed */
export const DEFAULT_PLAN_ID = 'plan-4-premium';

/** Get plan by ID with live dates — fallback to default if unknown */
export function getPlan(id: string): PlanDetail {
  const config = PLAN_CONFIGS[id] ?? PLAN_CONFIGS[DEFAULT_PLAN_ID];
  return buildPlan(config);
}

/** All plans as an array with live dates (for listing UIs) */
export const ALL_PLANS: PlanDetail[] = Object.values(PLAN_CONFIGS).map(buildPlan);

/**
 * @deprecated Use getPlan() instead. Kept for backward compatibility.
 */
export const PLAN_DATA: Record<string, PlanDetail> = Object.fromEntries(
  Object.entries(PLAN_CONFIGS).map(([k, v]) => [k, buildPlan(v)])
);
