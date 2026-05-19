
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, Bookmark, BookmarkCheck, Grid3X3, List,
  Star, MapPin, CheckCircle, Users, TrendingUp, Building2,
  SlidersHorizontal, X, ExternalLink, Github, Linkedin,
  Phone, Mail, GraduationCap, Briefcase, FolderOpen,
  Award, ChevronDown, AlertCircle, Loader2, RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────────────────────
interface ExperienceEntry {
  company: string; role: string; duration: string;
  location: string; points: string[];
}
interface ProjectEntry {
  name: string; type?: string; tools: string[]; description: string;
}
interface Talent {
  _id: string;
  name: string; company: string; role: string;
  status: 'available' | 'shortlisted' | 'hired' | 'placed';
  placed: boolean; availability: string; packageExpectation: string;
  skills: string[]; education: string; course: string;
  experienceLevel: string; projectsCount: number; certificatesCount: number;
  rating: number; portfolio: string; github: string; linkedin: string;
  email: string; phone: string; location: string; resumeUrl: string;
  profileSummary: string; objective: string;
  experience: ExperienceEntry[]; projects: ProjectEntry[];
  certifications: string[]; createdAt: string;
}
interface Stats {
  total: number; available: number; placed: number;
  shortlisted: number; hired: number;
}

// ── Avatar ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  'from-orange-400 to-orange-600', 'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',   'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',     'from-teal-400 to-teal-600',
];
function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const color    = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  const sz = size === 'lg' ? 'h-20 w-20 text-2xl' : size === 'sm' ? 'h-9 w-9 text-xs' : 'h-14 w-14 text-base';
  return (
    <div className={`${sz} flex-shrink-0 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center font-black text-white shadow-lg`}>
      {initials}
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Talent['status'] }) {
  const map = {
    available:   'bg-green-100 text-green-700 border-green-200',
    shortlisted: 'bg-blue-100 text-blue-700 border-blue-200',
    hired:       'bg-purple-100 text-purple-700 border-purple-200',
    placed:      'bg-orange-100 text-orange-700 border-orange-200',
  };
  const labels = { available: 'Available', shortlisted: 'Shortlisted', hired: 'Hired', placed: 'Placed' };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${map[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}

// ── Skeleton Card ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        <div className="h-14 w-14 flex-shrink-0 rounded-2xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-3 w-24 rounded bg-gray-100" />
          <div className="h-3 w-40 rounded bg-gray-100" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-gray-100" />
          <div className="h-4 w-16 rounded bg-gray-200" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {[1,2,3,4].map(i => <div key={i} className="h-6 w-16 rounded-full bg-gray-100" />)}
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-9 flex-1 rounded-xl bg-gray-100" />
        <div className="h-9 flex-1 rounded-xl bg-gray-100" />
        <div className="h-9 flex-1 rounded-xl bg-orange-100" />
      </div>
    </div>
  );
}

