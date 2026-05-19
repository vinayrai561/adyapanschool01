'use client';

import api from '@/lib/api';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Award, Search, ChevronLeft, ChevronRight,
  CheckCircle, Clock, Download, Eye, Mail,
} from 'lucide-react';

interface Certificate {
  id: string;
  certificateId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  courseName: string;
  courseSlug: string;
  certificateType: string;
  status: string;
  emailSent: boolean;
  issuedAt: string;
  downloadUrl: string;
}

function StatusBadge({ status }: { status: string }) {
  return status === 'ready' ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
      <CheckCircle className="w-3 h-3" /> Ready
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
}

export default function CertificatesPage() {
  const [certs, setCerts]           = useState<Certificate[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage]             = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [summary, setSummary]       = useState({ totalReady: 0, totalPending: 0, totalEmailSent: 0 });

  const fetchCerts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page), limit: '15',
        ...(search && { search }),
        ...(filterStatus && { status: filterStatus }),
      });
      const res = await api.get(`/api/admin/certificates?${params}`);
      setCerts(res.data.certificates || []);
      setPagination(res.data.pagination || { total: 0, pages: 1 });
      setSummary(res.data.summary || { totalReady: 0, totalPending: 0, totalEmailSent: 0 });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filterStatus]);

  useEffect(() => { fetchCerts(); }, [fetchCerts]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchCerts(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
          <p className="text-gray-500 text-sm mt-0.5">{pagination.total} total certificates</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-xl border border-green-100">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">{summary.totalReady} ready</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">{summary.totalPending} pending</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" placeholder="Search by student, course, certificate ID..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ffa800] focus:ring-2 focus:ring-[#ffa800]/10 bg-white"
          />
        </div>
        <select
          value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ffa800] bg-white text-gray-700"
        >
          <option value="">All Statuses</option>
          <option value="ready">Ready</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['Certificate ID', 'Student', 'Course', 'Type', 'Status', 'Email Sent', 'Issued Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>{[...Array(8)].map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : certs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    <Award className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                    No certificates found
                  </td>
                </tr>
              ) : certs.map(cert => (
                <motion.tr key={cert.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-[#ffa800] font-semibold">{cert.certificateId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 whitespace-nowrap">{cert.studentName}</p>
                    <p className="text-xs text-gray-400">{cert.studentEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[160px] truncate">{cert.courseName}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium capitalize whitespace-nowrap">
                      {cert.certificateType?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={cert.status} /></td>
                  <td className="px-4 py-3">
                    {cert.emailSent ? (
                      <span className="text-xs text-green-600 font-medium">âœ“ Sent</span>
                    ) : (
                      <span className="text-xs text-gray-400">Not sent</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(cert.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <a href={cert.downloadUrl} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#ffa800] hover:bg-orange-50 transition-all" title="Download">
                        <Download className="w-4 h-4" />
                      </a>
                      <a href={`mailto:${cert.studentEmail}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all" title="Email Student">
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Page {page} of {pagination.pages} Â· {pagination.total} certificates</p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
