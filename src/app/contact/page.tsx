'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const contacts = [
    { icon: '📧', label: 'General Support', value: 'support@adyapan.com', href: 'mailto:support@adyapan.com' },
    { icon: '💼', label: 'Business Enquiries', value: 'business@adyapan.com', href: 'mailto:business@adyapan.com' },
    { icon: '🔒', label: 'Privacy Concerns', value: 'privacy@adyapan.com', href: 'mailto:privacy@adyapan.com' },
    { icon: '🐛', label: 'Bug Reports', value: 'bugs@adyapan.com', href: 'mailto:bugs@adyapan.com' },
  ];

  const faqs = [
    { q: 'How do I reset my password?', a: 'Go to the login page and click "Forgot password". We\'ll send a reset link to your email.' },
    { q: 'How do I get my certificate?', a: 'Certificates are issued automatically upon course completion. Check your dashboard.' },
    { q: 'What is your refund policy?', a: 'Refund requests must be submitted within 7 days of purchase. Email support@adyapan.com.' },
    { q: 'How do I report a bug?', a: 'Use the contact form below or email bugs@adyapan.com with a description and screenshot.' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <Link href="/" className="text-sm text-orange-500 hover:underline mb-4 inline-block">← Back to Home</Link>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Contact & Support</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Have a question, found a bug, or need help? We're here for you. Reach out and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left — Contact form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Send us a message</h2>

              {status === 'sent' ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setStatus('idle')} className="mt-4 text-orange-500 text-sm hover:underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name *</label>
                      <input
                        required value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email *</label>
                      <input
                        required type="email" value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        placeholder="you@email.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject *</label>
                    <select
                      required value={form.subject}
                      onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    >
                      <option value="">Select a topic</option>
                      <option value="payment">Payment Issue</option>
                      <option value="course">Course Access</option>
                      <option value="certificate">Certificate</option>
                      <option value="bug">Bug Report</option>
                      <option value="refund">Refund Request</option>
                      <option value="account">Account Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message *</label>
                    <textarea
                      required rows={5} value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Describe your issue or question in detail..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-sm text-red-500">Something went wrong. Please email us directly at support@adyapan.com</p>
                  )}

                  <motion.button
                    type="submit" disabled={status === 'sending'}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #ffa800, #ff6b00)' }}
                  >
                    {status === 'sending' ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Sending...</span></>
                    ) : '📨 Send Message'}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right — Contact info + FAQ */}
          <div className="space-y-6">

            {/* Contact cards */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Direct Contact</h2>
                <div className="space-y-3">
                  {contacts.map(({ icon, label, value, href }) => (
                    <a key={label} href={href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors group">
                      <span className="text-xl">{icon}</span>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">{label}</p>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">{value}</p>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">⏱ Response time: within 24 hours on business days</p>
                </div>
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Answers</h2>
                <div className="space-y-4">
                  {faqs.map(({ q, a }) => (
                    <div key={q}>
                      <p className="text-sm font-semibold text-gray-800 mb-1">❓ {q}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-10 text-center text-sm text-gray-400 space-x-4">
          <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
          <span>·</span>
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        </div>
      </div>
    </main>
  );
}
