'use client';

import { motion } from 'framer-motion';

const testimonials = [
  { initials: 'PS', name: 'Priya Sharma', role: 'Frontend Developer', company: 'Razorpay', tag: 'Web Development', quote: 'The Career GPS showed me exactly what I was missing. Within 3 months of following the roadmap and completing marketplace tasks, I had my first real job offer.' },
  { initials: 'AM', name: 'Arjun Mehta', role: 'Data Analyst', company: 'Swiggy', tag: 'Data Science', quote: 'The skills assessment was eye-opening. I thought I knew Python, but the gap analysis showed me I was missing SQL and visualization. Fixed those gaps and landed the role.' },
  { initials: 'KR', name: 'Kavya Reddy', role: 'Growth Marketer', company: 'Zepto', tag: 'Digital Marketing', quote: 'I completed 4 marketplace tasks for a D2C brand. They liked my work so much, they offered me a full-time position. The platform literally created my career.' },
  { initials: 'RV', name: 'Rohan Verma', role: 'UX Designer', company: 'Meesho', tag: 'Design', quote: 'The verified credentials gave me proof beyond certificates. Employers could see my actual project work, not just a badge. That made all the difference.' },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="bg-[#f5f0eb] py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-20"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-[#1a1a2e] mb-8 leading-tight">
              What Our<br />Students<br />Say
            </h2>
            <p className="text-lg text-[#666] mb-8 leading-relaxed">
              Our results speak better than words.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-3xl">⭐</span>
              <span className="text-[#1a1a2e] font-bold">4.7 Rating on Google</span>
            </div>
          </motion.div>

          {/* Right Testimonials Stack */}
          <div className="lg:col-span-2 space-y-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 8, boxShadow: '0 12px 32px rgba(0,0,0,0.08)', transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl p-6 border-l-4 border-[#ff9900] cursor-default"
              >
                {/* Quote */}
                <p className="text-[#1a1a2e] text-base leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: '#00c9a7' }}
                  >
                    {t.initials}
                  </motion.div>
                  <div className="flex-1">
                    <div className="font-bold text-[#1a1a2e] text-sm">{t.name}</div>
                    <div className="text-xs text-[#666]">{t.role} at {t.company}</div>
                    <div className="text-xs font-semibold mt-1" style={{ color: '#00c9a7' }}>
                      {t.tag}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* More testimonials text */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-[#999] text-sm pt-4"
            >
              and many more....
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
