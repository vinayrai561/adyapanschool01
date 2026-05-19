'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ChevronDown, ChevronUp, Loader2, Layers,
  Calendar, DollarSign, CreditCard, Tag, CheckCircle,
  Clock, AlertCircle, Zap, Package, Truck, FolderOpen,
  ArrowRight,
} from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface ProjectRequest {
  _id: string;
  projectTitle: string;
  category: string;
  description: string;
  features: string[];
  techPreference?: string;
  deadline: string;
  budget: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  additionalNotes?: string;
  projectStatus: string;
  paymentId: string;
  orderId: string;
  paymentStatus: string;
  paidAmount: number;
  createdAt: string;
  assignedTo?: { name: string; email: string } | null;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: any }> = {
  submitted: { label: 'Submitted', cls: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  under_review: { label: 'Under Review', cls: 'bg-yellow-100 text-yellow-700', icon: Clock },
  assigned: { label: 'Assigned', cls: 'bg-purple-100 text-purple-700', icon: Tag },
  in_progress: { label: 'In Progress', cls: 'bg-orange-100 text-orange-700', icon: Zap },
  completed: { label: 'Completed', cls: 'bg-green-100 text-green-700', icon: CheckCircle },
  delivered: { label: 'Delivered', cls: 'bg-teal-100 text-teal-700', icon: Truck },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, cls: 'bg-gray-100 text-gray-600', icon: AlertCircle };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-100 rounded w-1/3" />
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectRequest }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-200 transition-all overflow-hidden"
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base truncate">{project.projectTitle}</h3>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-medium">
              <Layers className="w-3 h-3" />
              {project.category}
            </span>
          </div>
          <StatusBadge status={project.projectStatus} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs text-gray-400">Budget Paid</span>
            </div>
            <p className="font-bold text-gray-800 text-sm">₹{project.paidAmount?.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs text-gray-400">Deadline</span>
            </div>
            <p className="font-bold text-gray-800 text-sm">
              {new Date(project.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs text-gray-400">Submitted</span>
            </div>
            <p className="font-bold text-gray-800 text-sm">
              {new Date(project.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <CreditCard className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs text-gray-400">Payment ID</span>
            </div>
            <p className="font-bold text-gray-800 text-xs font-mono truncate">
              {project.paymentId?.slice(0, 14)}…
            </p>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-orange-500 transition-colors py-1"
        >
          {expanded ? (
            <><ChevronUp className="w-4 h-4" /> Hide Details</>
          ) : (
            <><ChevronDown className="w-4 h-4" /> View Details</>
          )}
        </button>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{project.description}</p>
              </div>
              {project.features?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">Required Features</p>
                  <ul className="space-y-1">
                    {project.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {project.techPreference && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Tech Preference</p>
                  <p className="text-sm text-gray-700">{project.techPreference}</p>
                </div>
              )}
              {project.assignedTo && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Assigned To</p>
                  <p className="text-sm text-gray-700">{project.assignedTo.name} ({project.assignedTo.email})</p>
                </div>
              )}
              {project.additionalNotes && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Additional Notes</p>
                  <p className="text-sm text-gray-700">{project.additionalNotes}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Full Payment ID</p>
                <p className="text-xs font-mono text-gray-600 bg-gray-50 px-3 py-2 rounded-lg break-all">{project.paymentId}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MyProjectsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectRequest[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => r.json())
      .then(async (data) => {
        if (!data?.user) {
          router.replace('/auth?redirect=/company/my-projects');
          return;
        }
        const email = data.user.email;
        try {
          const res = await fetch(
            `${BACKEND_URL}/api/project-request/my-requests?email=${encodeURIComponent(email)}`,
            { credentials: 'include' }
          );
          const json = await res.json();
          if (json.success) {
            setProjects(json.requests || []);
          } else {
            setError(json.error || 'Failed to load projects');
          }
        } catch {
          setError('Failed to load projects. Please try again.');
        } finally {
          setLoading(false);
        }
      })
      .catch(() => {
        router.replace('/auth?redirect=/company/my-projects');
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <Link
          href="/company"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Company
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-extrabold text-gray-900">
            My <span className="text-orange-500">Projects</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Track the status of your submitted project requests.</p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-5">
              <FolderOpen className="w-10 h-10 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No projects submitted yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Submit your first project and our team will build it for you.
            </p>
            <Link
              href="/company/post-work/build-project"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white shadow-lg shadow-orange-200 transition-all hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
            >
              Build My Project <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
