'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Save, Loader2, AlertCircle, CheckCircle,
  Plus, Trash2, MapPin, DollarSign,
} from 'lucide-react';

const CATEGORIES = ['Technology','Design','Marketing','Finance','Sales','Operations','HR','Content','Data Science','Other'];
const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'project-based', label: 'Project-based' },
  { value: 'work-from-home', label: 'Work from Home' },
];
const WORK_MODES = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'Onsite' },
];
const EXPERIENCE_LEVELS = ['Fresher','0–1 years','1–2 years','2–5 years','5+ years'];

const inputCls = 'w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 text-sm text-gray-800 bg-white transition-all';
const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [error,   setError]     = useState('');
  const [success, setSuccess]   = useState('');

  const [form, setForm] = useState({
    jobTitle: '', category: '', description: '',
    responsibilities: [''], requiredSkills: [''],
    educationRequirement: '', experienceLevel: 'Fresher',
    openings: '1', employmentType: 'internship',
    workMode: 'onsite', location: '', salaryOrStipend: '',
    deadline: '', status: 'active',
  });

  useEffect(() => {
    fetch(`/api/company/jobs`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        const job = (data.jobs || []).find((j: any) => j._id === id);
        if (job) {
          setForm({
            jobTitle:             job.jobTitle || '',
            category:             job.category || '',
            description:          job.description || '',
            responsibilities:     job.responsibilities?.length ? job.responsibilities : [''],
            requiredSkills:       job.requiredSkills?.length   ? job.requiredSkills   : [''],
            educationRequirement: job.educationRequirement || '',
            experienceLevel:      job.experienceLevel || 'Fresher',
            openings:             String(job.openings || 1),
            employmentType:       job.employmentType || 'internship',
            workMode:             job.workMode || 'onsite',
            location:             job.location || '',
            salaryOrStipend:      job.salaryOrStipend || '',
            deadline:             job.deadline ? job.deadline.split('T')[0] : '',
            status:               job.status || 'active',
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const set = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const addItem = (key: 'responsibilities' | 'requiredSkills') =>
    setForm(prev => ({ ...prev, [key]: [...prev[key], ''] }));
  const removeItem = (key: 'responsibilities' | 'requiredSkills', i: number) =>
    setForm(prev => ({ ...prev, [key]: prev[key].filter((_: any, idx: number) => idx !== i) }));
  const updateItem = (key: 'responsibilities' | 'requiredSkills', i: number, v: string) => {
    const arr = [...form[key]]; arr[i] = v;
    setForm(prev => ({ ...prev, [key]: arr }));
  };

  const handleSave = async () => {
    setError(''); setSuccess(''); setSaving(true);
    try {
      const res = await fetch(`/api/company/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          responsibilities: form.responsibilities.filter(Boolean),
          requiredSkills:   form.requiredSkills.filter(Boolean),
          openings:         Number(form.openings) || 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Job updated successfully!');
        setTimeout(() => router.push('/organization/jobs'), 1200);
      } else {
        setError(data.error || 'Failed to update job');
      }
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/organization/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Job</h1>
        <p className="text-gray-500 text-sm mt-0.5">Update your job posting details</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <CheckCircle className="w-4 h-4 flex-shrink-0" /> {success}
        </motion.div>
      )}

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Job Title <span className="text-red-500">*</span></label>
            <input type="text" value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Description <span className="text-red-500">*</span></label>
          <textarea rows={5} value={form.description} onChange={e => set('description', e.target.value)} className={inputCls + ' resize-none'} />
        </div>

        {/* Responsibilities */}
        <div>
          <label className={labelCls}>Responsibilities</label>
          <div className="space-y-2">
            {form.responsibilities.map((r: string, i: number) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={r} onChange={e => updateItem('responsibilities', i, e.target.value)} className={inputCls} placeholder={`Responsibility ${i + 1}`} />
                {form.responsibilities.length > 1 && (
                  <button type="button" onClick={() => removeItem('responsibilities', i)} className="p-3 rounded-xl border-2 border-red-200 text-red-400 hover:bg-red-50 flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addItem('responsibilities')} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* Skills */}
        <div>
          <label className={labelCls}>Required Skills</label>
          <div className="space-y-2">
            {form.requiredSkills.map((s: string, i: number) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={s} onChange={e => updateItem('requiredSkills', i, e.target.value)} className={inputCls} placeholder={`Skill ${i + 1}`} />
                {form.requiredSkills.length > 1 && (
                  <button type="button" onClick={() => removeItem('requiredSkills', i)} className="p-3 rounded-xl border-2 border-red-200 text-red-400 hover:bg-red-50 flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addItem('requiredSkills')} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Education Requirement</label>
            <input type="text" value={form.educationRequirement} onChange={e => set('educationRequirement', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Experience Level</label>
            <select value={form.experienceLevel} onChange={e => set('experienceLevel', e.target.value)} className={inputCls}>
              {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Openings</label>
            <input type="number" min={1} value={form.openings} onChange={e => set('openings', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Employment Type</label>
            <select value={form.employmentType} onChange={e => set('employmentType', e.target.value)} className={inputCls}>
              {EMPLOYMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Work Mode</label>
            <select value={form.workMode} onChange={e => set('workMode', e.target.value)} className={inputCls}>
              {WORK_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={form.location} onChange={e => set('location', e.target.value)} className={inputCls + ' pl-9'} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Salary / Stipend</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={form.salaryOrStipend} onChange={e => set('salaryOrStipend', e.target.value)} className={inputCls + ' pl-9'} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Deadline</label>
            <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end gap-3">
        <Link href="/organization/jobs" className="px-5 py-3 rounded-xl font-semibold text-gray-500 border-2 border-gray-200 hover:border-gray-300 transition-all">
          Cancel
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white disabled:opacity-70 transition-all shadow-md shadow-orange-200"
          style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
        >
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
