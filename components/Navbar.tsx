'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import {
  Calendar,
  Sparkles,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  Database,
  Building2,
  UserCheck
} from 'lucide-react';

export function Navbar() {
  const { currentUser, switchUser, users, resetDemoData } = useERP();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const roleColors: Record<string, string> = {
    super_admin: 'bg-purple-100 text-purple-800 border-purple-200',
    event_manager: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    sales_executive: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    accountant: 'bg-amber-100 text-amber-800 border-amber-200',
    operations: 'bg-blue-100 text-blue-800 border-blue-200',
    client: 'bg-rose-100 text-rose-800 border-rose-200',
    vendor: 'bg-teal-100 text-teal-800 border-teal-200',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">EventFlow</span>
                <span className="text-xs px-1.5 py-0.5 rounded font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">ERP 2.0</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Enterprise Event Production & Operations</p>
            </div>
          </Link>

          {/* Database connection badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 ml-4 font-medium">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase Ready</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>

        {/* Right: Quick Role Switcher & Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Switcher dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-300"
              />
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-900">{currentUser.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${roleColors[currentUser.role] || 'bg-slate-100 text-slate-700'}`}>
                    {currentUser.roleTitle}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal">{currentUser.branchName || 'Headquarters'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Switch Demo Role (Instant RBAC)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Test permissions & portals with one click</p>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.role);
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                        currentUser.id === u.id ? 'bg-indigo-50/70' : ''
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900 truncate">{u.name}</p>
                          {currentUser.id === u.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{u.roleTitle} &bull; {u.branchName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data button */}
          <button
            onClick={() => {
              if (confirmReset) {
                resetDemoData();
                setConfirmReset(false);
              } else {
                setConfirmReset(true);
                setTimeout(() => setConfirmReset(false), 3000);
              }
            }}
            title="Reset to fresh demo dataset"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              confirmReset
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${confirmReset ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{confirmReset ? 'Confirm Reset?' : 'Reset Data'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
