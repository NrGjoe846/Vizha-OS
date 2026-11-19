'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import {
  Boxes,
  Plus,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Tag,
  DollarSign
} from 'lucide-react';

export default function InventoryPage() {
  const { inventory, addInventoryItem } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    sku: 'AV-LED-P3',
    name: '',
    category: 'Visual Displays',
    totalQty: 50,
    allocatedQty: 20,
    rentalPrice: 2000,
    condition: 'Good' as const,
    location: 'Warehouse Mumbai Bay-2'
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryItem(formData);
    setIsModalOpen(false);
  };

  const totalAssets = inventory.reduce((acc, i) => acc + i.totalQty, 0);
  const allocatedAssets = inventory.reduce((acc, i) => acc + i.allocatedQty, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Inventory & AV Gear Equipment</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {inventory.length} Gear Categories
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track consoles, intelligent lighting, trussing, Tiffany seating, and production staging equipment across warehouses.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Equipment Item</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Equipment in Fleet</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{totalAssets.toLocaleString()} Units</p>
            <p className="text-xs text-slate-400 mt-1">Stored across Mumbai & Delhi facilities</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Currently Staged on Productions</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-2">{allocatedAssets.toLocaleString()} Units</p>
            <p className="text-xs text-slate-400 mt-1">{totalAssets > 0 ? Math.round((allocatedAssets / totalAssets) * 100) : 0}% fleet utilization</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">In Stock</th>
                <th className="py-3 px-4 text-center">Allocated</th>
                <th className="py-3 px-4 text-right">Day Hire Rate</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Storage Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{item.sku}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900">{item.totalQty}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-700">{item.allocatedQty}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    ₹{item.rentalPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.condition}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 flex items-center gap-1.5 pt-4">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.location}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Equipment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900">Add Fleet Equipment</h2>

            <form onSubmit={handleCreate} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Equipment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. L-Acoustics K2 Line Array Speaker Box"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Sound & Engineering">Sound & Engineering</option>
                    <option value="Visual Displays">Visual Displays</option>
                    <option value="Intelligent Lighting">Intelligent Lighting</option>
                    <option value="Furniture & Seating">Furniture & Seating</option>
                    <option value="Stage Trussing">Stage Trussing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Quantity</label>
                  <input
                    type="number"
                    value={formData.totalQty}
                    onChange={(e) => setFormData({ ...formData, totalQty: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rental Price (₹)</label>
                  <input
                    type="number"
                    value={formData.rentalPrice}
                    onChange={(e) => setFormData({ ...formData, rentalPrice: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Storage Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
