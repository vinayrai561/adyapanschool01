'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, CreditCard, BookOpen, Award, TrendingUp,
  Clock, CheckCircle, GraduationCap, ArrowUpRight,
  IndianRupee, Package, AlertTriangle,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

const PLAN_COLORS = ['#ffa800', '#ff6b00', '#f59e0b', '#d97706'];

function StatCard({ icon: Icon, label, value, color, delay, trend }: {
  icon: any; label: string; value: string; color: string; delay: number; trend?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-gray-200" />
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-0.5 tabular-nums">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
      {trend && <p className="text-xs font-medium mt-1.5" style={{ color: '#ffa800' }}>{trend}</p>}
    </motion.div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-48 flex flex-col items-center justify-center text-gray-300 gap-2">
      <TrendingUp className="w-8 h-8" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export default function OverviewPage() {
  const [overview, setOverview]             = useState<any>(null);
  const [revenueChart, setRevenueChart]     = useState<any[]>([]);
  const [enrollmentChart, setEnrollmentChart] = useState<any[]>([]);
  const [planBreakdown, setPlanBreakdown]   = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState('');

  useEffect(() => {
    fetch('/api/admin/overview', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        setOverview(data.overview);
        setRevenueChart(data.revenueChart || []);
        setEnrollmentChart(data.enrollmentChart || []);
        setPlanBreakdown(data.planBreakdown || []);
        setRecentActivity(data.recentActivity || []);
      })
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const fmt      = (n: number) => (n ?? 0).toLocaleString('en-IN');
  const fmtRupee = (n: number) => `₹${fmt(n)}`;

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-28 animate-pulse border border-gray-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-sm text-[#ffa800] hover:underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: Users,        label: 'Total Students',     value: fmt(overview?.totalStudents),    color: 'bg-blue-500',    delay: 0 },
    { icon: GraduationCap,label: 'Total Enrolled',     value: fmt(overview?.totalEnrolled),    color: 'bg-[#ffa800]',   delay: 0.05 },
    { icon: IndianRupee,  label: 'Total Revenue',      value: fmtRupee(overview?.totalRevenue),color: 'bg-green-500',   delay: 0.1 },
    { icon: CreditCard,   label: 'Payments Received',  value: fmt(overview?.totalPayments),    color: 'bg-purple-500',  delay: 0.15 },
    { icon: BookOpen,     label: 'Active Courses',     value: fmt(overview?.totalCourses),     color: 'bg-indigo-500',  delay: 0.2 },
    { icon: Clock,        label: 'Pending Payments',   value: fmt(overview?.pendingPayments),  color: 'bg-amber-500',   delay: 0.25 },
    { icon: CheckCircle,  label: 'Completed Courses',  value: fmt(overview?.completedCourses), color: 'bg-teal-500',    delay: 0.3 },
    { icon: Award,        label: 'Certificates Issued',value: fmt(overview?.totalCertificates),color: 'bg-rose-500',    delay: 0.35 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time data from MongoDB — all numbers are live.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900">Revenue Trend</h3>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> Revenue
            </span>
          </div>
          {revenueChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueChart}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ffa800" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ffa800" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #f3f4f6', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ffa800" strokeWidth={2.5}
                  fill="url(#revGrad)" dot={{ fill: '#ffa800', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <EmptyChart label="No revenue data yet" />}
        </motion.div>

        {/* Enrollments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900">Enrollments</h3>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-blue-600 font-medium bg-blue-50 px-2.5 py-1 rounded-full">
              <Users className="w-3 h-3" /> Students
            </span>
          </div>
          {enrollmentChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={enrollmentChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: any) => [v, 'Enrollments']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #f3f4f6', fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#ffa800" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart label="No enrollment data yet" />}
        </motion.div>
      </div>

      {/* Plan breakdown + Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan pie */}
        {planBreakdown.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-gray-900">Plan Distribution</h3>
                <p className="text-xs text-gray-400 mt-0.5">Revenue by plan</p>
              </div>
              <Package className="w-4 h-4 text-gray-300" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={planBreakdown} dataKey="revenue" nameKey="_id"
                    cx="50%" cy="50%" outerRadius={65} innerRadius={30}>
                    {planBreakdown.map((_, i) => (
                      <Cell key={i} fill={PLAN_COLORS[i % PLAN_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 self-center">
                {planBreakdown.map((p, i) => (
                  <div key={p._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: PLAN_COLORS[i % PLAN_COLORS.length] }} />
                      <span className="text-xs text-gray-600 truncate max-w-[80px]">{p._id || 'Other'}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-900">₹{(p.revenue / 1000).toFixed(1)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent activity */}
        {recentActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Recent Payments</h3>
                <p className="text-xs text-gray-400 mt-0.5">Latest successful transactions</p>
              </div>
              <CreditCard className="w-4 h-4 text-gray-300" />
            </div>
            <div className="space-y-3">
              {recentActivity.slice(0, 6).map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #ffa800, #ff6b00)' }}
                  >
                    {item.studentName?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.studentName}</p>
                    <p className="text-xs text-gray-400 truncate">{item.courseName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">₹{item.amount?.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(item.paidAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
