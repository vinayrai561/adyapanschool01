'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── helpers ── */
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 });
const GST = 0.18;

/* ── plan data ── */
const PLANS: Record<string, { label: string; name: string; price: number; original: number; discount: number; duration: string; features: string[] }> = {
  'plan-1': { label: 'Starter Plan', name: 'Adyapan Starter', price: 3000, original: 4110, discount: 27, duration: '2 Months', features: ['Live Classes', 'Study Material', 'Certificate'] },
  'plan-2': { label: 'Standard Plan', name: 'Adyapan Standard', price: 3500, original: 4795, discount: 27, duration: '2 Months', features: ['Live Classes', 'Projects', 'Certificate', 'Mentorship'] },
  'plan-3': { label: 'Professional Plan', name: 'Adyapan Professional', price: 5000, original: 6850, discount: 27, duration: '3 Months', features: ['Live Classes', 'Real Projects', 'Certificate', 'Placement Support', 'Mentorship'] },
  'plan-4-premium': { label: 'Career Pro Plan', name: 'Adyapan Career Pro', price: 15000, original: 20550, discount: 27, duration: '4 Months', features: ['Live Classes', 'Industry Projects', 'Certificate', 'Placement Guarantee', '1:1 Mentorship', 'Resume Building', 'Mock Interviews'] },
};

/* ── coupons ── */
const COUPONS: Record<string, { type: 'percent' | 'flat'; value: number; label: string }> = {
  'ADYAPAN5':  { type: 'percent', value: 5,    label: 'Extra 5% Off' },
  'STUDENT10': { type: 'flat',    value: 1000,  label: '₹1,000 Off' },
  'CAREER20':  { type: 'percent', value: 20,    label: '20% Off Premium' },
};

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh'];
const BANKS = ['State Bank of India','HDFC Bank','ICICI Bank','Axis Bank','Kotak Mahindra Bank','Punjab National Bank','Bank of Baroda','Yes Bank','IndusInd Bank'];

type PayMethod = 'upi' | 'card' | 'netbanking' | 'emi' | 'wallet';
type Step = 'details' | 'payment' | 'success';

