'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, LogOut, RefreshCw } from 'lucide-react';

interface AdminUser {
  id: string; name: string; email: string; role: string;
  accountStatus: string; loginCount: number; createdAt: string;
}

export default function SuperAdminDashboard() {
  const router  = useRouter();
  const [admins, setAdmins]   = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.user || d.user.role !== 'SUPERADMIN') router.replace('/superadmin/login');
        else loadAdmins();
      })
      .catch(() => router.replace('/superadmin/login'));
  }, [router]);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/superadmin/admins');
      const data = await res.json();
      if (data.success) setAdmins(data.admins || []);
      else setError(data.error || 'Failed to load admins');
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/superadmin/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg">Superadmin Dashboard</h1>
            <p className="text-xs text-slate-400">Adyapan Platform Control</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadAdmins} className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </button>
          <button onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-semibold transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Admins', value: admins.length, icon: '👑', color: 'from-purple-600 to-indigo-600' },
            { label: 'Active Admins', value: admins.filter(a => a.accountStatus === 'approved').length, icon: '✅', color: 'from-green-600 to-emerald-600' },
            { label: 'Total Logins', value: admins.reduce((s, a) => s + (a.loginCount || 0), 0), icon: '🔐', color: 'from-blue-600 to-cyan-600' },
            { label: 'Platform', value: 'Live', icon: '🚀', color: 'from-orange-500 to-amber-500' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg mb-3`}>{s.icon}</div>
              <div className="text-2xl font-extrabold">{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Admins table */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <h2 className="font-bold">Admin Accounts</h2>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-400">{error}</div>
          ) : admins.length === 0 ? (
            <div className="p-6 text-center text-slate-400">No admin accounts found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Role</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Logins</th>
                    <th className="px-6 py-3 text-left">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, i) => (
                    <motion.tr key={admin.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 font-semibold">{admin.name}</td>
                      <td className="px-6 py-4 text-slate-300">{admin.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${admin.role === 'SUPERADMIN' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${admin.accountStatus === 'approved' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                          {admin.accountStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{admin.loginCount || 0}</td>
                      <td className="px-6 py-4 text-slate-400">{new Date(admin.createdAt).toLocaleDateString('en-IN')}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
