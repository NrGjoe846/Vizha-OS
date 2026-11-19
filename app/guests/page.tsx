'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import {
  Users,
  Plus,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  UserCheck2,
  Sparkles,
  Utensils
} from 'lucide-react';

export default function GuestsPage() {
  const { guests, addGuest, toggleGuestCheckIn, events } = useERP();
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    eventId: events[0]?.id || 'evt-2026-001',
    eventTitle: events[0]?.title || 'The Royal Oberoi Grand Wedding',
    name: '',
    email: '',
    phone: '',
    group: 'VIP' as const,
    tableNo: 'V-05',
    plusOnes: 1,
    dietaryPref: 'Jain Pure Vegetarian'
  });

  const filteredGuests = guests.filter((g) => {
    const matchesGroup = filterGroup === 'all' || g.group === filterGroup;
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.passCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tableNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const checkedInCount = guests.filter(g => g.isCheckedIn).length;
  const checkInRate = guests.length > 0 ? Math.round((checkedInCount / guests.length) * 100) : 0;

  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    addGuest(formData);
    setIsModalOpen(false);
    setFormData({
      eventId: events[0]?.id || 'evt-2026-001',
      eventTitle: events[0]?.title || 'The Royal Oberoi Grand Wedding',
      name: '',
      email: '',
      phone: '',
      group: 'VIP',
      tableNo: 'V-05',
      plusOnes: 1,
      dietaryPref: 'Jain Pure Vegetarian'
    });
  };

  const groupColors: Record<string, string> = {
    VIP: 'bg-purple-100 text-purple-800 border-purple-200',
    Family: 'bg-rose-100 text-rose-800 border-rose-200',
    Corporate: 'bg-blue-100 text-blue-800 border-blue-200',
    Media: 'bg-amber-100 text-amber-800 border-amber-200',
    General: 'bg-slate-100 text-slate-800 border-slate-200'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Guests, RSVPs & Gate Check-in</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {guests.length} Registered Guests
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage seating charts, dietary preferences, unique passcodes, and 1-click gate admission.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Guest RSVP</span>
        </button>
      </div>

      {/* Check-in Progress Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-700">Live Turnstile Admission Rate</span>
            <span className="font-bold text-indigo-700">{checkedInCount} / {guests.length} Admitted ({checkInRate}%)</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${checkInRate}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, pass, or table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 shadow-xs"
          >
            <option value="all">All Groups</option>
            <option value="VIP">VIP</option>
            <option value="Family">Family</option>
            <option value="Corporate">Corporate</option>
            <option value="Media">Media</option>
          </select>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">Group</th>
                <th className="py-3 px-4">Table / Seating</th>
                <th className="py-3 px-4">Pass Code</th>
                <th className="py-3 px-4">Dietary Preference</th>
                <th className="py-3 px-4">Plus Ones</th>
                <th className="py-3 px-4">Gate Status</th>
                <th className="py-3 px-4 text-center">Admission Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuests.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{g.name}</p>
                    <p className="text-[10px] text-slate-400">{g.phone || g.email}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${groupColors[g.group] || 'bg-slate-100'}`}>
                      {g.group}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{g.tableNo}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 font-semibold">{g.passCode}</td>
                  <td className="py-3.5 px-4 text-slate-700 flex items-center gap-1.5 pt-4">
                    <Utensils className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{g.dietaryPref}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">+{g.plusOnes}</td>
                  <td className="py-3.5 px-4">
                    {g.isCheckedIn ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Admitted ({g.checkInTime?.split(' ')[1] || 'Checked In'})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => toggleGuestCheckIn(g.id)}
                      className={`px-3 py-1 rounded text-[11px] font-bold transition-all shadow-xs ${
                        g.isCheckedIn
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {g.isCheckedIn ? 'Undo Check-in' : 'Admit Now'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Guest */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900">Add Guest RSVP</h2>

            <form onSubmit={handleCreateGuest} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Guest Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand & Radhika Piramal"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Guest Category</label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value as any })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Family">Family</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Media">Media</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Table Number</label>
                  <input
                    type="text"
                    value={formData.tableNo}
                    onChange={(e) => setFormData({ ...formData, tableNo: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98200 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Plus-Ones</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.plusOnes}
                    onChange={(e) => setFormData({ ...formData, plusOnes: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dietary Preference</label>
                <select
                  value={formData.dietaryPref}
                  onChange={(e) => setFormData({ ...formData, dietaryPref: e.target.value })}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Jain Pure Vegetarian">Jain Pure Vegetarian</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                </select>
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
                  Confirm Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
