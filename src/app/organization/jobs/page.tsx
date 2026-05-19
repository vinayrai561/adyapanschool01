'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Briefcase, Users, Edit2, X, CheckCircle,
  Clock, AlertCircle, Loader2, Search, Filter, ChevronDown,
  MapPin, Calendar, FileText,
} from 'lucide-react';

interface Job {
  _id: string;
  jobTitle: string;
  category: string;
  employmentType: string;
  workMode: string;
  location: string;
  status: string;
  applicantsCount: number;
  createdAt: string;
  deadline: string;
  salaryOrStipend: string;
}

const STATUS_CFG: Record<string, { label: string; cls: string; icon: any }> = {
  active:   { label: 'Active',   cls: 'bg-green-100 text-green-700',  icon: CheckCircle },
  draft:    { label: 'Draft',    cls: 'bg-gray-100 text-gray-600',    icon: FileText },
  closed:   { label: 'Closed',  cls: 'bg-red-100 text-red-600',      icon: X },
  rejected: { label: 'Rejected', cls: 'bg-orange-100 text-orange-700', icon: AlertCircle },
};

const TYPE_COLORS: Record<string, string> = {
  'full-time':      'bg-blue-100 text-blue-700',
  'part-time':      'bg-purple-100 text-purple-700',
  'internship':     'bg-orange-100 text-orange-700',
  'freelance':      'bg-teal-100 text-teal-700',
  'project-based':  'bg-yellow-100 text-yellow-700',
  'work-from-home': 'bg-green-100 text-green-700',
};

function StatCard({
  label, value, icon: Icon, color,
}: {
  label: string; value: number; icon: any; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function OrganizationJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [closing, setClosing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/company/jobs', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setJobs(data.jobs || []);
      else setError(data.error || 'Failed to load jobs');
    } catch {
      setError('Failed to load jobs. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleClose = async (id: string) => {
    if (!confirm('Close this job? Students will no longer be able to apply.')) return;
    setClosing(id);
    try {
      await fetch(`/api/company/jobs/${id}/close`, { method: 'PATCH', credentials: 'include' });
      setJobs(prev => prev.map(j => j._id === id ? { ...j, status: 'closed' } : j));
    } finally {
      setClosing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job permanently?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/company/jobs/${id}`, { method: 'DELETE', credentials: 'include' });
      setJobs(prev => prev.filter(j => j._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q || j.jobTitle.toLowerCase().includes(q) || j.location.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total:      jobs.length,
    active:     jobs.filter(j => j.status === 'active').length,
    draft:      jobs.filter(j => j.status === 'draft').length,
    closed:     jobs.filter(j => j.status === 'closed').length,
    applicants: jobs.reduce((s, j) => s + (j.applicantsCount || 0), 0),
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your job vacancies and applications</p>
        </div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm shadow-md shadow-orange-200 transition-all hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
        >
          <Plus className="w-4 h-4" /> Post a Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <StatCard label="Total Jobs"  value={stats.total}      icon={Briefcase}   color="bg-orange-100 text-orange-600" />
        <StatCard label="Active"      value={stats.active}     icon={CheckCircle} color="bg-green-100 text-green-600" />
        <StatCard label="Draft"       value={stats.draft}      icon={FileText}    color="bg-gray-100 text-gray-600" />
        <StatCard label="Closed"      value={stats.closed}     icon={X}           color="bg-red-100 text-red-600" />
        <StatCard label="Applicants"  value={stats.applicants} icon={Users}       color="bg-blue-100 text-blue-600" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400 bg-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400 bg-white text-gray-700 appearance-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, j) => <div key={j} className="h-8 bg-gray-100 rounded-xl" />)}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No jobs found</p>
          <Link
            href="/jobs"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-500 hover:underline"
          >
            <Plus className="w-4 h-4" /> Post your first job
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map(job => {
              const sc = STATUS_CFG[job.status] || STATUS_CFG.draft;
              const StatusIcon = sc.icon;
              return (
                <motion.div
                  key={job._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-orange-200 p-5 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 flex-wrap mb-2">
                        <h3 className="font-bold text-gray-900 text-base">{job.jobTitle}</h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.cls}`}>
                          <StatusIcon className="w-3 h-3" /> {sc.label}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${TYPE_COLORS[job.employmentType] || 'bg-gray-100 text-gray-600'}`}>
                          {job.employmentType}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Deadline: {new Date(job.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />{job.applicantsCount || 0} applicants
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Posted: {new Date(job.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      <Link
                        href={`/organization/jobs/${job._id}/applicants`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all"
                      >
                        <Users className="w-3.5 h-3.5" /> Applicants ({job.applicantsCount || 0})
                      </Link>
                      <Link
                        href={`/organization/jobs/${job._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </Link>
                      {job.status === 'active' && (
                        <button
                          onClick={() => handleClose(job._id)}
                          disabled={closing === job._id}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-all disabled:opacity-50"
                        >
                          {closing === job._id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <X className="w-3.5 h-3.5" />}
                          Close
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(job._id)}
                        disabled={deleting === job._id}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all disabled:opacity-50"
                      >
                        {deleting === job._id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <X className="w-3.5 h-3.5" />}
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
