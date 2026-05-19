'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Users, Briefcase, Star, Clock, Building2, CheckCircle, ArrowRight, Zap, Shield, TrendingUp, Search, Send } from 'lucide-react';

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let s = 0; const step = Math.ceil(to / 60);
    const t = setInterval(() => { s += step; if (s >= to) { setCount(to); clearInterval(t); } else setCount(s); }, 20);
    return () => clearInterval(t);
  }, [started, to]);
  return <span ref={ref}>{count}{suffix}</span>;
}
function MovingBorderCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={'relative group rounded-2xl p-[2px] overflow-hidden ' + className}>
      <div className='absolute inset-0 rounded-2xl overflow-hidden'>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className='absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0deg,#f97316_60deg,#fbbf24_120deg,transparent_180deg)]'
        />
      </div>
      <div className='relative bg-white rounded-2xl h-full'>{children}</div>
    </div>
  );
}
export default function CompanyPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const stats = [
    { icon: Users, value: 1000, suffix: '+', label: 'Job-Ready Students' },
    { icon: Briefcase, value: 500, suffix: '+', label: 'Projects Completed' },
    { icon: Star, value: 95, suffix: '%', label: 'Success Rate' },
    { icon: Building2, value: 300, suffix: '+', label: 'Hiring Partners' },
    { icon: Clock, value: 24, suffix: 'H', label: 'Avg. Response Time' },
  ];
  const hireBenefits = ['Access a pool of verified students','View skills, projects & experience','Hire for internships, part-time or full-time','Build your dream team'];
  const postWorkBenefits = ['Post tasks or projects in minutes','Receive proposals from students','Review, collaborate & select','Get quality work, on time'];
  const features = [
    { icon: Shield, title: 'Verified Talent', desc: 'Every candidate is assessed and verified for real-world skills before joining our platform.' },
    { icon: Zap, title: 'Fast Hiring', desc: 'Go from posting to hiring in under 24 hours. No lengthy recruitment cycles.' },
    { icon: TrendingUp, title: 'Proven Track Record', desc: '95% success rate across 500+ completed projects with top companies.' },
    { icon: Users, title: 'Diverse Skill Pool', desc: 'Tech, design, marketing, finance - find talent across 67+ skill domains.' },
    { icon: Briefcase, title: 'Flexible Engagement', desc: 'Hire as interns, freelancers, or full-time. Scale up or down anytime.' },
    { icon: Star, title: 'Quality Guaranteed', desc: 'Not satisfied? We will find you a replacement at no extra cost.' },
  ];
  const steps = [
    { n: '01', title: 'Define Your Need', desc: 'Describe the role or skills required',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7 text-orange-400"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
    { n: '02', title: 'Browse Profiles', desc: 'Access pre-vetted candidates instantly',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7 text-orange-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
    { n: '03', title: 'Hire & Collaborate', desc: 'Start working from Day 1',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7 text-orange-400"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { n: '04', title: 'Scale Your Team', desc: 'Convert or continue flexibly',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7 text-orange-400"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
  ];
  return (
    <div className='min-h-screen bg-white overflow-x-hidden'>

      {/* HERO */}
      <section ref={heroRef} className='relative min-h-screen flex items-center overflow-hidden' style={{background:'linear-gradient(135deg,#fff8f0 0%,#ffffff 50%,#fff3e0 100%)'}}>
        <video autoPlay muted loop playsInline className='absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none'>
          <source src='/videos/8126367-hd_1920_1080_25fps.mp4' type='video/mp4' />
        </video>
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className='absolute inset-0 pointer-events-none'>
          <motion.div animate={{ scale:[1,1.2,1], x:[0,40,0] }} transition={{ duration:12, repeat:Infinity, ease:'easeInOut' }}
            className='absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-orange-300/25 to-amber-200/15 blur-3xl' />
          <motion.div animate={{ scale:[1.1,1,1.1], x:[0,-30,0] }} transition={{ duration:16, repeat:Infinity, ease:'easeInOut' }}
            className='absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-orange-200/20 to-yellow-100/10 blur-3xl' />
        </motion.div>
        <div className='absolute inset-0 pointer-events-none opacity-20'
          style={{backgroundImage:'radial-gradient(circle, #f9731620 1px, transparent 1px)', backgroundSize:'40px 40px'}} />

        <div className='max-w-7xl mx-auto px-6 w-full relative z-10 py-24'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
            <motion.div initial={{ opacity:0, x:-60 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}>
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                className='inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-orange-300 bg-orange-50 mb-6'>
                <motion.span animate={{ scale:[1,1.4,1] }} transition={{ duration:1.5, repeat:Infinity }}
                  className='w-2 h-2 rounded-full bg-orange-500' />
                <span className='text-xs font-bold text-orange-700 uppercase tracking-widest'>Connecting Talent with Opportunity</span>
              </motion.div>
              <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.8 }}
                className='text-5xl md:text-7xl font-extrabold leading-[1.05] mb-6'>
                <span className='text-orange-500'>Hire</span> <span className='text-gray-900'>Job-Ready</span><br />
                <span className='text-orange-500'>Talent</span>
              </motion.h1>
              <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
                className='text-gray-500 text-xl leading-relaxed mb-10 max-w-lg'>
                Find and hire skilled, job-ready students trained in in-demand skills for your team.
              </motion.p>
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
                className='flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 max-w-2xl lg:max-w-md xl:max-w-2xl'>
                {/* Hire Talent Card */}
                <MovingBorderCard className='shadow-xl shadow-orange-200 flex-1'>
                  <motion.div whileHover={{ scale:1.01 }}
                    className='p-6 rounded-2xl bg-orange-50 h-full'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='w-12 h-12 rounded-xl bg-orange-100 border-2 border-orange-300 flex items-center justify-center'>
                        <Users className='w-6 h-6 text-orange-500' />
                      </div>
                      <h3 className='font-bold text-gray-900 text-lg'>Hire <span className='text-orange-500'>Talent</span></h3>
                    </div>
                    <p className='text-sm text-gray-500 mb-4 leading-relaxed'>Find and hire job-ready students trained in in-demand skills.</p>
                    <ul className='space-y-2 mb-5'>
                      {hireBenefits.map(b => (
                        <li key={b} className='flex items-center gap-2 text-sm text-gray-600'>
                          <CheckCircle className='w-4 h-4 text-orange-500 flex-shrink-0' />{b}
                        </li>
                      ))}
                    </ul>
                    <Link href='/company/find-employee'
                      className='inline-flex items-center gap-2 text-sm font-bold text-orange-500 border-2 border-orange-500 rounded-xl px-6 py-3 hover:bg-orange-500 hover:text-white transition-all'>
                      Find Employee <ArrowRight className='w-4 h-4' />
                    </Link>
                  </motion.div>
                </MovingBorderCard>

                {/* Post Work Card */}
                <MovingBorderCard className='shadow-xl shadow-orange-200 flex-1'>
                  <motion.div whileHover={{ scale:1.01 }}
                    className='p-6 rounded-2xl bg-white h-full'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='w-12 h-12 rounded-xl bg-orange-100 border-2 border-orange-300 flex items-center justify-center'>
                        <Send className='w-6 h-6 text-orange-500' />
                      </div>
                      <h3 className='font-bold text-gray-900 text-lg'>Post <span className='text-orange-500'>Work</span></h3>
                    </div>
                    <p className='text-sm text-gray-500 mb-4 leading-relaxed'>Post tasks or projects and get it done by our talented students.</p>
                    <ul className='space-y-2 mb-5'>
                      {postWorkBenefits.map(b => (
                        <li key={b} className='flex items-center gap-2 text-sm text-gray-600'>
                          <CheckCircle className='w-4 h-4 text-orange-500 flex-shrink-0' />{b}
                        </li>
                      ))}
                    </ul>
                    <Link href='/company/post-work'
                      className='inline-flex items-center gap-2 text-sm font-bold text-orange-500 border-2 border-orange-500 rounded-xl px-6 py-3 hover:bg-orange-500 hover:text-white transition-all'>
                      Post Work <ArrowRight className='w-4 h-4' />
                    </Link>
                    <Link href='/company/my-projects'
                      className='inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-orange-500 transition-colors mt-3'>
                      Track my projects →
                    </Link>
                  </motion.div>
                </MovingBorderCard>
              </motion.div>
            </motion.div>            <motion.div initial={{ opacity:0, x:60 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.9, delay:0.2 }}
              className='relative hidden lg:flex items-center justify-center'>
              <div className='relative w-96 h-96'>
                <motion.div animate={{ y:[0,-16,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}
                  className='w-full h-full rounded-3xl border-4 border-orange-400 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center shadow-2xl shadow-orange-200/50 overflow-hidden'>
                  <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(249,115,22,0.1),_transparent_70%)]' />
                  <div className='text-center relative z-10'>
                    {/* Animated developer illustration — SVG, no emoji */}
                    <motion.div animate={{ rotate:[0,5,-5,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                      className='mx-auto mb-4 w-32 h-32'>
                      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        {/* Monitor */}
                        <rect x="15" y="30" width="90" height="58" rx="6" fill="#1e293b" stroke="#f97316" strokeWidth="2.5"/>
                        <rect x="20" y="35" width="80" height="45" rx="3" fill="#0f172a"/>
                        {/* Screen glow */}
                        <rect x="20" y="35" width="80" height="45" rx="3" fill="url(#screenGlow)" opacity="0.3"/>
                        {/* Code lines on screen */}
                        <rect x="26" y="42" width="30" height="3" rx="1.5" fill="#f97316" opacity="0.9"/>
                        <rect x="26" y="49" width="50" height="3" rx="1.5" fill="#94a3b8" opacity="0.7"/>
                        <rect x="26" y="56" width="40" height="3" rx="1.5" fill="#f97316" opacity="0.6"/>
                        <rect x="26" y="63" width="55" height="3" rx="1.5" fill="#94a3b8" opacity="0.5"/>
                        <rect x="26" y="70" width="35" height="3" rx="1.5" fill="#fbbf24" opacity="0.8"/>
                        {/* Cursor blink */}
                        <motion.rect x="63" y="70" width="2" height="3" rx="1" fill="#f97316"
                          animate={{ opacity:[1,0,1] }} transition={{ duration:1, repeat:Infinity }}/>
                        {/* Stand */}
                        <rect x="52" y="88" width="16" height="8" rx="2" fill="#334155"/>
                        <rect x="42" y="95" width="36" height="4" rx="2" fill="#475569"/>
                        {/* Adyapan logo on screen corner */}
                        <circle cx="88" cy="40" r="4" fill="#f97316" opacity="0.8"/>
                        <text x="86.5" y="42.5" fontSize="4" fill="white" fontWeight="bold">a</text>
                        <defs>
                          <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#f97316"/>
                            <stop offset="100%" stopColor="transparent"/>
                          </radialGradient>
                        </defs>
                      </svg>
                    </motion.div>
                    <p className='text-orange-600 font-extrabold text-xl'>Job-Ready Talent</p>
                    <p className='text-gray-400 text-sm mt-1'>Available Now</p>
                    <div className='flex items-center justify-center gap-1 mt-3'>
                      {[...Array(5)].map((_,i) => <Star key={i} className='w-4 h-4 text-orange-400 fill-orange-400' />)}
                    </div>
                  </div>
                </motion.div>
                <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:3.2, repeat:Infinity, delay:0.3 }}
                  className='absolute -top-8 -left-10 bg-white rounded-2xl shadow-xl border-2 border-orange-300 px-4 py-3 flex items-center gap-2.5'>
                  <div className='w-9 h-9 rounded-xl bg-orange-100 border-2 border-orange-200 flex items-center justify-center'>
                    <Briefcase className='w-4 h-4 text-orange-500' />
                  </div>
                  <div><p className='text-xs font-bold text-gray-800'>Real Work.</p><p className='text-xs text-gray-400'>Real Impact.</p></div>
                </motion.div>
                <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:3.8, repeat:Infinity, delay:0.8 }}
                  className='absolute -top-8 -right-10 bg-white rounded-2xl shadow-xl border-2 border-green-300 px-4 py-3 flex items-center gap-2.5'>
                  <div className='w-9 h-9 rounded-xl bg-green-100 border-2 border-green-200 flex items-center justify-center'>
                    <Shield className='w-4 h-4 text-green-500' />
                  </div>
                  <div><p className='text-xs font-bold text-gray-800'>Verified &amp;</p><p className='text-xs text-gray-400'>Job-Ready Talent</p></div>
                </motion.div>
                <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:4.2, repeat:Infinity, delay:1.2 }}
                  className='absolute -bottom-8 -right-10 bg-white rounded-2xl shadow-xl border-2 border-yellow-300 px-4 py-3 flex items-center gap-2.5'>
                  <div className='w-9 h-9 rounded-xl bg-yellow-100 border-2 border-yellow-200 flex items-center justify-center'>
                    <Zap className='w-4 h-4 text-yellow-500' />
                  </div>
                  <div><p className='text-xs font-bold text-gray-800'>Fast, Reliable</p><p className='text-xs text-gray-400'>Results</p></div>
                </motion.div>
                <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:3.5, repeat:Infinity, delay:0.6 }}
                  className='absolute -bottom-8 -left-10 bg-white rounded-2xl shadow-xl border-2 border-blue-300 px-4 py-3 flex items-center gap-2.5'>
                  <div className='w-9 h-9 rounded-xl bg-blue-100 border-2 border-blue-200 flex items-center justify-center'>
                    <TrendingUp className='w-4 h-4 text-blue-500' />
                  </div>
                  <div><p className='text-xs font-bold text-gray-800'>95% Success</p><p className='text-xs text-gray-400'>Rate</p></div>
                </motion.div>
                <motion.div animate={{ rotate:[0,360] }} transition={{ duration:20, repeat:Infinity, ease:'linear' }}
                  className='absolute inset-[-40px] rounded-full border-2 border-dashed border-orange-300/60 pointer-events-none' />
                <motion.div animate={{ rotate:[360,0] }} transition={{ duration:15, repeat:Infinity, ease:'linear' }}
                  className='absolute inset-[-70px] rounded-full border border-orange-200/40 pointer-events-none' />
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2, repeat:Infinity }}
          className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400'>
          <span className='text-xs font-medium'>Scroll</span>
          <div className='w-6 h-10 rounded-full border-2 border-orange-300 flex items-start justify-center pt-1.5'>
            <motion.div animate={{ y:[0,14,0] }} transition={{ duration:1.5, repeat:Infinity }}
              className='w-1.5 h-1.5 rounded-full bg-orange-500' />
          </div>
        </motion.div>
      </section>      <section className='py-12 relative overflow-hidden border-y-4 border-orange-400' style={{background:'linear-gradient(135deg,#f97316,#ea580c,#f59e0b)'}}>
        <motion.div animate={{ x:['-100%','100%'] }} transition={{ duration:6, repeat:Infinity, ease:'linear' }}
          className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none' />
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8'>
            {stats.map(({ icon: Icon, value, suffix, label }, i) => (
              <motion.div key={label} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                transition={{ delay:i*0.1 }} viewport={{ once:true }} whileHover={{ scale:1.05 }}
                className='flex items-center gap-3 text-white'>
                <div className='w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center flex-shrink-0'>
                  <Icon className='w-6 h-6 text-white' />
                </div>
                <div>
                  <p className='text-3xl font-extrabold leading-none'><Counter to={value} suffix={suffix} /></p>
                  <p className='text-white/80 text-xs mt-0.5 font-medium'>{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className='py-24 bg-white relative overflow-hidden'>
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-50/80 blur-3xl' />
          <div className='absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-50/60 blur-3xl' />
          <div className='absolute inset-0 opacity-20' style={{backgroundImage:'radial-gradient(circle, #f9731615 1px, transparent 1px)', backgroundSize:'32px 32px'}} />
        </div>
        <div className='max-w-7xl mx-auto px-6 relative z-10'>
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className='text-center mb-16'>
            <span className='text-xs font-bold text-orange-500 uppercase tracking-widest'>Why Choose Us</span>
            <h2 className='text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4'>Why <span className='text-orange-500'>Adyapan</span> Talent?</h2>
            <p className='text-gray-500 max-w-xl mx-auto text-lg'>Access pre-vetted, job-ready professionals who have proven their skills on real projects</p>
          </motion.div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
                transition={{ delay:i*0.08 }} viewport={{ once:true }}
                whileHover={{ y:-8, boxShadow:'0 32px 64px rgba(249,115,22,0.15)' }}
                className='group bg-white rounded-2xl border-2 border-gray-200 hover:border-orange-400 p-6 cursor-default transition-all duration-300'>
                <div className='w-14 h-14 rounded-2xl bg-orange-50 border-2 border-orange-200 group-hover:bg-orange-100 group-hover:border-orange-400 flex items-center justify-center mb-5 transition-all'>
                  <Icon className='w-7 h-7 text-orange-500' />
                </div>
                <h3 className='font-bold text-gray-900 text-lg mb-2'>{title}</h3>
                <p className='text-gray-500 text-sm leading-relaxed'>{desc}</p>
                <div className='mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-500' />
              </motion.div>
            ))}
          </div>
        </div>
      </section>      <section className='py-24 relative overflow-hidden' style={{background:'linear-gradient(135deg,#0f172a,#1e1b4b,#0f172a)'}}>
        <div className='absolute inset-0 pointer-events-none'>
          {[...Array(6)].map((_,i) => (
            <motion.div key={i} animate={{ rotate:[0,360] }} transition={{ duration:25+i*5, repeat:Infinity, ease:'linear' }}
              className='absolute rounded-full border border-orange-500/10'
              style={{ width:150+i*80, height:150+i*80, top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
          ))}
          <motion.div animate={{ scale:[1,1.4,1], opacity:[0.05,0.15,0.05] }} transition={{ duration:6, repeat:Infinity }}
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-500 blur-3xl' />
          <div className='absolute inset-0 opacity-10' style={{backgroundImage:'linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)', backgroundSize:'60px 60px'}} />
        </div>
        <div className='max-w-7xl mx-auto px-6 relative z-10'>
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className='text-center mb-16'>
            <span className='text-xs font-bold text-orange-400 uppercase tracking-widest'>Simple Process</span>
            <h2 className='text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4'>How It Works</h2>
            <p className='text-gray-400 text-lg'>Get started in 4 simple steps</p>
          </motion.div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative'>
            <div className='hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-orange-500/60 to-transparent' />
            {steps.map(({ n, title, desc, icon }, i) => (
              <motion.div key={n} initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
                transition={{ delay:i*0.15 }} viewport={{ once:true }} whileHover={{ y:-8 }}
                className='relative bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-2xl p-6 text-center hover:border-orange-500/60 hover:bg-white/10 transition-all duration-300 group'>
                <motion.div whileHover={{ scale:1.15, rotate:5 }}
                  className='w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/40 border-2 border-orange-300'>
                  {n}
                </motion.div>
                <div className='w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3'>{icon}</div>
                <h3 className='text-white font-bold text-lg mb-2'>{title}</h3>
                <p className='text-gray-400 text-sm leading-relaxed'>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className='py-24 bg-white relative overflow-hidden'>
        <div className='absolute inset-0 pointer-events-none'>
          <motion.div animate={{ scale:[1,1.2,1], x:[0,30,0] }} transition={{ duration:10, repeat:Infinity }}
            className='absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-100/60 blur-3xl' />
          <motion.div animate={{ scale:[1.1,1,1.1], x:[0,-20,0] }} transition={{ duration:12, repeat:Infinity }}
            className='absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-100/40 blur-3xl' />
        </div>
        <div className='max-w-4xl mx-auto px-6 text-center relative z-10'>
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <motion.div animate={{ rotate:[0,360] }} transition={{ duration:20, repeat:Infinity, ease:'linear' }}
              className='w-20 h-20 rounded-full border-4 border-dashed border-orange-400 flex items-center justify-center mx-auto mb-6'>
              <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" className="w-9 h-9">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
            <span className='text-xs font-bold text-orange-500 uppercase tracking-widest'>Get Started Today</span>
            <h2 className='text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4'>Ready to Hire <span className='text-orange-500'>Job-Ready Talent?</span></h2>
            <p className='text-gray-500 text-xl mb-10'>Start building your dream team today with verified, skilled students</p>
            <div className='flex justify-center mb-10'>
              <motion.div whileHover={{ scale:1.05, boxShadow:'0 24px 48px rgba(249,115,22,0.35)' }} whileTap={{ scale:0.97 }}>
                <Link href='/company/find-employee'
                  className='inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-white text-lg border-2 border-orange-600'
                  style={{background:'linear-gradient(135deg,#f97316,#ea580c)'}}>
                  <Search className='w-5 h-5' /> Find Employees
                </Link>
              </motion.div>
            </div>
            <div className='flex items-center justify-center gap-6 flex-wrap'>
              {[
                { label: 'Secure Payments', path: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                { label: 'Verified Talent', path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: '24H Response', path: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { label: 'Free Replacement', path: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
              ].map(({ label, path }) => (
                <span key={label} className='flex items-center gap-1.5 text-sm text-gray-500 font-medium'>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                  </svg>
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}