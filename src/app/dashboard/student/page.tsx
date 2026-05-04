'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Award, Clock, CheckCircle, ChevronRight,
  Play, Lock, BarChart2,
  TrendingUp, Star, Zap, ChevronDown, ChevronUp,
} from 'lucide-react';
import axios from 'axios';

/* ─── Types ──────────────────────────────────────────────────── */
interface Lesson {
  _id: string;
  title: string;
  duration: string;
  isFree: boolean;
}
interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}
interface CourseData {
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  totalLessons: number;
  thumbnail: string;
  category: string;
  level: string;
  modules: Module[];
}
interface ProgressData {
  completedLessons: string[];
  progressPercent: number;
  totalLessons: number;
  lastLessonId: string;
  completedAt: string | null;
}
interface EnrolledCourse {
  enrollment: { id: string; courseSlug: string; courseName: string; planLabel: string; amountPaid: number; enrolledAt: string };
  course: CourseData | null;
  progress: ProgressData;
}
interface DashUser { id: string; name: string; email: string; role: string; avatar: string | null }

/* ─── Helpers ────────────────────────────────────────────────── */
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');
const initials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

function ProgressRing({ pct, size = 56 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={6} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={pct === 100 ? '#22c55e' : '#ffa800'} strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
}

/* ─── Course Card ────────────────────────────────────────────── */
function CourseCard({
  item, onMarkLesson, expandedSlug, onToggleExpand,
}: {
  item: EnrolledCourse;
  onMarkLesson: (courseSlug: string, lessonId: string, moduleId: string) => void;
  expandedSlug: string | null;
  onToggleExpand: (slug: string) => void;
}) {
  const { course, progress, enrollment } = item;
  if (!course) return null;

  const pct = progress.progressPercent;
  const done = progress.completedLessons;
  const isExpanded = expandedSlug === course.slug;
  const isComplete = pct === 100;

  /* Find "continue" lesson — first incomplete */
  let continueLessonId = '';
  let continueModuleId = '';
  outer: for (const mod of course.modules) {
    for (const les of mod.lessons) {
      if (!done.includes(les._id)) {
        continueLessonId = les._id;
        continueModuleId = mod._id;
        break outer;
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {isComplete && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" /> Completed
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffa800] text-white">{course.level}</span>
        </div>
        {/* Progress ring overlay */}
        <div className="absolute bottom-2 right-3">
          <div className="relative">
            <ProgressRing pct={pct} size={48} />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white rotate-90">
              {pct}%
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Title + meta */}
        <div className="mb-3">
          <h3 className="font-extrabold text-gray-900 text-base leading-tight mb-1">{course.title}</h3>
          <p className="text-xs text-gray-500 line-clamp-1">{course.subtitle}</p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{done.length}/{course.totalLessons} lessons</span>
          <span className="flex items-center gap-1"><BarChart2 className="w-3.5 h-3.5" />{course.category}</span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 font-medium">Progress</span>
            <span className={`font-bold ${isComplete ? 'text-green-600' : 'text-[#ffa800]'}`}>{pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-[#ffa800] to-[#ff6b00]'}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {isComplete ? (
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-bold hover:bg-green-100 transition-colors">
              <Award className="w-4 h-4" /> View Certificate
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => continueLessonId && onMarkLesson(course.slug, continueLessonId, continueModuleId)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-bold transition-all"
              style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}
            >
              <Play className="w-4 h-4" /> Continue Learning
            </motion.button>
          )}
          <button
            onClick={() => onToggleExpand(course.slug)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Expandable modules */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                {course.modules.map((mod, mi) => {
                  const modDone = mod.lessons.filter(l => done.includes(l._id)).length;
                  return (
                    <div key={mod._id} className="rounded-xl border border-gray-100 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50">
                        <span className="text-xs font-bold text-gray-700">
                          Module {mi + 1}: {mod.title.replace(/^Module \d+ — /, '')}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">{modDone}/{mod.lessons.length}</span>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {mod.lessons.map((les) => {
                          const isDone = done.includes(les._id);
                          return (
                            <div key={les._id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-green-100' : 'bg-gray-100'}`}>
                                {isDone
                                  ? <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                  : les.isFree
                                    ? <Play className="w-3 h-3 text-gray-400" />
                                    : <Lock className="w-3 h-3 text-gray-300" />
                                }
                              </div>
                              <span className={`flex-1 text-xs ${isDone ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                {les.title}
                              </span>
                              <span className="text-[10px] text-gray-400">{les.duration}</span>
                              {!isDone && (
                                <button
                                  onClick={() => onMarkLesson(course.slug, les._id, mod._id)}
                                  className="text-[10px] font-bold text-[#ffa800] hover:text-orange-600 transition-colors px-2 py-0.5 rounded-full border border-[#ffa800]/30 hover:border-orange-400"
                                >
                                  Mark Done
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────── */
export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<DashUser | null>(null);
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [updatingLesson, setUpdatingLesson] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/api/user/dashboard');
      setUser(res.data.user);
      setCourses(res.data.courses ?? []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/auth');
      } else {
        setError('Failed to load dashboard. Please refresh.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkLesson = async (courseSlug: string, lessonId: string, moduleId: string) => {
    setUpdatingLesson(lessonId);
    try {
      const res = await axios.post('/api/progress/update', { courseSlug, lessonId, moduleId });
      /* Update local state */
      setCourses(prev => prev.map(item => {
        if (item.course?.slug !== courseSlug) return item;
        return {
          ...item,
          progress: {
            ...item.progress,
            completedLessons: res.data.completedLessons,
            progressPercent:  res.data.progressPercent,
            totalLessons:     res.data.totalLessons,
            completedAt:      res.data.completedAt,
          },
        };
      }));
    } catch {
      /* silent */
    } finally {
      setUpdatingLesson('');
    }
  };

  const handleLogout = async () => {
    await axios.post('/api/auth/logout').catch(() => {});
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ffa800] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 px-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-sm w-full">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchDashboard} className="px-6 py-2 bg-[#ffa800] text-white rounded-xl font-semibold hover:bg-[#e69500] transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ── Stats ── */
  const totalCourses = courses.length;
  const completedCourses = courses.filter(c => c.progress.progressPercent === 100).length;
  const totalLessonsCompleted = courses.reduce((s, c) => s + c.progress.completedLessons.length, 0);
  const avgProgress = totalCourses > 0
    ? Math.round(courses.reduce((s, c) => s + c.progress.progressPercent, 0) / totalCourses)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Welcome header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 text-sm">
            {totalCourses === 0
              ? 'You have no enrolled courses yet. Explore our programs!'
              : `You have ${totalCourses} enrolled course${totalCourses > 1 ? 's' : ''}. Keep learning!`}
          </p>
        </motion.div>

        {/* ── Stats cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen,    label: 'Enrolled',         value: totalCourses,          color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
            { icon: TrendingUp,  label: 'Avg Progress',     value: `${avgProgress}%`,     color: 'text-[#ffa800]',  bg: 'bg-amber-50',  border: 'border-amber-100' },
            { icon: CheckCircle, label: 'Lessons Done',     value: totalLessonsCompleted, color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
            { icon: Award,       label: 'Completed',        value: completedCourses,      color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
          ].map(({ icon: Icon, label, value, color, bg, border }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border ${border} ${bg} p-4 flex items-center gap-3`}
            >
              <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className={`text-xl font-extrabold ${color} leading-none`}>{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── No courses state ── */}
        {totalCourses === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-5">
              <BookOpen className="w-10 h-10 text-[#ffa800]" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">No courses yet</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
              Enroll in a course to start your learning journey with Adyapan Skills.
            </p>
            <Link
              href="/#all-programs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}
            >
              <Zap className="w-4 h-4" /> Explore Programs
            </Link>
          </motion.div>
        )}

        {/* ── Course grid ── */}
        {totalCourses > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-gray-900">My Courses</h2>
              <Link href="/" className="text-xs text-[#ffa800] font-semibold hover:underline flex items-center gap-1">
                Browse more <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((item) => (
                <CourseCard
                  key={item.enrollment.id}
                  item={item}
                  onMarkLesson={handleMarkLesson}
                  expandedSlug={expandedSlug}
                  onToggleExpand={(slug) => setExpandedSlug(prev => prev === slug ? null : slug)}
                />
              ))}
            </div>

            {/* ── Overall progress summary ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <h3 className="font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-[#ffa800]" /> Learning Summary
              </h3>
              <div className="space-y-4">
                {courses.map((item) => {
                  if (!item.course) return null;
                  const pct = item.progress.progressPercent;
                  return (
                    <div key={item.enrollment.id}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="font-semibold text-gray-700 truncate max-w-[60%]">{item.course.title}</span>
                        <span className={`font-bold text-xs ${pct === 100 ? 'text-green-600' : 'text-[#ffa800]'}`}>
                          {pct === 100 ? '✅ Complete' : `${pct}%`}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${pct === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-[#ffa800] to-[#ff6b00]'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.progress.completedLessons.length} of {item.progress.totalLessons} lessons · {item.course.duration}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}

        {/* ── Quick links ── */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Browse Programs', href: '/', icon: BookOpen, color: 'text-blue-600 bg-blue-50 border-blue-100' },
            { label: 'My Profile',      href: '/auth',     icon: Award,    color: 'text-purple-600 bg-purple-50 border-purple-100' },
            { label: 'Certificates',    href: '#',         icon: Award,    color: 'text-green-600 bg-green-50 border-green-100' },
            { label: 'Support',         href: 'mailto:support@adyapan.com', icon: Zap, color: 'text-[#ffa800] bg-amber-50 border-amber-100' },
          ].map(({ label, href, icon: Icon, color }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all hover:shadow-sm ${color}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
