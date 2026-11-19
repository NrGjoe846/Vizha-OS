'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import { EventStatus, EventModel } from '@/lib/types';
import {
  CalendarDays,
  Plus,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Filter,
  CheckCircle2
} from 'lucide-react';

export default function EventsPage() {
  const { events, addEvent, clients, venues } = useERP();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Event Form State
  const [formData, setFormData] = useState({
    title: '',
    eventType: 'Luxury Wedding',
    clientName: clients[0]?.name || 'Rahul Oberoi',
    clientId: clients[0]?.id || 'c-1',
    venueName: venues[0]?.name || 'The Grand Oberoi Ballroom, Mumbai',
    venueId: venues[0]?.id || 'v-1',
    managerName: 'Priya Sharma',
    startDate: '2026-12-10',
    endDate: '2026-12-12',
    guestCount: 500,
    status: 'planning' as EventStatus,
    budget: 4500000,
    actualSpend: 0,
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80'
  });

  const filteredEvents = filterStatus === 'all'
    ? events
    : events.filter(e => e.status === filterStatus);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent(formData);
    setIsModalOpen(false);
  };

  const statusColors: Record<EventStatus, string> = {
    draft: 'bg-slate-100 text-slate-800 border-slate-200',
    planning: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    in_progress: 'bg-emerald-100 text-emerald-800 border-emerald-200 animate-pulse',
    completed: 'bg-slate-100 text-slate-600 border-slate-200',
    cancelled: 'bg-rose-100 text-rose-800 border-rose-200'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Event Productions</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {events.length} Total Productions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end production operations, minute-by-minute run of show, and milestone execution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 shadow-xs"
          >
            <option value="all">All Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="planning">Planning Phase</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Production</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => {
          const budgetPercent = Math.min(100, Math.round((evt.actualSpend / (evt.budget || 1)) * 100));

          return (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col"
            >
              {/* Event Cover Image */}
              <div className="h-44 relative overflow-hidden bg-slate-900">
                <img
                  src={evt.coverImage}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md ${statusColors[evt.status]}`}>
                    {evt.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-mono font-bold bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-md">
                    {evt.code}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">{evt.eventType}</span>
                  <h3 className="text-sm font-bold truncate leading-snug">{evt.title}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{evt.venueName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <CalendarDays className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{evt.startDate} &rarr; {evt.endDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{evt.guestCount} Guests</span>
                    </span>
                    <span className="font-medium text-slate-700">Client: {evt.clientName}</span>
                  </div>
                </div>

                {/* Budget Utilization bar */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Budget Spent:</span>
                    <span className="font-bold text-slate-900">
                      ₹{(evt.actualSpend / 100000).toFixed(1)}L / ₹{(evt.budget / 100000).toFixed(1)}L ({budgetPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        budgetPercent > 90 ? 'bg-rose-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${budgetPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Card Action Link */}
                <Link
                  href={`/events/${evt.id}`}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Open Run of Show & Operations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: New Event Production */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900">Create Event Production</h2>
            <p className="text-xs text-slate-500 mt-0.5">Initialize budget, venue selection, and staging itinerary</p>

            <form onSubmit={handleCreateEvent} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Production Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Sangeet & Reception Gala"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Event Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Luxury Wedding">Luxury Wedding</option>
                    <option value="Corporate Summit">Corporate Summit</option>
                    <option value="Live Concert">Live Concert / Music Festival</option>
                    <option value="Milestone Gala">Milestone Gala</option>
                    <option value="Product Launch">Product Launch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client Profile *</label>
                  <select
                    value={formData.clientName}
                    onChange={(e) => {
                      const selected = clients.find(c => c.name === e.target.value);
                      setFormData({
                        ...formData,
                        clientName: e.target.value,
                        clientId: selected?.id || 'c-1'
                      });
                    }}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.companyName || 'Private'})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Venue Assignment</label>
                <select
                  value={formData.venueName}
                  onChange={(e) => {
                    const selected = venues.find(v => v.name === e.target.value);
                    setFormData({
                      ...formData,
                      venueName: e.target.value,
                      venueId: selected?.id || 'v-1'
                    });
                  }}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {venues.map(v => (
                    <option key={v.id} value={v.name}>{v.name} ({v.city})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Budget (₹)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Guest Headcount</label>
                  <input
                    type="number"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  Create Production
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
