'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Users, Mail, Phone, ExternalLink, FileText,
  CheckCircle, X, Briefcase, AlertCircle, Loader2, ChevronDown, ChevronUp,
} from 'lucide-react';

interface Applicant {
  _id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  cvUrl: string;
  portfolioUrl: string;
  message: string;
  status: string;
  appliedAt: string;
}

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  applied:     { label: 'Applied',     cls: 'bg-blue-100 text-blue-700' },
  shortlisted: { label: 'Shortlisted', cls: 'bg-purple-100 text-purple-700' },
  rejected:    { label: 'Rejected',    cls: 'bg-red-100 text-red-600' },
  hired:       { label: 'Hired',       cls: 'bg-green-100 text-green-700' },
};

function ApplicantCard({ applicant, onStatusChange }: {
  applicant: Applicant;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const sc = STATUS_CFG[applicant.status] || STATUS_CFG.applied;

  const handleStatus = async (status: string) => {
    setUpdating(true);
    await onStatusChange(applicant._id, status);
    setUpdating(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 hover:border-orange-200 overflow-hidden transition-all"
    >
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {applicant.studentName?.[0]?.toUpperCase() || '?'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="font-bold text-gray-900">{applicant.studentName}</h3>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{applicant.studentEmail}</span>
                  {applicant.studentPhone && (
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{applicant.studentPhone}</span>
                  )}
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${sc.cls}`}>
                {sc.label}
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-2 mt-3">
              {applicant.cvUrl && (
                <a href={applicant.cvUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-all">
                  <FileText className="w-3.5 h-3.5" /> View CV
                </a>
              )}
              {applicant.portfolioUrl && (
                <a href={applicant.portfolioUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 text-xs font-semibold hover:bg-purple-100 transition-all">
                  <ExternalLink className="w-3.5 h-3.5" /> Portfolio
                </a>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              {applicant.status !== 'shortlisted' && (
                <button onClick={() => handleStatus('shortlisted')} disabled={updating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 text-xs font-semibold hover:bg-purple-100 disabled:opacity-50 transition-all">
                  {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  Shortlist
                </button>
              )}
              {applicant.status !== 'hired' && (
                <button onClick={() => handleStatus('hired')} disabled={updating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-semibold hover:bg-green-100 disabled:opacity-50 transition-all">
                  {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Briefcase className="w-3.5 h-3.5" />}
                  Hire
                </button>
              )}
              {applicant.status !== 'rejected' && (
                <button onClick={() => handleStatus('rejected')} disabled={updating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 disabled:opacity-50 transition-all">
                  {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                  Reject
                </button>
              )}
              {applicant.message && (
                <button onClick={() => setExpanded(e => !e)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-all">
                  {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  Message
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded message */}
      <AnimatePresence>
        {expanded && applicant.message && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">Message from applicant</p>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3">{applicant.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ApplicantsPage() {
  const params = useParams();
  const id = params.id as string;

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [filter, setFilter]         = useState('all');

  useEffect(() => {
    fetch(`/api/company/jobs/${id}/applicants`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.success) setApplicants(data.applicants || []);
        else setError(data.error || 'Failed to load applicants');
      })
      .catch(() => setError('Failed to load applicants'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (appId: string, status: string) => {
    const res = await fetch(`/api/company/applications/${appId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      setApplicants(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
    }
  };

  const filtered = filter === 'all' ? applicants : applicants.filter(a => a.status === filter);

  const counts = {
    all:         applicants.length,
    applied:     applicants.filter(a => a.status === 'applied').length,
    shortlisted: applicants.filter(a => a.status === 'shortlisted').length,
    hired:       applicants.filter(a => a.status === 'hired').length,
    rejected:    applicants.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/organization/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <p className="text-gray-500 text-sm mt-0.5">{applicants.length} total application{applicants.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all','applied','shortlisted','hired','rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === f
                ? 'text-white shadow-md shadow-orange-200'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
            }`}
            style={filter === f ? { background: 'linear-gradient(135deg,#f97316,#ea580c)' } : {}}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
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
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            {filter === 'all' ? 'No applications yet' : `No ${filter} applicants`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <ApplicantCard key={a._id} applicant={a} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}
