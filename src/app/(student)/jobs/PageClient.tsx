'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search, Briefcase, Building2, CheckCircle, ChevronDown,
  ChevronUp, Filter, AlertCircle, MapPin, Clock, DollarSign,
  Loader2, X,
} from 'lucide-react';

interface Job {
  _id: string; jobTitle: string; category: string; companyName: string;
  companyLogoUrl: string; companyCity: string; companyVerified: boolean;
  employmentType: string; workMode: string; location: string;
  salaryOrStipend: string; requiredSkills: string[]; experienceLevel: string;
  openings: number; deadline: string; applicantsCount: number; createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  internship: 'bg-orange-100 text-orange-700',
  'full-time': 'bg-blue-100 text-blue-700',
  'part-time': 'bg-purple-100 text-purple-700',
  freelance: 'bg-teal-100 text-teal-700',
  remote: 'bg-green-100 text-green-700',
  'project-based': 'bg-yellow-100 text-yellow-700',
};

const QUICK_FILTERS = [
  { label: 'Internship', value: 'internship', field: 'empType' },
  { label: 'Full-time',  value: 'full-time',  field: 'empType' },
  { label: 'Part-time',  value: 'part-time',  field: 'empType' },
  { label: 'Remote',     value: 'remote',     field: 'workMode' },
] as const;

