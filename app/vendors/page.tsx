'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import {
  Truck,
  Plus,
  Star,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function VendorsPage() {
  const { vendors, addVendor } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    category: 'Sound & Engineering',
    phone: '',
    email: '',
    city: 'Mumbai',
    rating: 4.8,
    gstin: '',
    status: 'preferred' as const
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addVendor(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Vendors & Subcontractors</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {vendors.length} Partner Suppliers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sound engineers, floral artists, banquet caterers, cinematographers, and stage fabrication crews.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vendor Partner</span>
        </button>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((ven) => (
          <div
            key={ven.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{ven.companyName}</h3>
                  <p className="text-xs font-medium text-indigo-600">{ven.category}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{ven.rating}</span>
                </div>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                <p className="font-medium text-slate-800">Lead Contact: {ven.name}</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>{ven.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">{ven.email}</span>
                </div>
                {ven.gstin && (
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                    <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>GSTIN: {ven.gstin}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">{ven.city}</span>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                ven.status === 'preferred'
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {ven.status} Partner
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Vendor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900">Add Vendor Partner</h2>

            <form onSubmit={handleCreate} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Studio Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CineStyle Cinematic 4K Productions"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Sound & Engineering">Sound & Engineering</option>
                  <option value="Floral & Decor">Floral & Decor</option>
                  <option value="Catering & Hospitality">Catering & Hospitality</option>
                  <option value="Photography & 4K Cinema">Photography & 4K Cinema</option>
                  <option value="Stage Fabrication & Pyros">Stage Fabrication & Pyros</option>
                  <option value="Security & Bouncers">Security & Bouncers</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farhan Qureshi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98200 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@vendor.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN</label>
                <input
                  type="text"
                  placeholder="27AAMCS8899N1Z5"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono"
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
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
