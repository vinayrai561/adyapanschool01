'use client';

import api from '@/lib/api';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, Mail, Clock, CheckCircle, XCircle, Plus,
  Copy, Trash2, LogOut, RefreshCw, AlertCircle, Check,
  Link2, Eye, EyeOff, Lock, UserX, UserCheck,
  BarChart3, Key, ExternalLink, Search
} from 'lucide-react';
import useDebounce from '@/hooks/useDebounce';
import throttle from '@/utils/throttle';

/* ─── Types ─────────────────────────────────────────────────── */
interface Admin {
  id: string; name: string; email: string; role: string;
  accountStatus: string; isActive: boolean; loginCount: number;
  lastLoginAt: string | null; createdAt: string;
  isLocked: boolean; lockedUntil: string | null;
}
interface Invite {
  id: string; email: string; mobileNumber: string; role: string;
  used: boolean; usedAt: string | null; expiresAt: string;
  invitedByEmail: string; note: string;
  revokedAt: string | null; failedAttempts: number;
  isExpired: boolean; isRevoked: boolean; isActive: boolean;
  inviteLink: string; createdAt: string;
}

/* ─── Copy button ────────────────────────────────────────────── */
function CopyBtn({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-[#ffa800] text-white hover:bg-orange-600'}`}>
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

/* ─── Stat card ──────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, sub }: { icon: any; label: string; value: number | string; color: string; sub?: string }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-extrabold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </motion.div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────── */
export default function SuperAdminDashboard() {
  const router = useRouter();
  const [user, setUser]         = useState<any>(null);
  const [admins, setAdmins]     = useState<Admin[]>([]);
  const [invites, setInvites]   = useState<Invite[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<'overview' | 'admins' | 'invites'>('overview');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]       = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch]     = useState('');

  // Debounce search — 400ms after user stops typing
  const debouncedSearch = useDebounce(search, 400);  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = useCallback(async () => {
    try {
      const [meRes, adminsRes, invitesRes] = await Promise.all([
        api.get('/api/auth/me'),
        api.get('/api/superadmin/admins'),
        api.get('/api/admin/invites?filter=all'),
      ]);
      setUser(meRes.data.user);
      setAdmins(adminsRes.data.admins || []);
      setInvites(invitesRes.data.invites || []);
    } catch {
      router.replace('/superadmin/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Throttle refresh — max once per 3 seconds to prevent hammering
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledFetch = useCallback(throttle(fetchAll, 3000), [fetchAll]);

  const handleLogout = async () => {
    await api.post('/api/auth/logout').catch(() => {});
    router.push('/superadmin/login');
  };

  const handleDeleteAdmin = async (id: string, name: string) => {
    if (!confirm(`Delete admin "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/superadmin/admins/${id}`);
      showToast('Admin deleted');
      fetchAll();
    } catch (e: any) { showToast(e.response?.data?.error || 'Failed', 'error'); }
  };

  const handleToggleBlock = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'blocked' ? 'approved' : 'blocked';
    try {
      await api.patch(`/api/superadmin/admins/${id}`, { accountStatus: newStatus });
      showToast(`Admin ${newStatus === 'blocked' ? 'blocked' : 'unblocked'}`);
      fetchAll();
    } catch (e: any) { showToast(e.response?.data?.error || 'Failed', 'error'); }
  };

  const handleUnlock = async (id: string) => {
    try {
      await api.patch(`/api/superadmin/admins/${id}`, { unlockAccount: true });
      showToast('Account unlocked');
      fetchAll();
    } catch (e: any) { showToast(e.response?.data?.error || 'Failed', 'error'); }
  };

  const handleRevokeInvite = async (id: string) => {
    if (!confirm('Revoke this invite?')) return;
    try {
      await api.post(`/api/admin/invites/${id}/revoke`);
      showToast('Invite revoked');
      fetchAll();
    } catch (e: any) { showToast(e.response?.data?.error || 'Failed', 'error'); }
  };

  /* Stats */
  const stats = {
    totalAdmins:    admins.filter(a => a.role === 'ADMIN').length,
    activeInvites:  invites.filter(i => i.isActive).length,
    usedInvites:    invites.filter(i => i.used).length,
    expiredInvites: invites.filter(i => i.isExpired && !i.used && !i.revokedAt).length,
    revokedInvites: invites.filter(i => i.revokedAt).length,
    lockedAdmins:   admins.filter(a => a.isLocked).length,
  };

  const filteredAdmins  = admins.filter(a => a.email.toLowerCase().includes(debouncedSearch.toLowerCase()) || a.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
  const filteredInvites = invites.filter(i => i.email.toLowerCase().includes(debouncedSearch.toLowerCase()));

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#ffa800] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="flex h-screen overflow-hidden">
        <aside className="w-64 bg-[#0a0a14] border-r border-white/5 flex flex-col flex-shrink-0">
          {/* Logo */}
          <div className="px-6 py-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">Adyapan</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#ffa800]">Superadmin</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {([
              { id: 'overview', label: 'Overview',    icon: BarChart3 },
              { id: 'admins',   label: 'Admins',      icon: Users },
              { id: 'invites',  label: 'Invites',     icon: Key },
            ] as const).map(item => (
              <button key={item.id} onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === item.id ? 'text-[#ffa800]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                style={tab === item.id ? { background: 'rgba(255,168,0,0.1)' } : {}}>
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.id === 'admins' && stats.lockedAdmins > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.lockedAdmins}</span>
                )}
                {item.id === 'invites' && stats.activeInvites > 0 && (
                  <span className="ml-auto bg-[#ffa800] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.activeInvites}</span>
                )}
              </button>
            ))}
          </nav>

          {/* User card */}
          <div className="px-3 py-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}>
                {user?.name?.[0]?.toUpperCase() || 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-[#ffa800] font-bold uppercase tracking-wider">Superadmin</p>
              </div>
              <button onClick={handleLogout} title="Logout" className="text-gray-500 hover:text-red-400 transition-colors p-1">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto bg-[#f8f9fb]">
          {/* Top bar */}
          <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 capitalize">{tab}</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {tab === 'overview' && 'System-wide analytics and quick actions'}
                {tab === 'admins'   && `${admins.length} admin accounts`}
                {tab === 'invites'  && `${invites.length} total invites`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={throttledFetch} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all" title="Refresh (max once per 3s)">
                <RefreshCw className="w-4 h-4" />
              </button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm shadow-lg"
                style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}>
                <Plus className="w-4 h-4" /> Generate Invite
              </motion.button>
            </div>
          </header>

          <div className="p-8">

            {/* ── OVERVIEW TAB ── */}
            {tab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <StatCard icon={Users}        label="Total Admins"    value={stats.totalAdmins}    color="bg-blue-500" />
                  <StatCard icon={Key}          label="Active Invites"  value={stats.activeInvites}  color="bg-green-500" />
                  <StatCard icon={CheckCircle}  label="Used Invites"    value={stats.usedInvites}    color="bg-purple-500" />
                  <StatCard icon={Clock}        label="Expired Invites" value={stats.expiredInvites} color="bg-orange-400" />
                  <StatCard icon={XCircle}      label="Revoked"         value={stats.revokedInvites} color="bg-red-500" />
                  <StatCard icon={Lock}         label="Locked Accounts" value={stats.lockedAdmins}   color="bg-gray-600" />
                </div>

                {/* Recent admins */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Recent Admins</h2>
                    <button onClick={() => setTab('admins')} className="text-xs text-[#ffa800] font-semibold hover:underline">View all →</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {admins.slice(0, 5).map(a => (
                      <div key={a.id} className="px-6 py-3 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}>
                          {a.name[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{a.name}</p>
                          <p className="text-xs text-gray-400 truncate">{a.email}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{a.role}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.accountStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.accountStatus}</span>
                      </div>
                    ))}
                    {admins.length === 0 && <p className="px-6 py-8 text-center text-gray-400 text-sm">No admins yet</p>}
                  </div>
                </div>

                {/* Recent invites */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Recent Invites</h2>
                    <button onClick={() => setTab('invites')} className="text-xs text-[#ffa800] font-semibold hover:underline">View all →</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {invites.slice(0, 5).map(inv => (
                      <div key={inv.id} className="px-6 py-3 flex items-center gap-4">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{inv.email}</p>
                          <p className="text-xs text-gray-400">Expires {new Date(inv.expiresAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          inv.isActive  ? 'bg-green-50 text-green-700 border-green-200' :
                          inv.used      ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          inv.revokedAt ? 'bg-red-50 text-red-700 border-red-200' :
                                          'bg-orange-50 text-orange-700 border-orange-200'
                        }`}>
                          {inv.isActive ? 'Active' : inv.used ? 'Used' : inv.revokedAt ? 'Revoked' : 'Expired'}
                        </span>
                        {inv.isActive && <CopyBtn text={inv.inviteLink} label="Copy" />}
                      </div>
                    ))}
                    {invites.length === 0 && <p className="px-6 py-8 text-center text-gray-400 text-sm">No invites yet. Click "Generate Invite" to create one.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ── ADMINS TAB ── */}
            {tab === 'admins' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search admins..."
                      className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#ffa800] focus:outline-none" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Admin</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Logins</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredAdmins.map(a => (
                        <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}>
                                {a.name[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{a.name}</p>
                                <p className="text-xs text-gray-400">{a.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${a.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{a.role}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold w-fit ${a.accountStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${a.accountStatus === 'approved' ? 'bg-green-500' : 'bg-red-500'}`} />
                                {a.accountStatus}
                              </span>
                              {a.isLocked && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 w-fit">
                                  <Lock className="w-2.5 h-2.5" /> Locked
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{a.loginCount}</td>
                          <td className="px-6 py-4 text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {a.isLocked && (
                                <button onClick={() => handleUnlock(a.id)} title="Unlock account"
                                  className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50 transition-colors">
                                  <UserCheck className="w-4 h-4" />
                                </button>
                              )}
                              {a.role !== 'SUPERADMIN' && (
                                <>
                                  <button onClick={() => handleToggleBlock(a.id, a.accountStatus)} title={a.accountStatus === 'blocked' ? 'Unblock' : 'Block'}
                                    className={`p-1.5 rounded-lg transition-colors ${a.accountStatus === 'blocked' ? 'text-green-500 hover:bg-green-50' : 'text-yellow-500 hover:bg-yellow-50'}`}>
                                    {a.accountStatus === 'blocked' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                                  </button>
                                  <button onClick={() => handleDeleteAdmin(a.id, a.name)} title="Delete admin"
                                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredAdmins.length === 0 && (
                        <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">No admins found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── INVITES TAB ── */}
            {tab === 'invites' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email..."
                      className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#ffa800] focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredInvites.map(inv => (
                    <motion.div key={inv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="font-bold text-gray-900">{inv.email}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            inv.isActive  ? 'bg-green-50 text-green-700 border-green-200' :
                            inv.used      ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            inv.revokedAt ? 'bg-red-50 text-red-700 border-red-200' :
                                            'bg-orange-50 text-orange-700 border-orange-200'
                          }`}>
                            {inv.isActive ? '● Active' : inv.used ? '✓ Used' : inv.revokedAt ? '✕ Revoked' : '⏱ Expired'}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${inv.role === 'ADMIN' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>
                            {inv.role}
                          </span>
                        </div>
                        {inv.isActive && (
                          <button onClick={() => handleRevokeInvite(inv.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200">
                            <Trash2 className="w-3 h-3" /> Revoke
                          </button>
                        )}
                      </div>

                      {/* Invite link — always visible for active */}
                      {inv.isActive && (
                        <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Link2 className="w-4 h-4 text-[#ffa800]" />
                            <span className="text-xs font-bold text-[#ffa800] uppercase tracking-wide">Invite Link — Share This!</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 px-3 py-2 bg-white border border-orange-200 rounded-lg text-xs font-mono text-gray-700 truncate select-all">
                              {inv.inviteLink}
                            </code>
                            <CopyBtn text={inv.inviteLink} label="Copy Link" />
                            <a href={inv.inviteLink} target="_blank" rel="noopener noreferrer"
                              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="px-6 py-3 flex items-center justify-between text-xs text-gray-400">
                        <span>Created by <strong className="text-gray-600">{inv.invitedByEmail}</strong> · Expires {new Date(inv.expiresAt).toLocaleDateString()}</span>
                        {inv.failedAttempts > 0 && (
                          <span className="text-orange-600 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {inv.failedAttempts} failed attempt{inv.failedAttempts > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {filteredInvites.length === 0 && (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                      <Key className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No invites yet</p>
                      <p className="text-gray-400 text-sm mt-1">Click "Generate Invite" to create your first invite link</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Generate Invite Modal */}
      <AnimatePresence>
        {showModal && (
          <GenerateInviteModal
            onClose={() => setShowModal(false)}
            onSuccess={(invite) => {
              setShowModal(false);
              fetchAll();
              setTab('invites');
              showToast('Invite created! Link is ready to copy.');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Generate Invite Modal ─────────────────────────────────── */
function GenerateInviteModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (inv: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [created, setCreated] = useState<any>(null);
  const [form, setForm] = useState({
    email: '', mobileNumber: '', role: 'ADMIN' as 'ADMIN' | 'ORGANIZATION',
    note: '', expiresInDays: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: name === 'expiresInDays' ? parseInt(value) || 1 : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const res = await api.post('/api/admin/invites', form);
      setCreated(res.data.invite);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create invite');
    } finally {
      setLoading(false);
    }
  };

  /* Success screen */
  if (created) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Invite Created! 🎉</h2>
          <p className="text-gray-500 text-sm">Copy the link below and send it to <strong>{created.email}</strong></p>
        </div>

        {/* Big invite link box */}
        <div className="rounded-2xl p-1 mb-6 shadow-lg" style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}>
          <div className="bg-white rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="w-5 h-5 text-[#ffa800]" />
              <span className="font-bold text-gray-900 text-sm uppercase tracking-wide">Invite Link — Share This!</span>
            </div>
            <code className="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-mono text-gray-800 break-all select-all mb-3">
              {created.inviteLink}
            </code>
            <div className="flex gap-2">
              <CopyBtn text={created.inviteLink} label="Copy Invite Link" />
              <a href={created.inviteLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Open
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Email',   value: created.email },
            { label: 'Mobile',  value: created.mobileNumber },
            { label: 'Role',    value: created.role },
            { label: 'Expires', value: new Date(created.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
              <p className="font-bold text-gray-900 text-sm">{value}</p>
            </div>
          ))}
        </div>

        <button onClick={() => onSuccess(created)}
          className="w-full py-3 rounded-xl font-bold text-white text-sm"
          style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}>
          Done
        </button>
      </motion.div>
    </motion.div>
  );

  /* Create form */
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Key className="w-6 h-6 text-[#ffa800]" /> Generate Admin Invite
        </h2>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              placeholder="admin@example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#ffa800] focus:outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Mobile Number *</label>
            <input type="tel" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} required
              placeholder="+91 9876543210"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#ffa800] focus:outline-none transition-colors" />
            <p className="text-xs text-gray-400 mt-1">Include country code. Invited user must enter this exact number.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Role *</label>
              <select name="role" value={form.role} onChange={handleChange} required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#ffa800] focus:outline-none transition-colors">
                <option value="ADMIN">Admin</option>
                <option value="ORGANIZATION">Organization</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Expires In (Days) *</label>
              <input type="number" name="expiresInDays" value={form.expiresInDays} onChange={handleChange}
                min="1" max="30" required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#ffa800] focus:outline-none transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Note (Optional)</label>
            <textarea name="note" value={form.note} onChange={handleChange} rows={2} maxLength={200}
              placeholder="e.g. For Acme Corp HR team"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#ffa800] focus:outline-none transition-colors resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 font-bold text-white rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}>
              {loading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
                : <><Plus className="w-4 h-4" /> Generate Invite</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