// ── Profile Modal ──────────────────────────────────────────────────────────
function ProfileModal({ talent, onClose }: { talent: Talent; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative my-8 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ffa800] to-[#f97316] px-6 py-6 text-white">
          <button onClick={onClose} suppressHydrationWarning
            className="absolute right-4 top-4 rounded-xl bg-white/20 p-1.5 hover:bg-white/30 transition-colors">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-4">
            <Avatar name={talent.name} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-black">{talent.name}</h2>
                <StatusBadge status={talent.status} />
              </div>
              <p className="mt-1 text-white/90 font-semibold">{talent.role}</p>
              {talent.company && (
                <p className="text-sm text-white/75 flex items-center gap-1 mt-0.5">
                  <Building2 className="h-3.5 w-3.5" /> {talent.company}
                </p>
              )}
              {talent.location && (
                <p className="text-sm text-white/75 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5" /> {talent.location}
                </p>
              )}
            </div>
          </div>
          {/* Social links */}
          <div className="mt-4 flex flex-wrap gap-2">
            {talent.portfolio && (
              <a href={talent.portfolio} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold hover:bg-white/30 transition-colors">
                <ExternalLink className="h-3.5 w-3.5" /> Portfolio
              </a>
            )}
            {talent.github && (
              <a href={talent.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold hover:bg-white/30 transition-colors">
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
            )}
            {talent.linkedin && (
              <a href={talent.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold hover:bg-white/30 transition-colors">
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
              </a>
            )}
            {talent.resumeUrl && (
              <a href={talent.resumeUrl} target="_blank" rel="noopener noreferrer" download
                className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-black text-orange-600 hover:bg-orange-50 transition-colors">
                <Download className="h-3.5 w-3.5" /> Download CV
              </a>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="divide-y divide-gray-100 overflow-y-auto max-h-[60vh]">
          {/* Objective */}
          {talent.objective && (
            <div className="px-6 py-5">
              <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-orange-500">Objective</h3>
              <p className="text-sm leading-relaxed text-gray-600">{talent.objective}</p>
            </div>
          )}

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3 px-6 py-5 sm:grid-cols-4">
            {[
              { label: 'Projects',     value: talent.projectsCount },
              { label: 'Certificates', value: talent.certificatesCount },
              { label: 'Rating',       value: `${talent.rating} ★` },
              { label: 'Experience',   value: talent.experienceLevel },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl bg-orange-50 p-3 text-center">
                <p className="text-lg font-black text-[#111827]">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Education */}
          {talent.education && (
            <div className="px-6 py-5">
              <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-orange-500">Education</h3>
              <div className="flex items-start gap-2">
                <GraduationCap className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-400" />
                <p className="text-sm text-gray-700">{talent.education}</p>
              </div>
            </div>
          )}

          {/* Skills */}
          {talent.skills.length > 0 && (
            <div className="px-6 py-5">
              <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-orange-500">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {talent.skills.map(s => (
                  <span key={s} className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {talent.experience?.length > 0 && (
            <div className="px-6 py-5">
              <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-orange-500">Experience</h3>
              <div className="space-y-4">
                {talent.experience.map((exp, i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-black text-[#111827]">{exp.role}</p>
                        <p className="text-sm font-semibold text-orange-600">{exp.company}</p>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <p>{exp.duration}</p>
                        {exp.location && <p>{exp.location}</p>}
                      </div>
                    </div>
                    {exp.points?.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {exp.points.map((pt, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400" />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {talent.projects?.length > 0 && (
            <div className="px-6 py-5">
              <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-orange-500">Projects</h3>
              <div className="space-y-3">
                {talent.projects.map((proj, i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="font-black text-[#111827]">{proj.name}</p>
                    {proj.type && <p className="text-xs text-orange-500 font-semibold mt-0.5">{proj.type}</p>}
                    <p className="mt-1.5 text-sm text-gray-600">{proj.description}</p>
                    {proj.tools?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {proj.tools.map(t => (
                          <span key={t} className="rounded-full bg-white border border-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {talent.certifications?.length > 0 && (
            <div className="px-6 py-5">
              <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-orange-500">Certifications</h3>
              <div className="space-y-2">
                {talent.certifications.map((cert, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-3 py-2">
                    <Award className="h-4 w-4 flex-shrink-0 text-orange-500" />
                    <span className="text-sm font-semibold text-gray-700">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {(talent.email || talent.phone) && (
            <div className="px-6 py-5">
              <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-orange-500">Contact</h3>
              <div className="flex flex-wrap gap-3">
                {talent.email && (
                  <a href={`mailto:${talent.email}`} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-orange-300 hover:bg-orange-50 transition-colors">
                    <Mail className="h-4 w-4 text-orange-500" /> {talent.email}
                  </a>
                )}
                {talent.phone && (
                  <a href={`tel:${talent.phone}`} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-orange-300 hover:bg-orange-50 transition-colors">
                    <Phone className="h-4 w-4 text-orange-500" /> {talent.phone}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Talent Card ────────────────────────────────────────────────────────────
function TalentCard({
  talent, onViewProfile, onShortlist, shortlisting,
}: {
  talent: Talent;
  onViewProfile: (t: Talent) => void;
  onShortlist: (t: Talent) => void;
  shortlisting: string | null;
}) {
  const isPlaced      = talent.status === 'placed';
  const isShortlisted = talent.status === 'shortlisted';
  const isHired       = talent.status === 'hired';
  const visibleSkills = talent.skills.slice(0, 4);
  const extraSkills   = talent.skills.length - 4;
  const isUpdating    = shortlisting === talent._id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_12px_40px_rgba(249,115,22,0.12)]"
    >
      <div className="flex items-start gap-4">
        <Avatar name={talent.name} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-[#111827] truncate">{talent.name}</h3>
            <CheckCircle className="h-4 w-4 flex-shrink-0 text-blue-500" />
            <StatusBadge status={talent.status} />
          </div>
          <p className="text-sm font-semibold text-gray-600 truncate">{talent.role}</p>
          {talent.education && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400 truncate">
              <GraduationCap className="h-3 w-3 flex-shrink-0" />
              {talent.education.split(',').slice(0, 2).join(',')}
            </p>
          )}
          {talent.location && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="h-3 w-3 flex-shrink-0" /> {talent.location}
            </p>
          )}
        </div>
        {/* Right stats */}
        <div className="flex-shrink-0 text-right">
          {isPlaced ? (
            <div className="rounded-xl bg-orange-50 px-3 py-2 text-center">
              <p className="text-xs font-bold text-orange-500">Placed at</p>
              <p className="text-sm font-black text-[#111827]">{talent.company || 'Company'}</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400">Package</p>
              <p className="font-black text-[#111827]">{talent.packageExpectation || '—'}</p>
              <p className="mt-1 text-xs text-gray-400">Availability</p>
              <p className="text-sm font-bold text-[#111827]">{talent.availability || '—'}</p>
            </>
          )}
        </div>
      </div>

      {/* Skills */}
      {talent.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleSkills.map(s => (
            <span key={s} className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-600">{s}</span>
          ))}
          {extraSkills > 0 && (
            <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-orange-600">+{extraSkills}</span>
          )}
        </div>
      )}

      {/* Stats row */}
      <div className="mt-3 flex items-center gap-4 border-t border-gray-50 pt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><FolderOpen className="h-3.5 w-3.5" /><strong className="text-gray-700">{talent.projectsCount}</strong> Projects</span>
        <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" /><strong className="text-gray-700">{talent.certificatesCount}</strong> Certs</span>
        <span className="flex items-center gap-1 text-yellow-500"><Star className="h-3.5 w-3.5 fill-current" /><strong>{talent.rating}</strong></span>
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onViewProfile(talent)}
          suppressHydrationWarning
          className="flex-1 rounded-xl border border-orange-300 py-2 text-xs font-black text-orange-600 transition hover:bg-orange-50"
        >
          View Profile
        </button>
        <a
          href={talent.resumeUrl || '#'}
          target={talent.resumeUrl ? '_blank' : undefined}
          rel="noopener noreferrer"
          download={!!talent.resumeUrl}
          onClick={e => { if (!talent.resumeUrl) e.preventDefault(); }}
          title={talent.resumeUrl ? 'Download CV' : 'CV not uploaded'}
          className={`flex flex-1 items-center justify-center gap-1 rounded-xl border py-2 text-xs font-black transition ${
            talent.resumeUrl
              ? 'border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50'
              : 'cursor-not-allowed border-gray-100 text-gray-300'
          }`}
        >
          <Download className="h-3.5 w-3.5" />
          {talent.resumeUrl ? 'Download CV' : 'CV not uploaded'}
        </a>
        <button
          onClick={() => !isPlaced && !isHired && onShortlist(talent)}
          disabled={isPlaced || isHired || isUpdating}
          suppressHydrationWarning
          className={`flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-xs font-black transition ${
            isPlaced || isHired
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : isShortlisted
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gradient-to-r from-[#ffa800] to-[#f97316] text-white hover:shadow-lg'
          }`}
        >
          {isUpdating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isShortlisted ? (
            <><BookmarkCheck className="h-3.5 w-3.5" /> Shortlisted</>
          ) : isPlaced || isHired ? (
            <><CheckCircle className="h-3.5 w-3.5" /> {isPlaced ? 'Placed' : 'Hired'}</>
          ) : (
            <><Bookmark className="h-3.5 w-3.5" /> Shortlist</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'newest',   label: 'Newest First' },
  { value: 'oldest',   label: 'Oldest First' },
  { value: 'rating',   label: 'Top Rated' },
  { value: 'projects', label: 'Most Projects' },
];

const EXPERIENCE_LEVELS = ['Fresher', 'Internship', 'Junior', 'Mid', 'Senior'];
const AVAILABILITY_OPTIONS = ['all', 'available', 'placed'];

export default function FindEmployeePage() {
  // ── State ────────────────────────────────────────────────────────────────
  const [talents, setTalents]           = useState<Talent[]>([]);
  const [stats, setStats]               = useState<Stats>({ total: 0, available: 0, placed: 0, shortlisted: 0, hired: 0 });
  const [loading, setLoading]           = useState(true);
  const [dbError, setDbError]           = useState(false);
  const [errorMsg, setErrorMsg]         = useState('');
  const [total, setTotal]               = useState(0);
  const [activeTab, setActiveTab]       = useState<'all' | 'shortlisted' | 'hired' | 'placed'>('all');
  const [viewMode, setViewMode]         = useState<'list' | 'grid'>('list');
  const [profileTalent, setProfileTalent] = useState<Talent | null>(null);
  const [shortlisting, setShortlisting] = useState<string | null>(null);

  // Filters
  const [search, setSearch]             = useState('');
  const [skillFilter, setSkillFilter]   = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [eduFilter, setEduFilter]       = useState('');
  const [expFilter, setExpFilter]       = useState('');
  const [availFilter, setAvailFilter]   = useState('all');
  const [sortBy, setSortBy]             = useState('newest');
  const [minPkg, setMinPkg]             = useState('');
  const [maxPkg, setMaxPkg]             = useState('');

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchTalents = useCallback(async (overrides?: Record<string, string>) => {
    setLoading(true);
    setDbError(false);
    setErrorMsg('');

    const params = new URLSearchParams({
      search:          overrides?.search          ?? search,
      skills:          overrides?.skills          ?? skillFilter,
      course:          overrides?.course          ?? courseFilter,
      education:       overrides?.education       ?? eduFilter,
      experienceLevel: overrides?.experienceLevel ?? expFilter,
      availability:    overrides?.availability    ?? availFilter,
      sort:            overrides?.sort            ?? sortBy,
      limit:           '50',
    });

    // Tab → status filter
    const tab = overrides?.tab ?? activeTab;
    if (tab !== 'all') params.set('status', tab);

    try {
      const res  = await fetch(`/api/talents?${params}`);
      const data = await res.json();

      if (!res.ok || data.dbError) {
        setDbError(true);
        setErrorMsg(data.error || 'Unable to load real data. Please check MongoDB Atlas connection.');
        setTalents([]);
        return;
      }

      setTalents(data.talents || []);
      setStats(data.stats   || { total: 0, available: 0, placed: 0, shortlisted: 0, hired: 0 });
      setTotal(data.total   || 0);
    } catch {
      setDbError(true);
      setErrorMsg('Unable to load real data. Please check MongoDB Atlas connection.');
      setTalents([]);
    } finally {
      setLoading(false);
    }
  }, [search, skillFilter, courseFilter, eduFilter, expFilter, availFilter, sortBy, activeTab]);

  // Initial load
  useEffect(() => { fetchTalents(); }, []);

  // Re-fetch when tab or sort changes
  useEffect(() => { fetchTalents(); }, [activeTab, sortBy]);

  // Debounced search
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchTalents(), 400);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [search]);

  // ── Shortlist ─────────────────────────────────────────────────────────────
  const handleShortlist = async (talent: Talent) => {
    if (shortlisting) return;
    setShortlisting(talent._id);
    const newStatus = talent.status === 'shortlisted' ? 'available' : 'shortlisted';
    try {
      const res  = await fetch(`/api/talents/${talent._id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setTalents(prev => prev.map(t => t._id === talent._id ? { ...t, status: newStatus } : t));
        setStats(prev => ({
          ...prev,
          shortlisted: newStatus === 'shortlisted' ? prev.shortlisted + 1 : Math.max(0, prev.shortlisted - 1),
        }));
      }
    } catch { /* silent */ }
    finally { setShortlisting(null); }
  };

  // ── Apply filters ─────────────────────────────────────────────────────────
  const applyFilters = () => fetchTalents();
  const resetFilters = () => {
    setSkillFilter(''); setCourseFilter(''); setEduFilter('');
    setExpFilter(''); setAvailFilter('all'); setMinPkg(''); setMaxPkg('');
    setSearch('');
    fetchTalents({ search: '', skills: '', course: '', education: '', experienceLevel: '', availability: 'all' });
  };

  // ── Tabs ──────────────────────────────────────────────────────────────────
  const tabs = [
    { key: 'all',         label: 'All Students', count: stats.total,       icon: Users },
    { key: 'shortlisted', label: 'Shortlisted',  count: stats.shortlisted, icon: Bookmark },
    { key: 'hired',       label: 'Hired',         count: stats.hired,       icon: Briefcase },
    { key: 'placed',      label: 'Placed',        count: stats.placed,      icon: TrendingUp },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">

        {/* ── 3-column layout ── */}
        <div className="flex gap-6">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="hidden w-56 flex-shrink-0 lg:block">
            {/* Tabs */}
            <div className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {tabs.map(({ key, label, count, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  suppressHydrationWarning
                  className={`flex w-full items-center justify-between px-4 py-3 text-sm font-semibold transition-colors ${
                    activeTab === key
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" /> {label}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-black ${activeTab === key ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-black text-[#111827]">
                  <SlidersHorizontal className="h-4 w-4 text-orange-500" /> Filters
                </span>
                <button onClick={resetFilters} suppressHydrationWarning className="text-xs font-bold text-orange-500 hover:underline">Reset</button>
              </div>

              {[
                { label: 'Skills',           value: skillFilter,   setter: setSkillFilter,   placeholder: 'e.g. React' },
                { label: 'Course',           value: courseFilter,  setter: setCourseFilter,  placeholder: 'e.g. Full Stack' },
                { label: 'Education',        value: eduFilter,     setter: setEduFilter,     placeholder: 'e.g. B.Tech' },
              ].map(({ label, value, setter, placeholder }) => (
                <div key={label} className="mb-3">
                  <label className="mb-1 block text-xs font-bold text-gray-600">{label}</label>
                  <input
                    value={value}
                    onChange={e => setter(e.target.value)}
                    placeholder={placeholder}
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              ))}

              <div className="mb-3">
                <label className="mb-1 block text-xs font-bold text-gray-600">Experience Level</label>
                <select value={expFilter} onChange={e => setExpFilter(e.target.value)} suppressHydrationWarning
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none focus:border-orange-400">
                  <option value="">All levels</option>
                  {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-xs font-bold text-gray-600">Availability</label>
                <select value={availFilter} onChange={e => setAvailFilter(e.target.value)} suppressHydrationWarning
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none focus:border-orange-400">
                  <option value="all">All</option>
                  <option value="available">Available</option>
                  <option value="placed">Placed</option>
                </select>
              </div>

              <button onClick={applyFilters} suppressHydrationWarning
                className="w-full rounded-xl bg-gradient-to-r from-[#ffa800] to-[#f97316] py-2.5 text-xs font-black text-white shadow hover:shadow-md transition-all">
                Apply Filters
              </button>
            </div>

            {/* Post a job CTA */}
            <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <p className="text-xs font-black text-[#111827]">Looking for specific skills?</p>
              <p className="mt-1 text-xs text-gray-500">Post a job and get matched with the right students.</p>
              <Link href="/organization/jobs/post" className="mt-3 block text-xs font-black text-orange-500 hover:underline">Post a Job →</Link>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-black text-[#111827]">
                Find &amp; <span className="text-orange-500">Hire</span> Top Talent
              </h1>
              <p className="mt-1 text-gray-500">Discover skilled and verified students trained by Adyapan.</p>
            </div>

            {/* Search + sort bar */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, skills, course, education..."
                  suppressHydrationWarning
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} suppressHydrationWarning
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-orange-400">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <button onClick={() => setViewMode('list')} suppressHydrationWarning
                  className={`rounded-xl p-2.5 transition ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50'}`}>
                  <List className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode('grid')} suppressHydrationWarning
                  className={`rounded-xl p-2.5 transition ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50'}`}>
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Stats cards */}
            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Total Students',  value: stats.total,       icon: Users,      color: 'text-blue-600',   bg: 'bg-blue-50' },
                { label: 'Available',       value: stats.available,   icon: CheckCircle,color: 'text-green-600',  bg: 'bg-green-50' },
                { label: 'Already Placed',  value: stats.placed,      icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'Shortlisted',     value: stats.shortlisted, icon: Bookmark,   color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className={`rounded-xl ${bg} p-2`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-[#111827]">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Results count */}
            {!loading && !dbError && (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  <strong className="text-[#111827]">{total}</strong> student{total !== 1 ? 's' : ''} found
                </p>
                <button onClick={() => fetchTalents()} suppressHydrationWarning
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-orange-500 transition-colors">
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </button>
              </div>
            )}

            {/* ── States ── */}
            {dbError && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-16 text-center">
                <AlertCircle className="mb-3 h-10 w-10 text-red-400" />
                <p className="font-black text-red-700">Connection Error</p>
                <p className="mt-1 max-w-sm text-sm text-red-500">{errorMsg}</p>
                <button onClick={() => fetchTalents()} suppressHydrationWarning
                  className="mt-4 rounded-xl bg-red-500 px-5 py-2 text-sm font-bold text-white hover:bg-red-600 transition-colors">
                  Retry
                </button>
              </div>
            )}

            {loading && !dbError && (
              <div className={viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2' : 'space-y-4'}>
                {[1,2,3].map(i => <SkeletonCard key={i} />)}
              </div>
            )}

            {!loading && !dbError && talents.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm">
                <Users className="mb-3 h-12 w-12 text-gray-200" />
                <p className="font-black text-gray-400">No real student data found</p>
                <p className="mt-1 text-sm text-gray-400">
                  {search || skillFilter ? 'Try adjusting your filters.' : 'Add students via the seed API.'}
                </p>
                {!search && !skillFilter && (
                  <button onClick={async () => {
                    await fetch('/api/talents/seed', { method: 'POST' });
                    fetchTalents();
                  }} suppressHydrationWarning
                    className="mt-4 rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-600 transition-colors">
                    Seed Default Students
                  </button>
                )}
              </div>
            )}

            {!loading && !dbError && talents.length > 0 && (
              <AnimatePresence mode="popLayout">
                <div className={viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2' : 'space-y-4'}>
                  {talents.map(talent => (
                    <TalentCard
                      key={talent._id}
                      talent={talent}
                      onViewProfile={setProfileTalent}
                      onShortlist={handleShortlist}
                      shortlisting={shortlisting}
                    />
                  ))}
                </div>
              </AnimatePresence>
            )}
          </main>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="hidden w-56 flex-shrink-0 xl:block">
            {/* Post a job */}
            <div className="mb-4 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-5">
              <p className="text-xs font-black uppercase tracking-wider text-orange-500">🚀 Post a Job &amp; Get Proposals</p>
              <p className="mt-2 text-sm text-gray-600">Post your requirements and get proposals from students.</p>
              <Link href="/organization/jobs/post"
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#ffa800] to-[#f97316] px-4 py-2 text-xs font-black text-white shadow hover:shadow-md transition-all">
                Post a Job →
              </Link>
            </div>

            {/* Hiring benefits */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-black uppercase tracking-wider text-gray-500">Why Hire from Adyapan?</p>
              {[
                { icon: CheckCircle, text: 'Verified & trained students', color: 'text-green-500' },
                { icon: Award,       text: 'Industry-ready skills',       color: 'text-orange-500' },
                { icon: Briefcase,   text: 'Project-proven talent',       color: 'text-blue-500' },
                { icon: TrendingUp,  text: 'Placement support included',  color: 'text-purple-500' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="mb-2.5 flex items-start gap-2">
                  <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${color}`} />
                  <p className="text-xs text-gray-600">{text}</p>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="mb-2 text-xs font-black uppercase tracking-wider text-gray-500">Need Help?</p>
              <a href="tel:8292244709" className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:underline">
                <Phone className="h-4 w-4" /> 8292244709
              </a>
              <a href="mailto:support@adyapan.com" className="mt-1.5 flex items-center gap-2 text-xs text-gray-500 hover:text-orange-500 transition-colors">
                <Mail className="h-3.5 w-3.5" /> support@adyapan.com
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Profile Modal ── */}
      <AnimatePresence>
        {profileTalent && (
          <ProfileModal talent={profileTalent} onClose={() => setProfileTalent(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
