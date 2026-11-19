'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useERP } from '@/lib/store';
import {
  Layers,
  Lock,
  Mail,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  Users
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function LoginPage() {
  const router = useRouter();
  const { switchUser, users, currentUser } = useERP();
  const [email, setEmail] = useState('admin@vizha.test');
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
      <div className="w-full max-w-4xl bg-white rounded-xl border border-zinc-200 shadow-elevated overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Branding Panel */}
        <div className="md:col-span-5 bg-zinc-950 p-8 flex flex-col justify-between text-white">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-lg tracking-tight">Vizha OS</span>
                <span className="block text-[10px] text-zinc-400 font-mono uppercase tracking-wider">Enterprise ERP</span>
              </div>
            </div>

            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Modern Event Production Platform
              </h2>
              <p className="text-xs text-zinc-400 mt-1 font-normal leading-relaxed">
                Turnkey multi-tenant operations for luxury weddings, corporate summits, festivals, and venue networks.
              </p>
            </div>

            <div className="space-y-2 text-xs text-zinc-300 font-normal pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Next.js 15 + React 19 + TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Supabase Cloud PostgreSQL & Prisma ORM</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero legacy code &bull; 100% Full-Stack TS</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800 text-[11px] font-mono text-zinc-500">
            Current Session: {currentUser.roleTitle}
          </div>
        </div>

        {/* Right Auth & Persona Grid */}
        <div className="md:col-span-7 p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-950 tracking-tight">Sign In</h3>
              <Badge variant="purple" dot className="font-mono text-[10px]">Instant RBAC</Badge>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">Enter credentials or switch to a demo persona below</p>
          </div>

          {/* Regular Login Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-3.5 h-3.5" />}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-3.5 h-3.5" />}
            />
            <Button variant="primary" size="md" className="w-full text-xs" type="submit">
              Sign In to Console
            </Button>
          </form>

          {/* 1-Click Persona Switcher */}
          <div className="pt-4 border-t border-zinc-100 space-y-2.5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
              1-Click Demo Personas
            </p>
            <div className="grid grid-cols-2 gap-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleDemoSwitch(u.role)}
                  className={`p-2 rounded-lg border text-left flex items-center gap-2 hover:bg-zinc-50 transition-colors ${
                    currentUser.id === u.id
                      ? 'border-zinc-950 bg-zinc-50/80'
                      : 'border-zinc-200/80 bg-white'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-zinc-900 truncate leading-tight">{u.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate leading-tight">{u.roleTitle}</p>
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
