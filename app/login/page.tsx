'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useERP } from '@/lib/store';
import {
  Calendar,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { switchUser, users, currentUser } = useERP();
  const [email, setEmail] = useState('admin@eventflow.test');
  const [password, setPassword] = useState('password');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      switchUser(matched.role);
    } else {
      switchUser('super_admin');
    }
    router.push('/dashboard');
  };

  const handleDemoSwitch = (role: string) => {
    switchUser(role);
    if (role === 'client') {
      router.push('/portal/client');
    } else if (role === 'vendor') {
      router.push('/portal/vendor');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Branding Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-8 flex flex-col justify-between text-white relative">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight">Vizha<span className="text-amber-400"> OS</span></span>
                <span className="block text-[10px] text-indigo-300 font-bold tracking-widest uppercase">ERP 2.0</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-extrabold leading-snug">Enterprise Event Lifecycle Management</h2>
              <p className="text-xs text-indigo-200/80 mt-2 font-light">
                Unified system for luxury weddings, corporate summits, global concert festivals, and turnkey venue operations.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-indigo-100 font-medium pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-Tenant & Multi-Branch Architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lead CRM, Quotes & Automated 18% GST Invoicing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Run-of-Show Schedules & Staging Cues</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live RSVP & Gate QR Check-in System</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-indigo-800/60 text-[11px] text-indigo-300">
            Vizha OS &bull; Built with Next.js 15, TypeScript & Supabase
          </div>
        </div>

        {/* Right Sign In Panel */}
        <div className="md:col-span-7 p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to ERP</h3>
            <p className="text-xs text-slate-500 mt-1">Enter your credentials or choose a 1-click demo role below.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-indigo-200 text-xs transition flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Quick 1-Click Demo Personas
            </span>

            <div className="grid grid-cols-2 gap-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleDemoSwitch(u.role)}
                  className="p-2 text-left rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex items-center gap-2"
                >
                  <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{u.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-500 truncate">{u.roleTitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
