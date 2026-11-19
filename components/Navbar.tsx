'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import {
  Sparkles,
  ChevronDown,
  RotateCcw,
  Check,
  Database,
  Search,
  Command,
  Layers,
  LogOut,
  User,
  Building2,
  Menu,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const BRANCHES = [
  'All Branches',
  'Mumbai HQ',
  'Delhi NCR',
  'Bangalore Hub'
];

export function Navbar() {
  const {
    currentUser,
    switchUser,
    users,
    resetDemoData,
    selectedBranch,
    setSelectedBranch,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useERP();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 no-print transition-colors">
      <div className="px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Left: Mobile Menu Toggle & Brand Identity */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white shadow-xs group-hover:bg-zinc-800 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-zinc-950 font-sans">
                Vizha OS
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 font-medium">
                v2.0
              </span>
            </div>
          </Link>

          {/* Branch Governance Selector */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-md px-2 py-1 text-xs font-medium text-zinc-800 focus:outline-none cursor-pointer"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Minimal Supabase Live Badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-zinc-600 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200/60 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Supabase Live</span>
          </div>
        </div>

        {/* Center: Search pill */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => {
              const el = document.getElementById('global-search');
              if (el) el.focus();
            }}
            className="flex items-center gap-3 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-lg text-xs text-zinc-400 transition-colors w-64 justify-between"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span>Quick navigation...</span>
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white border border-zinc-200 rounded text-zinc-500 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Role Switcher & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-zinc-100 border border-zinc-200/80 transition-colors text-left"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-zinc-200"
              />
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-zinc-900 leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-zinc-500 leading-none mt-0.5">{currentUser.roleTitle}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-zinc-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-zinc-100">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 font-mono">
                    Instant Persona Switcher
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">Switch role to preview permissions</p>
                </div>
                <div className="max-h-72 overflow-y-auto py-1">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.role);
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-zinc-50 transition-colors ${
                        currentUser.id === u.id ? 'bg-zinc-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                        <div className="truncate">
                          <p className="text-xs font-medium text-zinc-900 truncate">{u.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{u.roleTitle}</p>
                        </div>
                      </div>
                      {currentUser.id === u.id && (
                        <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="px-3 py-2 border-t border-zinc-100 flex items-center justify-between">
                  <Link
                    href="/login"
                    onClick={() => setDropdownOpen(false)}
                    className="text-xs text-zinc-600 hover:text-zinc-950 flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Switch Screen</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirmReset) {
                resetDemoData();
                setConfirmReset(false);
              } else {
                setConfirmReset(true);
                setTimeout(() => setConfirmReset(false), 3000);
              }
            }}
            className={confirmReset ? 'border-rose-300 text-rose-600 bg-rose-50' : ''}
            icon={<RotateCcw className={`w-3.5 h-3.5 ${confirmReset ? 'animate-spin' : ''}`} />}
          >
            <span className="hidden md:inline">{confirmReset ? 'Confirm Reset?' : 'Reset'}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
