'use client';

import React from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import {
  Truck,
  CalendarDays,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export default function VendorPortalPage() {
  const { events, currentUser } = useERP();

  const assignedEvent = events[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md mb-3 border border-white/20">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
          <span>Vendor Partner Work Orders & AV Dispatch</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Welcome, {currentUser.name}
        </h1>
        <p className="text-teal-200 text-xs mt-1">
          SoundCraft Pro Audio & Visuals &bull; Work Order #WO-2026-902
        </p>
      </div>

      {/* Production Assignment */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Contracted Production</span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">{assignedEvent.title}</h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase bg-teal-50 text-teal-800 border border-teal-200">
            Work Order Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>{assignedEvent.venueName}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-teal-600" />
            <span>Setup & Soundcheck: {assignedEvent.startDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Show Producer: {assignedEvent.managerName}</span>
          </div>
        </div>
      </div>

      {/* Technical Scope of Work & Rigging Notes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Technical Scope of Work & Rigging Cue Schedule</h3>
        <div className="space-y-3">
          {assignedEvent.schedules.map((sch) => (
            <div key={sch.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-start justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {sch.timeSlot}
                  </span>
                  <span className="font-bold text-slate-900">{sch.title}</span>
                </div>
                {sch.cueNotes && (
                  <div className="mt-2 text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>AV Cue: {sch.cueNotes}</span>
                  </div>
                )}
              </div>
              <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                Coordination: {sch.leadPerson}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Subcontractor Financials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agreed Contract Value</span>
          <p className="text-2xl font-extrabold text-slate-900">₹8,50,000</p>
          <p className="text-xs text-slate-500">Includes Line Array Audio, Intelligent Moving Lights & LED Wall</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobilization Advance Cleared</span>
          <p className="text-2xl font-extrabold text-emerald-600">₹5,00,000</p>
          <p className="text-xs text-slate-500">Balance ₹3,50,000 upon strike & de-rigging sign-off</p>
        </div>
      </div>
    </div>
  );
}