declare global { interface Window { Razorpay: any } }

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planKey = searchParams.get('plan') || 'plan-4-premium';
  const plan = PLANS[planKey] ?? PLANS['plan-4-premium'];

  /* ── Auth guard: redirect to auth if not logged in ── */
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; email: string; phone?: string; state?: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.user) {
          // Save plan and redirect to auth
          sessionStorage.setItem('selectedPlan', JSON.stringify({ id: planKey }));
          router.replace(`/auth?redirect=/checkout?plan=${encodeURIComponent(planKey)}`);
        } else {
          setLoggedInUser({ name: data.user.name || '', email: data.user.email || '', phone: data.user.phone || '', state: '' });
          setAuthChecked(true);
        }
      })
      .catch(() => {
        sessionStorage.setItem('selectedPlan', JSON.stringify({ id: planKey }));
        router.replace(`/auth?redirect=/checkout?plan=${encodeURIComponent(planKey)}`);
      });
  }, [planKey, router]);

  /* ── state ── */
  const [step, setStep] = useState<Step>('details');
  const [payMethod, setPayMethod] = useState<PayMethod>('upi');
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [summaryOpen, setSummaryOpen] = useState(false); // mobile accordion

  /* details form — autofill from logged-in user */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  /* autofill when user data arrives */
  useEffect(() => {
    if (loggedInUser) {
      setName(loggedInUser.name || '');
      setEmail(loggedInUser.email || '');
      setPhone(loggedInUser.phone || '');
    }
  }, [loggedInUser]);
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [college, setCollege] = useState('');
  const [hasGst, setHasGst] = useState(false);
  const [gstNum, setGstNum] = useState('');
  const [referral, setReferral] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* coupon */
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState<null | { code: string; label: string; discount: number }>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  /* card */
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardMM, setCardMM] = useState('');
  const [cardYY, setCardYY] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bank, setBank] = useState('');

  /* pricing */
  const basePrice = plan.price;
  const couponDiscount = couponApplied ? couponApplied.discount : 0;
  const afterCoupon = Math.max(0, basePrice - couponDiscount);
  const gstAmt = afterCoupon * GST;
  const grandTotal = afterCoupon + gstAmt;
  const savings = plan.original - afterCoupon;

  /* ── countdown timer ── */
  const [timeLeft, setTimeLeft] = useState(3600);
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const mm = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');

  /* ── validate step 1 ── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email is required';
    if (!phone.trim() || phone.length < 10) e.phone = 'Valid 10-digit phone required';
    if (!state) e.state = 'Please select your state';
    if (!agreed) e.agreed = 'Please accept terms & conditions';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setStep('payment');
  };

  /* ── apply coupon ── */
  const applyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    const code = couponInput.trim().toUpperCase();
    if (!code) { setCouponError('Enter a coupon code'); return; }
    const c = COUPONS[code];
    if (!c) { setCouponError('Invalid coupon code'); return; }
    const disc = c.type === 'percent' ? Math.round(basePrice * c.value / 100) : c.value;
    setCouponApplied({ code, label: c.label, discount: disc });
    setCouponSuccess(`🎉 "${code}" applied — ${c.label}`);
  };

  const removeCoupon = () => {
    setCouponApplied(null);
    setCouponInput('');
    setCouponSuccess('');
  };

  /* ── Razorpay payment ── */
  const loadRazorpay = () => new Promise<boolean>(res => {
    if (window.Razorpay) return res(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => res(true);
    s.onerror = () => res(false);
    document.body.appendChild(s);
  });

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPaying(true);
    try {
      /* ── 1. Create order via Next.js API route ── */
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Order creation failed.');
        setPaying(false);
        return;
      }
      const { orderId, amount, currency, keyId } = await res.json();

      /* ── 2. LIVE MODE (card/netbanking/etc) — open Razorpay checkout ── */
      const loaded = await loadRazorpay();
      if (!loaded) { setError('Payment gateway failed to load.'); setPaying(false); return; }

      const rzp = new window.Razorpay({
        key: keyId, amount, currency, order_id: orderId,
        name: 'Adyapan Skills', description: plan.name,
        prefill: { name, email, contact: phone },
        theme: { color: '#f97316' },
        handler: async (response: any) => {
          const vRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              customerName:  name,
              customerEmail: email,
              customerPhone: phone,
              planName:      plan.name,
              planLabel:     plan.label,
              grandTotal,
            }),
          });
          const vData = await vRes.json();
          if (vData.success) {
            setStep('success');
            setTimeout(() => router.push('/dashboard/student'), 2500);
          }
          else { setError('Payment verification failed.'); setPaying(false); }
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.on('payment.failed', (r: any) => { setError(r.error.description); setPaying(false); });
      rzp.open();
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.');
      setPaying(false);
    }
  };

  /* ── input class helper ── */
  const inp = (err?: string) => `w-full rounded-xl border ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'} px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all`;

  /* ── ORDER SUMMARY ── */
  const OrderSummary = ({ compact = false }: { compact?: boolean }) => (
    <div className={`rounded-2xl border border-orange-100 bg-gradient-to-b from-amber-50 to-orange-50 shadow-lg ${compact ? '' : 'sticky top-24'}`}>
      {/* header */}
      <div className="px-5 py-4 border-b border-orange-100 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-gray-800">
          <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          Order Summary
        </div>
        {step === 'payment' && <button onClick={() => setStep('details')} className="text-xs text-orange-600 hover:underline font-medium">Edit</button>}
      </div>

      <div className="p-5 space-y-4">
        {/* plan badge */}
        <span className="inline-block rounded-full bg-orange-100 border border-orange-200 px-3 py-1 text-xs font-semibold text-orange-700">{plan.label}</span>

        {/* plan name + meta */}
        <div>
          <p className="font-bold text-gray-900 text-base">{plan.name}</p>
          <div className="mt-2 space-y-1.5 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">📅 <span>10th May – 10th Aug 2026</span></div>
            <div className="flex items-center gap-1.5">🕐 <span>Morning 10:00 AM – 1:00 PM IST</span></div>
            <div className="flex items-center gap-1.5">✅ <span>Valid till 15th Aug 2026</span>
              <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 font-semibold">120 days</span>
            </div>
            <div className="flex items-center gap-1.5">⏱ <span>Duration: {plan.duration}</span></div>
          </div>
        </div>

        {/* features */}
        <div className="space-y-1">
          {plan.features.map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">✓</span>
              {f}
            </div>
          ))}
        </div>

        {/* pricing */}
        <div className="rounded-xl bg-white border border-orange-100 p-3 space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Program Fees</span>
            <div className="flex items-center gap-2">
              <span className="rounded bg-green-100 text-green-700 text-xs font-bold px-1.5 py-0.5">{plan.discount}% Off</span>
              <span className="line-through text-gray-400 text-xs">{fmt(plan.original)}</span>
              <span className="font-bold text-gray-900">{fmt(basePrice)}</span>
            </div>
          </div>
          {couponApplied && (
            <div className="flex items-center justify-between text-sm text-green-700">
              <span>Coupon ({couponApplied.code})</span>
              <span className="font-semibold">− {fmt(couponApplied.discount)}</span>
            </div>
          )}
        </div>

        {/* coupon input */}
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">🎟 Promo Code</p>
          {couponApplied ? (
            <div className="flex items-center justify-between rounded-xl bg-green-50 border border-green-200 px-3 py-2">
              <span className="text-xs font-semibold text-green-700">{couponSuccess}</span>
              <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline ml-2">Remove</button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code here"
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <button onClick={applyCoupon}
                  className="rounded-xl bg-orange-500 text-white px-4 py-2 text-xs font-bold hover:bg-orange-600 transition-colors">
                  APPLY
                </button>
              </div>
              {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
              <div className="mt-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center text-green-600 shrink-0">◎</span>
                <div>
                  <p className="font-bold">APPLY COUPON</p>
                  <p>Grab an Extra 5% off — use <strong>ADYAPAN5</strong></p>
                  <p className="text-gray-400">Expires on: 30-May-2026</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* billing */}
        <div className="border-t border-orange-100 pt-3 space-y-2 text-sm">
          <p className="font-bold text-gray-700 text-xs uppercase tracking-wide">Billing Details</p>
          <div className="flex justify-between text-gray-600"><span>Total Price</span><span>{fmt(afterCoupon)}</span></div>
          <div className="flex justify-between text-gray-500 text-xs"><span>GST (18.00%)</span><span>{fmt(gstAmt)}</span></div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-orange-100">
            <span>Grand Total</span><span className="text-orange-600">{fmt(grandTotal)}</span>
          </div>
        </div>

        {/* savings */}
        <div className="rounded-xl bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700 flex items-center gap-2">
          🎉 You are saving <strong>{fmt(savings)}</strong> on this purchase!
        </div>

        {/* trust */}
        <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
          <span>🔒 SSL Secured</span>
          <span>•</span>
          <span>💳 PCI-DSS</span>
          <span>•</span>
          <span>↩ Refund Policy</span>
        </div>
      </div>
    </div>
  );

  /* ── Loading / auth check screen ── */
  if (!authChecked) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fff7ed, #fef3c7)' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Verifying your session…</p>
        </div>
      </main>
    );
  }

  /* ── SUCCESS SCREEN ── */
  if (step === 'success') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white flex items-center justify-center px-4 py-16">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          className="max-w-md w-full text-center bg-white rounded-3xl shadow-2xl p-10 border border-orange-100">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Payment Successful! 🎉</h1>
          <p className="text-gray-500 mb-1">Welcome to <span className="text-orange-600 font-bold">Adyapan Skills</span></p>
          <p className="text-sm text-gray-400 mb-2">A confirmation has been sent to <strong>{email}</strong></p>
          <p className="text-xs text-orange-500 font-semibold mb-6 animate-pulse">Redirecting to your dashboard…</p>
          <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4 mb-6 text-left space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Plan</span><span className="font-semibold text-gray-800">{plan.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amount Paid</span><span className="font-bold text-orange-600">{fmt(grandTotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-semibold text-gray-800">{plan.duration}</span></div>
          </div>
          <Link href="/dashboard/student"
            className="block w-full py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
            Go to Dashboard →
          </Link>
          <Link href="/programs" className="block mt-3 text-sm text-gray-400 hover:text-gray-600">Browse more courses</Link>
        </motion.div>
      </main>
    );
  }

  /* ── MAIN RENDER ── */
  return (
    <main className="min-h-screen px-4 py-8" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fff 100%)' }}>
      <div className="max-w-6xl mx-auto">

        {/* ── Page header ── */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/programs" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Programs
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-green-600 font-semibold">🔒 Secure Checkout</span>
          </div>
        </div>

        {/* ── Logged-in banner ── */}
        {loggedInUser && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-2xl bg-white border border-green-100 shadow-sm px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {loggedInUser.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="text-sm font-semibold text-gray-800">{loggedInUser.name} <span className="text-gray-400 font-normal">({loggedInUser.email})</span></p>
              </div>
            </div>
            <span className="text-xs text-green-600 font-semibold flex items-center gap-1">✅ Verified</span>
          </motion.div>
        )}

        {/* ── Urgency bar ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #f97316, #dc2626)' }}>
          <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4 text-white text-xs font-semibold">
              <span>🔥 Only 12 Seats Left</span>
              <span className="hidden sm:block">•</span>
              <span>👨‍🎓 20,000+ Students Joined</span>
              <span className="hidden sm:block">•</span>
              <span>⭐ 4.9 Rating</span>
            </div>
            <div className="flex items-center gap-2 text-white text-xs font-bold">
              <span>⏰ Offer ends in:</span>
              <span className="bg-white/20 rounded-lg px-2 py-1 font-mono">{hh}:{mm}:{ss}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Mobile summary accordion ── */}
        <div className="lg:hidden mb-4">
          <button onClick={() => setSummaryOpen(v => !v)}
            className="w-full flex items-center justify-between rounded-2xl bg-white border border-orange-100 shadow-sm px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-orange-500 font-bold text-sm">Order Summary</span>
              <span className="text-xs text-gray-500">{plan.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-orange-600 text-sm">{fmt(grandTotal)}</span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${summaryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </button>
          <AnimatePresence>
            {summaryOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="pt-3"><OrderSummary compact /></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Main grid ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── LEFT: Steps ── */}
          <div className="flex-1 space-y-4 min-w-0">

            {/* STEP 1 */}
            <motion.div layout className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
              {/* header */}
              <div className={`px-6 py-4 flex items-center gap-3 ${step === 'details' ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-white border-b border-gray-100'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${step === 'details' ? 'bg-white text-orange-600' : 'bg-green-500 text-white'}`}>
                  {step !== 'details' ? '✓' : '1'}
                </span>
                <h2 className={`font-bold text-base ${step === 'details' ? 'text-white' : 'text-gray-700'}`}>Basic Details</h2>
                {step === 'payment' && <span className="ml-auto text-xs text-gray-400">{email} ✅</span>}
              </div>

              <AnimatePresence>
                {step === 'details' && (
                  <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onSubmit={handleProceed} className="p-6 space-y-5">

                    {/* name + phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="Rupesh Kumar" className={inp(errors.name)} />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                          <select className="rounded-xl border border-gray-200 px-2 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 shrink-0">
                            <option>🇮🇳 +91</option>
                          </select>
                          <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/,'').slice(0,10))} placeholder="9876543210" className={inp(errors.phone)} />
                        </div>
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* email */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                        Email ID <span className="text-red-500">*</span>
                        {email && loggedInUser?.email === email && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">✓ Saved</span>
                        )}
                      </label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="you@email.com" 
                        className={inp(errors.email)}
                        readOnly={loggedInUser?.email === email}
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                      {email && loggedInUser?.email === email && (
                        <p className="text-[11px] text-green-600 mt-1">✓ Using your registered email</p>
                      )}
                    </div>

                    {/* state + city */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">State <span className="text-red-500">*</span></label>
                        <select value={state} onChange={e => setState(e.target.value)} className={inp(errors.state)}>
                          <option value="">Select State</option>
                          {STATES.map(s => <option key={s}>{s}</option>)}
                        </select>
                        {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">City</label>
                        <input value={city} onChange={e => setCity(e.target.value)} placeholder="Your city" className={inp()} />
                      </div>
                    </div>

                    {/* college */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">College / Institution <span className="text-gray-400">(Optional)</span></label>
                      <input value={college} onChange={e => setCollege(e.target.value)} placeholder="e.g. IIT Delhi, VIT Vellore" className={inp()} />
                    </div>

                    {/* referral */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Referral Code <span className="text-gray-400">(Optional)</span></label>
                      <input value={referral} onChange={e => setReferral(e.target.value.toUpperCase())} placeholder="e.g. REF123" className={inp()} />
                    </div>

                    {/* GST */}
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                        <input type="checkbox" checked={hasGst} onChange={e => setHasGst(e.target.checked)} className="accent-orange-500 w-4 h-4" />
                        I have a GST Number (Optional)
                      </label>
                      <AnimatePresence>
                        {hasGst && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-2">
                            <input value={gstNum} onChange={e => setGstNum(e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" className={inp()} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* T&C */}
                    <div>
                      <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer select-none">
                        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="accent-orange-500 w-4 h-4 mt-0.5 shrink-0" />
                        <span>I agree to the <a href="#" className="text-orange-600 hover:underline">Terms of Use</a>, <a href="#" className="text-orange-600 hover:underline">Refund Policy</a> and <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a> of Adyapan Skills. <span className="text-red-500">*</span></span>
                      </label>
                      {errors.agreed && <p className="text-xs text-red-500 mt-1">{errors.agreed}</p>}
                    </div>

                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto px-10 py-3.5 rounded-xl font-bold text-white text-sm shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                      Proceed to Payment →
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* STEP 2 */}
            <motion.div layout className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
              <div className={`px-6 py-4 flex items-center gap-3 ${step === 'payment' ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-white border-b border-gray-100'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${step === 'payment' ? 'bg-white text-orange-600' : 'bg-gray-200 text-gray-400'}`}>2</span>
                <h2 className={`font-bold text-base ${step === 'payment' ? 'text-white' : 'text-gray-400'}`}>Secure Payment</h2>
                {step === 'payment' && <span className="ml-auto flex items-center gap-1 text-white/80 text-xs"><span>🔒</span> SSL Protected</span>}
              </div>

              <AnimatePresence>
                {step === 'payment' && (
                  <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onSubmit={handlePay} className="p-6">

                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* method sidebar */}
                      <div className="sm:w-48 shrink-0 space-y-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Pay Now</p>
                        {([
                          { id: 'upi',        label: 'UPI',          icon: '⚡' },
                          { id: 'card',       label: 'Credit / Debit Card', icon: '💳' },
                          { id: 'netbanking', label: 'Net Banking',  icon: '🏦' },
                          { id: 'wallet',     label: 'Wallets',      icon: '👛' },
                        ] as { id: PayMethod; label: string; icon: string }[]).map(m => (
                          <button key={m.id} type="button" onClick={() => setPayMethod(m.id)}
                            className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${payMethod === m.id ? 'bg-orange-50 border border-orange-300 text-orange-700' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}>
                            <span>{m.icon}</span><span className="flex-1 text-left">{m.label}</span>
                            {payMethod === m.id && <span className="text-orange-500 text-xs">›</span>}
                          </button>
                        ))}
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-4 mb-2">Installments</p>
                        <button type="button" onClick={() => setPayMethod('emi')}
                          className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${payMethod === 'emi' ? 'bg-orange-50 border border-orange-300 text-orange-700' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}>
                          <span>📅</span><span className="flex-1 text-left">EMI</span>
                          {payMethod === 'emi' && <span className="text-orange-500 text-xs">›</span>}
                        </button>
                      </div>

                      {/* payment form area */}
                      <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                          <motion.div key={payMethod} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>
                            {payMethod === 'upi' && (
                              <div className="space-y-4">
                                <p className="font-semibold text-gray-800 text-sm">Select UPI App</p>

                                {/* Suggested apps grid */}
                                <div className="grid grid-cols-2 gap-2">
                                  {[
                                    { label: 'Google Pay',  icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/48px-Google_Pay_Logo.svg.png',   link: `gpay://upi/pay?pa=rrupa2289-1%40okaxis&pn=Adyapan&am=${grandTotal.toFixed(2)}&cu=INR&tn=Adyapan+Course` },
                                    { label: 'PhonePe',     icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/PhonePe_Logo.png/48px-PhonePe_Logo.png',              link: `phonepe://pay?pa=rrupa2289-1%40okaxis&pn=Adyapan&am=${grandTotal.toFixed(2)}&cu=INR&tn=Adyapan+Course` },
                                    { label: 'Paytm',       icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/48px-Paytm_Logo_%28standalone%29.svg.png', link: `paytmmp://pay?pa=rrupa2289-1%40okaxis&pn=Adyapan&am=${grandTotal.toFixed(2)}&cu=INR&tn=Adyapan+Course` },
                                    { label: 'BHIM',        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/BHIM_logo.png/48px-BHIM_logo.png',                    link: `upi://pay?pa=rrupa2289-1%40okaxis&pn=Adyapan&am=${grandTotal.toFixed(2)}&cu=INR&tn=Adyapan+Course` },
                                    { label: 'Amazon Pay',  icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/48px-Amazon_logo.svg.png',            link: `upi://pay?pa=rrupa2289-1%40okaxis&pn=Adyapan&am=${grandTotal.toFixed(2)}&cu=INR&tn=Adyapan+Course` },
                                    { label: 'Others',      icon: null,                                                                                                             link: `upi://pay?pa=rrupa2289-1%40okaxis&pn=Adyapan&am=${grandTotal.toFixed(2)}&cu=INR&tn=Adyapan+Course` },
                                  ].map(({ label, icon, link }) => (
                                    <a
                                      key={label}
                                      href={link}
                                      onClick={(e) => {
                                        // If app not installed, fallback to Razorpay checkout
                                        setTimeout(() => {
                                          if (document.hasFocus()) {
                                            e.preventDefault();
                                            handlePay(e as any);
                                          }
                                        }, 1500);
                                      }}
                                      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 hover:border-orange-300 hover:bg-orange-50 active:scale-95 transition-all cursor-pointer"
                                    >
                                      {icon ? (
                                        <img src={icon} alt={label} className="w-7 h-7 object-contain rounded-md flex-shrink-0"
                                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                      ) : (
                                        <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                                          <span className="text-xs font-bold text-gray-500">UPI</span>
                                        </div>
                                      )}
                                      <span className="text-xs font-semibold text-gray-700">{label}</span>
                                    </a>
                                  ))}
                                </div>

                                {/* Divider */}
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-px bg-gray-200" />
                                  <span className="text-[10px] text-gray-400 font-medium">or pay via Razorpay</span>
                                  <div className="flex-1 h-px bg-gray-200" />
                                </div>

                                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                                  Click an app above to pay directly, or click <strong>"Pay Securely"</strong> below to open Razorpay's full payment gateway.
                                </p>
                              </div>
                            )}
                            {payMethod === 'card' && (
                              <div className="space-y-3">
                                <p className="font-semibold text-gray-700 text-sm">Card Details</p>
                                <div className="relative">
                                  <input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/,'').slice(0,16))} placeholder="Card Number" className={`${inp()} pr-24`} />
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/32px-Mastercard-logo.svg.png" alt="MC" className="h-5" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/32px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 mt-0.5" />
                                  </div>
                                </div>
                                <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Name on card" className={inp()} />
                                <div className="flex gap-3">
                                  <input value={cardMM} onChange={e => setCardMM(e.target.value.slice(0,2))} placeholder="MM" className={`${inp()} w-20`} />
                                  <input value={cardYY} onChange={e => setCardYY(e.target.value.slice(0,4))} placeholder="YYYY" className={`${inp()} w-24`} />
                                  <input value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/,'').slice(0,3))} placeholder="CVV" type="password" className={`${inp()} w-20`} />
                                </div>
                              </div>
                            )}
                            {payMethod === 'netbanking' && (
                              <div className="space-y-3">
                                <p className="font-semibold text-gray-700 text-sm">Select Bank</p>
                                <select value={bank} onChange={e => setBank(e.target.value)} className={inp()}>
                                  <option value="">-- Select your bank --</option>
                                  {BANKS.map(b => <option key={b}>{b}</option>)}
                                </select>
                              </div>
                            )}
                            {payMethod === 'wallet' && (
                              <div className="space-y-3">
                                <p className="font-semibold text-gray-700 text-sm">Select Wallet</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {['Paytm Wallet','Amazon Pay','Mobikwik','Freecharge'].map(w => (
                                    <div key={w} className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 font-medium cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">{w}</div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {payMethod === 'emi' && (
                              <div className="space-y-3">
                                <p className="font-semibold text-gray-700 text-sm">Choose EMI Plan</p>
                                {[3,6,9,12].map(m => (
                                  <label key={m} className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors">
                                    <input type="radio" name="emi" className="accent-orange-500" />
                                    <div>
                                      <p className="text-sm font-semibold text-gray-800">{m} months</p>
                                      <p className="text-xs text-gray-500">{fmt(Math.ceil(grandTotal / m))}/month · No cost EMI</p>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>

                        {error && (
                          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                        )}

                        {/* total + pay button */}
                        <div className="mt-6 rounded-2xl bg-orange-50 border border-orange-100 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600">Grand Total (incl. GST)</span>
                            <span className="text-xl font-black text-orange-600">{fmt(grandTotal)}</span>
                          </div>
                          <motion.button type="submit" disabled={paying} whileHover={{ scale: paying ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
                            className="w-full py-4 rounded-xl font-black text-white text-base shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                            style={{ background: paying ? '#9ca3af' : 'linear-gradient(135deg, #f97316, #dc2626)' }}>
                            {paying ? (
                              <><svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Processing…</>
                            ) : (
                              <><span>🔒</span> Pay Now {fmt(grandTotal)}</>
                            )}
                          </motion.button>
                        </div>

                        {/* trust row */}
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                          <span>🔒 SSL Secured</span>
                          <span>•</span>
                          <span>💳 PCI-DSS Compliant</span>
                          <span>•</span>
                          <a href="#" className="text-orange-500 hover:underline">Refund Policy</a>
                        </div>
                        <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                          By paying, you agree to Adyapan's <a href="#" className="text-orange-500 hover:underline">Terms</a>, <a href="#" className="text-orange-500 hover:underline">Refund</a> & <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>.
                        </p>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* bottom links */}
            <div className="flex items-center gap-4 text-sm text-gray-400 pb-4">
              <Link href="/programs" className="hover:text-orange-600 transition-colors">‹ Go back to program</Link>
              <span>•</span>
              <a href="mailto:support@adyapan.com" className="hover:text-orange-600 transition-colors">Contact Support</a>
            </div>
          </div>

          {/* ── RIGHT: Order Summary (desktop) ── */}
          <div className="hidden lg:block w-80 shrink-0">
            <OrderSummary />
          </div>
        </div>
      </div>
    </main>
  );
}
