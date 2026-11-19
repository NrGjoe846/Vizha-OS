'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import {
  MapPin,
  Plus,
  Users,
  Star,
  CheckCircle2,
  Phone,
  Sparkles
} from 'lucide-react';

export default function VenuesPage() {
  const { venues, addVenue } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Luxury Hotel Ballroom',
    city: 'Mumbai',
    address: '',
    capacity: 1000,
    rentalRate: 500000,
    contactName: 'General Manager',
    contactPhone: '+91 98200 11223',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80',
    amenities: ['Central Air-Con', 'Valet Parking', 'Green Rooms', 'Rigging Points'],
    isAvailable: true
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addVenue(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Partner Venues & Locations</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {venues.length} Curated Venues
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Palace grounds, convention centers, luxury ballrooms, and oceanfront resorts with technical capacities.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Partner Venue</span>
        </button>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {venues.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
          >
            <div className="h-48 relative overflow-hidden bg-slate-900">
              <img
                src={v.imageUrl}
                alt={v.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                  {v.type}
                </span>
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{v.rating}</span>
              </div>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="text-base font-bold truncate">{v.name}</h3>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span>{v.address}</span>
                </p>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Capacity: {v.capacity.toLocaleString()} Pax</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">Day Rental:</span>
                  <p className="font-extrabold text-sm text-indigo-700">₹{v.rentalRate.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {v.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Contact: {v.contactName}</span>
                <span className="font-mono">{v.contactPhone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Venue */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900">Add Partner Venue</h2>

            <form onSubmit={handleCreate} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Venue Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taj Falaknuma Palace Lawns"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Venue Type</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Address</label>
                <input
                  type="text"
                  required
                  placeholder="Street, District, Pincode"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Capacity (Pax)</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Rental (₹)</label>
                  <input
                    type="number"
                    value={formData.rentalRate}
                    onChange={(e) => setFormData({ ...formData, rentalRate: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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
                  Save Venue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
