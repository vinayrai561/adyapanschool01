'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle, Clock, MessageSquare, Instagram, Linkedin } from 'lucide-react';

const E = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: E } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const CONTACT_INFO = [
  { icon: Phone,   label: 'Phone',    value: '+91 82922 44709',       href: 'tel:+918292244709' },
  { icon: Mail,    label: 'Email',    value: 'support@adyapan.com',   href: 'mailto:support@adyapan.com' },
  { icon: Clock,   label: 'Hours',    value: 'Mon–Sat, 9 AM – 6 PM',  href: null },
];

const FAQS = [
  { q: 'How do I enroll in a course?', a: 'Visit our Programs page, choose your course, and click Enroll Now. Payment is processed securely via Razorpay.' },
  { q: 'Are classes live or recorded?', a: 'All sessions are live and interactive. Recordings are available for revision after each class.' },
  { q: 'What is the refund policy?', a: 'We offer a 7-day refund window from the date of enrollment if you are not satisfied.' },
  { q: 'Do you provide placement support?', a: 'Yes — resume reviews, mock interviews, and direct recruiter connections are included in every program.' },
];

export default function ContactPageClient() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb]">

      {/* ── Hero ── */}
      <section className="bg-[#11121f] text-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.p variants={fadeUp} className="text-xs font-black uppercase tracking-[0.24em] text-[#ffa800] mb-3">
              Get In Touch
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-black leading-tight mb-4">
              We&apos;re Here to Help
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/70 text-lg max-w-xl mx-auto">
              Have a question about our courses, internships, or placement support? Reach out — our team responds within 24 hours.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact cards ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
            <motion.div
              key={label} variants={fadeUp}
              className="bg-white rounded-2xl p-6 text-center shadow-md border border-gray-100"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-[#f97316]" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
              {href ? (
                <a href={href} className="font-semibold text-gray-900 hover:text-[#f97316] transition-colors text-sm">
                  {value}
                </a>
              ) : (
                <p className="font-semibold text-gray-900 text-sm">{value}</p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Form + FAQ ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease: E }}
          >
            <h2 className="text-2xl font-black text-gray-900 mb-6">Send Us a Message</h2>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">We&apos;ll get back to you within 24 hours.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-6 py-2 bg-orange-50 text-[#f97316] rounded-xl font-semibold text-sm hover:bg-orange-100 transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-gray-600 mb-1.5">Full Name *</label>
                    <input
                      id="name" name="name" type="text" required value={form.name} onChange={handleChange}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-gray-600 mb-1.5">Email *</label>
                    <input
                      id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-gray-600 mb-1.5">Phone</label>
                  <input
                    id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs font-bold text-gray-600 mb-1.5">Subject *</label>
                  <select
                    id="subject" name="subject" required value={form.subject} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-700"
                  >
                    <option value="">Select a topic</option>
                    <option value="course-enquiry">Course Enquiry</option>
                    <option value="placement-support">Placement Support</option>
                    <option value="internship">Internship Program</option>
                    <option value="payment">Payment / Billing</option>
                    <option value="technical">Technical Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-gray-600 mb-1.5">Message *</label>
                  <textarea
                    id="message" name="message" required rows={5} value={form.message} onChange={handleChange}
                    placeholder="Tell us how we can help…"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white resize-none"
                  />
                </div>
                {status === 'error' && (
                  <p className="text-sm text-red-500">Something went wrong. Please try again or email us directly.</p>
                )}
                <button
                  type="submit" disabled={status === 'loading'}
                  className="w-full py-4 bg-gradient-to-r from-[#ffa800] to-[#f97316] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-orange-300 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease: E }}
          >
            <h2 className="text-2xl font-black text-gray-900 mb-6">Frequently Asked</h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                    <MessageSquare className={`w-4 h-4 flex-shrink-0 transition-colors ${openFaq === i ? 'text-[#f97316]' : 'text-gray-400'}`} />
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                      className="px-5 pb-4"
                    >
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="mt-8 p-6 bg-[#11121f] rounded-2xl">
              <p className="text-white font-bold mb-4">Follow Us</p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/adyapan" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
                <a
                  href="https://www.linkedin.com/company/adyapan" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
