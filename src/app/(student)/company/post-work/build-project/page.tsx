'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, CheckCircle, Upload, X, FileText,
  Image as ImageIcon, Plus, Trash2, Eye, CreditCard, Loader2,
  AlertCircle, Check, FolderOpen, Calendar, DollarSign, User,
  Mail, Phone, Tag, Layers, ClipboardList,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CATEGORIES = [
  'Web Development', 'Mobile App', 'Desktop Application', 'AI/ML Project',
  'Data Science', 'UI/UX Design', 'Game Development', 'Blockchain', 'IoT Project', 'Other',
];

const STEPS = [
  { id: 1, label: 'Project Details', icon: ClipboardList },
  { id: 2, label: 'Upload Files', icon: Upload },
  { id: 3, label: 'Review', icon: Eye },
  { id: 4, label: 'Payment', icon: CreditCard },
];

interface FormData {
  projectTitle: string;
  category: string;
  description: string;
  features: string[];
  techPreference: string;
  deadline: string;
  budget: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  additionalNotes: string;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

interface Errors {
  [key: string]: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isActive = step.id === currentStep;
        const isDone = step.id < currentStep;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  backgroundColor: isDone ? '#f97316' : isActive ? '#f97316' : '#e5e7eb',
                  scale: isActive ? 1.1 : 1,
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all"
                style={{
                  borderColor: isDone || isActive ? '#f97316' : '#e5e7eb',
                }}
              >
                {isDone ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                )}
              </motion.div>
              <span
                className={`text-xs font-semibold mt-1.5 hidden sm:block ${
                  isActive ? 'text-orange-500' : isDone ? 'text-orange-400' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className="w-12 sm:w-20 h-0.5 mx-1 mb-5 transition-all duration-500"
                style={{ backgroundColor: step.id < currentStep ? '#f97316' : '#e5e7eb' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
      <AlertCircle className="w-3 h-3" /> {msg}
    </p>
  );
}

// ─── Step 1: Project Details ───────────────────────────────────────────────
function Step1({
  form, setForm, errors,
}: {
  form: FormData;
  setForm: (f: FormData) => void;
  errors: Errors;
}) {
  const today = new Date().toISOString().split('T')[0];

  const set = (key: keyof FormData, val: string) =>
    setForm({ ...form, [key]: val });

  const addFeature = () => setForm({ ...form, features: [...form.features, ''] });
  const removeFeature = (i: number) =>
    setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) });
  const updateFeature = (i: number, val: string) => {
    const updated = [...form.features];
    updated[i] = val;
    setForm({ ...form, features: updated });
  };

  const inputCls =
    'w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 text-sm text-gray-800 bg-white transition-all';
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

  return (
    <div className="space-y-5">
      {/* Project Title */}
      <div>
        <label className={labelCls}>
          Project Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. E-commerce Website with Admin Panel"
          value={form.projectTitle}
          onChange={(e) => set('projectTitle', e.target.value)}
          className={inputCls}
        />
        <FieldError msg={errors.projectTitle} />
      </div>

      {/* Category */}
      <div>
        <label className={labelCls}>
          Project Category <span className="text-red-500">*</span>
        </label>
        <select
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          className={inputCls}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <FieldError msg={errors.category} />
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>
          Project Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          placeholder="Describe your project in detail — what it should do, who will use it, and any specific requirements..."
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          className={inputCls + ' resize-none'}
        />
        <FieldError msg={errors.description} />
      </div>

      {/* Required Features */}
      <div>
        <label className={labelCls}>
          Required Features <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {form.features.map((feat, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                placeholder={`Feature ${i + 1}`}
                value={feat}
                onChange={(e) => updateFeature(i, e.target.value)}
                className={inputCls}
              />
              {form.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="p-3 rounded-xl border-2 border-red-200 text-red-400 hover:bg-red-50 hover:border-red-400 transition-all flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addFeature}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Feature
        </button>
        <FieldError msg={errors.features} />
      </div>

      {/* Tech Preference */}
      <div>
        <label className={labelCls}>Technology Preference (optional)</label>
        <input
          type="text"
          placeholder="e.g. React, Node.js, MongoDB"
          value={form.techPreference}
          onChange={(e) => set('techPreference', e.target.value)}
          className={inputCls}
        />
      </div>

      {/* Deadline & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>
            Deadline <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            min={today}
            value={form.deadline}
            onChange={(e) => set('deadline', e.target.value)}
            className={inputCls}
          />
          <FieldError msg={errors.deadline} />
        </div>
        <div>
          <label className={labelCls}>
            Budget (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={3000}
            placeholder="Minimum ₹3000"
            value={form.budget}
            onChange={(e) => set('budget', e.target.value)}
            className={inputCls}
          />
          <FieldError msg={errors.budget} />
        </div>
      </div>

      {/* Contact Info */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-sm font-bold text-gray-700 mb-4">Contact Information</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Your full name"
              value={form.contactName}
              onChange={(e) => set('contactName', e.target.value)}
              className={inputCls}
            />
            <FieldError msg={errors.contactName} />
          </div>
          <div>
            <label className={labelCls}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.contactEmail}
              onChange={(e) => set('contactEmail', e.target.value)}
              className={inputCls}
            />
            <FieldError msg={errors.contactEmail} />
          </div>
          <div>
            <label className={labelCls}>
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={form.contactPhone}
              onChange={(e) => set('contactPhone', e.target.value)}
              className={inputCls}
            />
            <FieldError msg={errors.contactPhone} />
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label className={labelCls}>Additional Notes (optional)</label>
        <textarea
          rows={3}
          placeholder="Any other information you'd like to share..."
          value={form.additionalNotes}
          onChange={(e) => set('additionalNotes', e.target.value)}
          className={inputCls + ' resize-none'}
        />
      </div>
    </div>
  );
}

// ─── Step 2: Upload Files ──────────────────────────────────────────────────
function Step2({
  images, setImages,
  pdfs, setPdfs,
  refs, setRefs,
}: {
  images: UploadedFile[]; setImages: (f: UploadedFile[]) => void;
  pdfs: UploadedFile[]; setPdfs: (f: UploadedFile[]) => void;
  refs: UploadedFile[]; setRefs: (f: UploadedFile[]) => void;
}) {
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - images.length;
    const toAdd = files.slice(0, remaining);
    const converted: UploadedFile[] = [];
    for (const f of toAdd) {
      if (f.size > 5 * 1024 * 1024) continue;
      const dataUrl = await toBase64(f);
      converted.push({ name: f.name, size: f.size, type: f.type, dataUrl });
    }
    setImages([...images, ...converted]);
    e.target.value = '';
  };

  const handlePdfs = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 3 - pdfs.length;
    const toAdd = files.slice(0, remaining);
    const converted: UploadedFile[] = [];
    for (const f of toAdd) {
      if (f.size > 10 * 1024 * 1024) continue;
      const dataUrl = await toBase64(f);
      converted.push({ name: f.name, size: f.size, type: f.type, dataUrl });
    }
    setPdfs([...pdfs, ...converted]);
    e.target.value = '';
  };

  const handleRefs = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - refs.length;
    const toAdd = files.slice(0, remaining);
    const converted: UploadedFile[] = [];
    for (const f of toAdd) {
      if (f.size > 10 * 1024 * 1024) continue;
      const dataUrl = await toBase64(f);
      converted.push({ name: f.name, size: f.size, type: f.type, dataUrl });
    }
    setRefs([...refs, ...converted]);
    e.target.value = '';
  };

  const UploadZone = ({
    label, hint, accept, files, onAdd, onRemove, maxFiles, showThumbs,
  }: {
    label: string; hint: string; accept: string;
    files: UploadedFile[]; onAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: (i: number) => void; maxFiles: number; showThumbs?: boolean;
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 hover:border-orange-300 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-gray-800 text-sm">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
          </div>
          {files.length < maxFiles && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold hover:bg-orange-100 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple
            onChange={onAdd}
            className="hidden"
          />
        </div>

        {files.length === 0 ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full py-6 flex flex-col items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors"
          >
            <FolderOpen className="w-8 h-8" />
            <span className="text-xs">Click to upload or drag & drop</span>
          </button>
        ) : (
          <div className={showThumbs ? 'grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2' : 'space-y-2 mt-2'}>
            {files.map((f, i) =>
              showThumbs ? (
                <div key={i} className="relative group">
                  <img
                    src={f.dataUrl}
                    alt={f.name}
                    className="w-full aspect-square object-cover rounded-xl border-2 border-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <p className="text-[10px] text-gray-400 truncate mt-1">{f.name}</p>
                </div>
              ) : (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{f.name}</p>
                    <p className="text-xs text-gray-400">{formatBytes(f.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            )}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2 text-right">
          {files.length}/{maxFiles} files
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
        <strong>Note:</strong> Files are stored securely and submitted with your project request. Max sizes: Images 5MB, PDFs & References 10MB each.
      </div>

      <UploadZone
        label="Project Images"
        hint="Screenshots, mockups, wireframes (max 5 images, 5MB each)"
        accept="image/*"
        files={images}
        onAdd={handleImages}
        onRemove={(i) => setImages(images.filter((_, idx) => idx !== i))}
        maxFiles={5}
        showThumbs
      />

      <UploadZone
        label="PDF / Documentation"
        hint="Requirements doc, SRS, design specs (max 3 PDFs, 10MB each)"
        accept=".pdf"
        files={pdfs}
        onAdd={handlePdfs}
        onRemove={(i) => setPdfs(pdfs.filter((_, idx) => idx !== i))}
        maxFiles={3}
      />

      <UploadZone
        label="Reference Files"
        hint="Any other reference files (max 5 files, 10MB each)"
        accept="*"
        files={refs}
        onAdd={handleRefs}
        onRemove={(i) => setRefs(refs.filter((_, idx) => idx !== i))}
        maxFiles={5}
      />
    </div>
  );
}

// ─── Step 3: Review ────────────────────────────────────────────────────────
function Step3({
  form, images, pdfs, refs, onEdit,
}: {
  form: FormData;
  images: UploadedFile[];
  pdfs: UploadedFile[];
  refs: UploadedFile[];
  onEdit: () => void;
}) {
  const Row = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-orange-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm text-gray-800 font-semibold mt-0.5 break-words">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Project Details</h3>
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-semibold text-orange-500 hover:text-orange-600 border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-all"
          >
            Edit
          </button>
        </div>
        <Row icon={Tag} label="Project Title" value={form.projectTitle} />
        <Row icon={Layers} label="Category" value={form.category} />
        <Row icon={ClipboardList} label="Description" value={form.description} />
        <Row icon={Calendar} label="Deadline" value={form.deadline} />
        <Row icon={DollarSign} label="Budget" value={`₹${Number(form.budget).toLocaleString('en-IN')}`} />
        {form.techPreference && (
          <Row icon={Tag} label="Tech Preference" value={form.techPreference} />
        )}
      </div>

      <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">Required Features</h3>
        <ul className="space-y-2">
          {form.features.filter(Boolean).map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
        <Row icon={User} label="Name" value={form.contactName} />
        <Row icon={Mail} label="Email" value={form.contactEmail} />
        <Row icon={Phone} label="Phone" value={form.contactPhone} />
      </div>

      <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
        <h3 className="font-bold text-gray-900 mb-3">Uploaded Files</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Images', count: images.length, icon: ImageIcon },
            { label: 'PDFs', count: pdfs.length, icon: FileText },
            { label: 'References', count: refs.length, icon: FolderOpen },
          ].map(({ label, count, icon: Icon }) => (
            <div key={label} className="bg-orange-50 rounded-xl p-3">
              <Icon className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <p className="text-xl font-extrabold text-orange-500">{count}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700">Payment Amount</p>
            <p className="text-xs text-gray-400 mt-0.5">This is the minimum payment amount</p>
          </div>
          <p className="text-3xl font-extrabold text-orange-500">
            ₹{Number(form.budget).toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Payment ───────────────────────────────────────────────────────
function Step4({
  form, images, pdfs, refs, userId, onSuccess,
}: {
  form: FormData;
  images: UploadedFile[];
  pdfs: UploadedFile[];
  refs: UploadedFile[];
  userId: string;
  onSuccess: (projectId: string) => void;
}) {
  const [paying, setPaying] = useState(false);
  const [payState, setPayState] = useState<'idle' | 'creating' | 'opening' | 'verifying'>('idle');
  const [payError, setPayError] = useState('');

  const loadRazorpay = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePay = async () => {
    setPayError('');
    setPaying(true);
    setPayState('creating');

    try {
      /* ── 1. Load Razorpay SDK ── */
      const loaded = await loadRazorpay();
      if (!loaded) {
        setPayError('Failed to load payment gateway. Please check your internet connection and try again.');
        setPaying(false);
        setPayState('idle');
        return;
      }

      /* ── 2. Create order via Next.js API (same-origin — no CORS) ── */
      let orderData: any;
      try {
        const orderRes = await fetch('/api/project-payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectTitle:    form.projectTitle,
            category:        form.category,
            description:     form.description,
            features:        form.features.filter(Boolean),
            techPreference:  form.techPreference,
            deadline:        form.deadline,
            budget:          Number(form.budget),
            contactName:     form.contactName,
            contactEmail:    form.contactEmail,
            contactPhone:    form.contactPhone,
            additionalNotes: form.additionalNotes,
            imageUrls:       images.map((f) => f.dataUrl),
            pdfUrls:         pdfs.map((f) => f.dataUrl),
            referenceFiles:  refs.map((f) => ({ name: f.name, size: f.size, dataUrl: f.dataUrl })),
            userId,
          }),
        });
        orderData = await orderRes.json();
      } catch {
        setPayError('Could not reach the server. Please check your connection and try again.');
        setPaying(false);
        setPayState('idle');
        return;
      }

      if (!orderData?.success) {
        setPayError(orderData?.error || 'Failed to create payment order. Please try again.');
        setPaying(false);
        setPayState('idle');
        return;
      }

      setPayState('opening');

      /* ── 3. Open Razorpay checkout ── */
      const options = {
        key:         orderData.keyId,
        amount:      orderData.amount,
        currency:    orderData.currency || 'INR',
        name:        'Adyapan Skills',
        description: `Build My Project — ${form.projectTitle}`,
        order_id:    orderData.orderId,
        image:       '/logo.png',
        prefill: {
          name:    form.contactName,
          email:   form.contactEmail,
          contact: form.contactPhone,
        },
        notes: {
          projectTitle: form.projectTitle,
          category:     form.category,
        },
        theme: { color: '#f97316' },

        /* ── 4. On payment success → verify server-side ── */
        handler: async (response: {
          razorpay_order_id:   string;
          razorpay_payment_id: string;
          razorpay_signature:  string;
        }) => {
          setPayState('verifying');
          try {
            const verifyRes = await fetch('/api/project-payment/verify', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                projectRequestId:    orderData.projectRequestId,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              onSuccess(verifyData.projectRequestId || orderData.projectRequestId);
            } else {
              setPayError(
                verifyData.error ||
                'Payment received but verification failed. Please contact support@adyapan.com with your payment ID: ' +
                response.razorpay_payment_id
              );
            }
          } catch {
            setPayError(
              'Payment received but we could not confirm it. Please contact support@adyapan.com with payment ID: ' +
              response.razorpay_payment_id
            );
          } finally {
            setPaying(false);
            setPayState('idle');
          }
        },

        modal: {
          ondismiss: () => {
            setPaying(false);
            setPayState('idle');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        const desc = response?.error?.description || response?.error?.reason || 'Payment was declined';
        setPayError(`Payment failed: ${desc}. Please try a different payment method.`);
        setPaying(false);
        setPayState('idle');
      });
      rzp.open();

    } catch (err: any) {
      setPayError(err?.message || 'Something went wrong. Please try again.');
      setPaying(false);
      setPayState('idle');
    }
  };

  const stateLabel: Record<string, string> = {
    creating:  'Creating order…',
    opening:   'Opening payment…',
    verifying: 'Verifying payment…',
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-5">Payment Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Project</span>
            <span className="font-semibold text-gray-800 max-w-[60%] text-right">{form.projectTitle}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Category</span>
            <span className="font-semibold text-gray-800">{form.category}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Deadline</span>
            <span className="font-semibold text-gray-800">{form.deadline}</span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total Amount</span>
            <span className="text-2xl font-extrabold text-orange-500">
              ₹{Number(form.budget).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <strong>Secure Payment</strong> — Your payment is processed securely via Razorpay. We accept UPI, cards, net banking, and wallets.
      </div>

      {payError && (
        <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p>{payError}</p>
            <button
              type="button"
              onClick={() => { setPayError(''); }}
              className="mt-2 text-xs font-semibold text-red-500 underline hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Progress indicator while paying */}
      {paying && payState !== 'idle' && (
        <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700">
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          <span className="font-medium">{stateLabel[payState] || 'Processing…'}</span>
        </div>
      )}

      <motion.button
        type="button"
        onClick={handlePay}
        disabled={paying}
        whileHover={{ scale: paying ? 1 : 1.02 }}
        whileTap={{ scale: paying ? 1 : 0.98 }}
        className="w-full py-4 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-200"
        style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
      >
        {paying ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {stateLabel[payState] || 'Processing…'}
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay ₹{Number(form.budget).toLocaleString('en-IN')}
          </>
        )}
      </motion.button>
    </div>
  );
}

// ─── Success Screen ────────────────────────────────────────────────────────
function SuccessScreen({ projectId }: { projectId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-10"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        className="w-24 h-24 rounded-full bg-green-100 border-4 border-green-400 flex items-center justify-center mx-auto mb-6"
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-extrabold text-gray-900 mb-3"
      >
        Project Submitted! 🎉
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-gray-500 mb-2"
      >
        Your project request has been received. Our team will review it and get back to you within 24 hours.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xs text-gray-400 mb-8 font-mono"
      >
        Project ID: {projectId}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Link
          href="/company/my-projects"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base shadow-lg shadow-orange-200 transition-all hover:shadow-xl hover:shadow-orange-300"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        >
          Track Your Project <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function BuildProjectPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [userId, setUserId] = useState('');
  const [step, setStep] = useState(1);
  const [successProjectId, setSuccessProjectId] = useState('');

  const [form, setForm] = useState<FormData>({
    projectTitle: '',
    category: '',
    description: '',
    features: [''],
    techPreference: '',
    deadline: '',
    budget: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    additionalNotes: '',
  });

  const [images, setImages] = useState<UploadedFile[]>([]);
  const [pdfs, setPdfs] = useState<UploadedFile[]>([]);
  const [refs, setRefs] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<Errors>({});

  // Auth check
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (!data?.user) {
          router.replace('/auth?redirect=/company/post-work/build-project');
          return;
        }
        const u = data.user;
        setUserId(u._id || u.id || '');
        setForm((prev) => ({
          ...prev,
          contactName: prev.contactName || u.name || '',
          contactEmail: prev.contactEmail || u.email || '',
          contactPhone: prev.contactPhone || u.phone || '',
        }));
        setAuthChecked(true);
      })
      .catch(() => {
        router.replace('/auth?redirect=/company/post-work/build-project');
      });
  }, [router]);

  const validateStep1 = useCallback((): boolean => {
    const e: Errors = {};
    if (!form.projectTitle.trim()) e.projectTitle = 'Project title is required';
    if (!form.category) e.category = 'Please select a category';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.features.some((f) => f.trim())) e.features = 'Add at least one feature';
    if (!form.deadline) e.deadline = 'Deadline is required';
    if (!form.budget) {
      e.budget = 'Budget is required';
    } else if (Number(form.budget) < 3000) {
      e.budget = 'Minimum project submission amount is ₹3000';
    }
    if (!form.contactName.trim()) e.contactName = 'Name is required';
    if (!form.contactEmail.trim()) e.contactEmail = 'Email is required';
    if (!form.contactPhone.trim()) e.contactPhone = 'Phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (successProjectId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <SuccessScreen projectId={successProjectId} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <Link
          href="/company/post-work"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-extrabold text-gray-900">
            Build My <span className="text-orange-500">Project</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Fill in the details below and our team will build your project.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <Step1 form={form} setForm={setForm} errors={errors} />
              )}
              {step === 2 && (
                <Step2
                  images={images} setImages={setImages}
                  pdfs={pdfs} setPdfs={setPdfs}
                  refs={refs} setRefs={setRefs}
                />
              )}
              {step === 3 && (
                <Step3
                  form={form}
                  images={images}
                  pdfs={pdfs}
                  refs={refs}
                  onEdit={() => setStep(1)}
                />
              )}
              {step === 4 && (
                <Step4
                  form={form}
                  images={images}
                  pdfs={pdfs}
                  refs={refs}
                  userId={userId}
                  onSuccess={(id) => setSuccessProjectId(id)}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-gray-500 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
              >
                {step === 3 ? 'Proceed to Payment' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