const EMP_TYPES  = ['internship','full-time','part-time','freelance','project-based'];
const WORK_MODES = ['remote','onsite','hybrid','work-from-home'];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="flex gap-2">{[...Array(3)].map((_,i)=><div key={i} className="h-6 bg-gray-100 rounded-full w-16"/>)}</div>
      <div className="h-9 bg-gray-100 rounded-xl" />
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const daysLeft = Math.ceil((new Date(job.deadline).getTime() - Date.now()) / 86400000);
  const expired  = daysLeft <= 0;
  const urgent   = !expired && daysLeft <= 3;
  const visibleSkills = job.requiredSkills?.slice(0, 4) ?? [];
  const extraSkills   = (job.requiredSkills?.length ?? 0) - 4;
  return (
    <motion.div layout initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
      className="bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {job.companyLogoUrl ? <img src={job.companyLogoUrl} alt={job.companyName} className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 text-orange-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-gray-700 truncate">{job.companyName}</span>
            {job.companyVerified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" aria-label="Verified" />}
          </div>
          {job.companyCity && <span className="flex items-center gap-1 text-xs text-gray-400 mt-0.5"><MapPin className="w-3 h-3"/>{job.companyCity}</span>}
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${TYPE_COLORS[job.employmentType]??'bg-gray-100 text-gray-600'}`}>{job.employmentType}</span>
      </div>
      <h3 className="font-bold text-gray-900 text-base leading-snug">{job.jobTitle}</h3>
      {visibleSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {visibleSkills.map(s=><span key={s} className="px-2.5 py-0.5 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-medium rounded-lg">{s}</span>)}
          {extraSkills > 0 && <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-lg">+{extraSkills} more</span>}
        </div>
      )}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        {job.salaryOrStipend && <span className="flex items-center gap-1 text-green-600 font-semibold"><DollarSign className="w-3 h-3"/>{job.salaryOrStipend}</span>}
        {job.experienceLevel && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3"/>{job.experienceLevel}</span>}
        <span className={`flex items-center gap-1 font-semibold ${expired?'text-red-500':urgent?'text-orange-500':'text-gray-400'}`}>
          <Clock className="w-3 h-3"/>{expired?'Expired':`${daysLeft}d left`}
        </span>
      </div>
      {expired
        ? <button disabled className="w-full py-2.5 rounded-xl text-sm font-bold text-gray-400 bg-gray-100 cursor-not-allowed">Expired</button>
        : <Link href={`/jobs/${job._id}`} className="w-full py-2.5 rounded-xl text-sm font-bold text-white text-center flex items-center justify-center gap-2 shadow-sm shadow-orange-200 hover:shadow-md transition-all" style={{background:'linear-gradient(135deg,#f97316,#ea580c)'}}>View &amp; Apply</Link>
      }
    </motion.div>
  );
}

export default function JobsPage() {
  const [jobs,setJobs]=useState<Job[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [search,setSearch]=useState('');
  const [debouncedSearch,setDebouncedSearch]=useState('');
  const [empType,setEmpType]=useState('');
  const [workMode,setWorkMode]=useState('');
  const [page,setPage]=useState(1);
  const [totalPages,setTotalPages]=useState(1);
  const [total,setTotal]=useState(0);
  const [showFilters,setShowFilters]=useState(false);
  const debounceRef=useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(()=>{
    if(debounceRef.current)clearTimeout(debounceRef.current);
    debounceRef.current=setTimeout(()=>{setDebouncedSearch(search);setPage(1);},500);
    return()=>{if(debounceRef.current)clearTimeout(debounceRef.current);};
  },[search]);

  useEffect(()=>{setPage(1);},[empType,workMode]);

  const fetchJobs=useCallback(async()=>{
    setLoading(true);setError('');
    try{
      const p=new URLSearchParams({page:String(page),limit:'12'});
      if(debouncedSearch)p.set('search',debouncedSearch);
      if(empType)p.set('employmentType',empType);
      if(workMode)p.set('workMode',workMode);
      const res=await fetch(`/api/jobs?${p.toString()}`);
      const data=await res.json();
      if(data.success){setJobs(data.jobs??[]);setTotalPages(data.pagination?.pages??1);setTotal(data.pagination?.total??0);}
      else setError(data.error||'Failed to load jobs');
    }catch{setError('Could not reach the server. Please try again.');}
    finally{setLoading(false);}
  },[page,debouncedSearch,empType,workMode]);

  useEffect(()=>{fetchJobs();},[fetchJobs]);

  const toggleQuickFilter=(field:'empType'|'workMode',value:string)=>{
    if(field==='empType')setEmpType(prev=>prev===value?'':value);
    if(field==='workMode')setWorkMode(prev=>prev===value?'':value);
  };
  const clearFilters=()=>{setEmpType('');setWorkMode('');setSearch('');};
  const hasFilters=!!(empType||workMode||search);

  return(
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="relative overflow-hidden py-14 px-4" style={{background:'linear-gradient(135deg,#f97316 0%,#ea580c 60%,#c2410c 100%)'}}>
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"/>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none"/>
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.h1 initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">Find Your Next Opportunity</motion.h1>
          <motion.p initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} transition={{delay:0.08}} className="text-orange-100 text-base mb-8">Explore internships, full-time roles, and freelance gigs curated for students.</motion.p>
          <motion.div initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} transition={{delay:0.12}} className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            <input type="text" placeholder="Search jobs, companies, skills…" value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-12 pr-12 py-4 rounded-2xl text-gray-800 text-sm font-medium shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"/>
            {search&&<button onClick={()=>setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4"/></button>}
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {QUICK_FILTERS.map(f=>{
            const active=f.field==='empType'?empType===f.value:workMode===f.value;
            return(
              <button key={f.value} onClick={()=>toggleQuickFilter(f.field,f.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${active?'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200':'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'}`}>
                {f.label}
              </button>
            );
          })}
          <button onClick={()=>setShowFilters(v=>!v)} className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-all">
            <Filter className="w-3.5 h-3.5"/>Filters{showFilters?<ChevronUp className="w-3.5 h-3.5"/>:<ChevronDown className="w-3.5 h-3.5"/>}
          </button>
          {hasFilters&&<button onClick={clearFilters} className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"><X className="w-3.5 h-3.5"/>Clear</button>}
        </div>
        <AnimatePresence>
          {showFilters&&(
            <motion.div key="filters" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="overflow-hidden">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Employment Type</label>
                  <div className="relative">
                    <select value={empType} onChange={e=>{setEmpType(e.target.value);setPage(1);}} className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-orange-400 bg-white appearance-none">
                      <option value="">All Types</option>
                      {EMP_TYPES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
                  </div>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Work Mode</label>
                  <div className="relative">
                    <select value={workMode} onChange={e=>{setWorkMode(e.target.value);setPage(1);}} className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-orange-400 bg-white appearance-none">
                      <option value="">All Modes</option>
                      {WORK_MODES.map(m=><option key={m} value={m}>{m.charAt(0).toUpperCase()+m.slice(1)}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!loading&&!error&&<p className="text-sm text-gray-500">{total>0&&<>Showing <span className="font-semibold text-gray-700">{jobs.length}</span> of <span className="font-semibold text-gray-700">{total}</span> jobs</>}</p>}
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {error&&<div className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm"><AlertCircle className="w-5 h-5 flex-shrink-0"/>{error}</div>}
        {loading&&<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{[...Array(6)].map((_,i)=><SkeletonCard key={i}/>)}</div>}
        {!loading&&!error&&jobs.length===0&&(
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <Briefcase className="w-14 h-14 text-gray-200 mx-auto mb-4"/>
            <p className="text-gray-600 font-semibold text-lg mb-1">No jobs available right now.</p>
            <p className="text-gray-400 text-sm">Please check again soon.</p>
            {hasFilters&&<button onClick={clearFilters} className="mt-5 px-5 py-2 rounded-xl text-sm font-bold text-orange-500 border border-orange-200 hover:bg-orange-50 transition-all">Clear filters</button>}
          </motion.div>
        )}
        {!loading&&!error&&jobs.length>0&&(
          <AnimatePresence mode="wait">
            <motion.div key={`${page}-${debouncedSearch}-${empType}-${workMode}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map(job=><JobCard key={job._id} job={job}/>)}
            </motion.div>
          </AnimatePresence>
        )}
        {!loading&&totalPages>1&&(
          <div className="flex items-center justify-center gap-2 mt-10">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">← Prev</button>
            {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1).reduce<(number|'...')[]>((acc,p,idx,arr)=>{
              if(idx>0&&typeof arr[idx-1]==='number'&&(p as number)-(arr[idx-1] as number)>1)acc.push('...');
              acc.push(p);return acc;
            },[]).map((p,i)=>p==='...'
              ?<span key={`e${i}`} className="px-2 text-gray-400 text-sm">…</span>
              :<button key={p} onClick={()=>setPage(p as number)} className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${page===p?'text-white shadow-sm shadow-orange-200':'bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'}`} style={page===p?{background:'linear-gradient(135deg,#f97316,#ea580c)'}:{}}>{p}</button>
            )}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
