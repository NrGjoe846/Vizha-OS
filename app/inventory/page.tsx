'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import {
  Package,
  Plus,
  MapPin,
  Search,
  CheckCircle2,
  AlertTriangle,
  Boxes
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { StatCard } from '@/components/ui/StatCard';
import { Tabs } from '@/components/ui/Tabs';
import { formatCurrency, formatNumber } from '@/lib/format';

export default function InventoryPage() {
  const { inventory, addInventoryItem } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const categories = [
    { id: 'all', label: 'All Fleet', count: inventory.length },
    { id: 'Sound & Audio', label: 'Sound' },
    { id: 'Lighting & FX', label: 'Lighting' },
    { id: 'Visual Displays', label: 'LED & Screens' },
    { id: 'Staging & Trussing', label: 'Trussing' },
  ];

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Inventory & Fleet"
        description="Sound consoles, intelligent lighting rigs, LED video walls, trussing, and staging equipment."
        badge={
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            {inventory.length} Gear Categories
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="w-52">
              <Input
                placeholder="Search gear by SKU or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-3.5 h-3.5" />}
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Equipment
            </Button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Total Fleet Units"
          value={`${formatNumber(totalAssets)} Units`}
          icon={<Package className="w-4 h-4" />}
          description="Stored across Mumbai & Delhi staging warehouses"
        />
        <StatCard
          label="Active Dispatches"
          value={`${formatNumber(allocatedAssets)} Units`}
          change={`${Math.round((allocatedAssets / (totalAssets || 1)) * 100)}% utilization`}
          changeType="positive"
          icon={<Boxes className="w-4 h-4" />}
          description="Deployed across live production sites"
        />
      </div>

      {/* Category Tabs */}
      <Tabs
        items={categories}
        activeId={selectedCategory}
        onChange={setSelectedCategory}
      />

      {/* Equipment Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200/80 text-zinc-500 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Equipment Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Warehouse Bay</th>
                <th className="py-3 px-4">Stock Utilization</th>
                <th className="py-3 px-4">Daily Rental</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4 text-right">Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filteredInventory.map((item) => {
                const available = item.totalQty - item.allocatedQty;
                const utilRate = Math.round((item.allocatedQty / item.totalQty) * 100);

                return (
                  <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-zinc-900">{item.sku}</td>
                    <td className="py-3 px-4 font-semibold text-zinc-950">{item.name}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-500 flex items-center gap-1.5 mt-2">
                      <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span>{item.location}</span>
                    </td>
                    <td className="py-3 px-4 min-w-[140px]">
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1">
                        <span>{item.allocatedQty} / {item.totalQty}</span>
                        <span>{utilRate}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${utilRate > 80 ? 'bg-amber-500' : 'bg-zinc-900'}`}
                          style={{ width: `${utilRate}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-zinc-900">
                      ₹{formatCurrency(item.rentalPrice)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          item.condition === 'Good'
                            ? 'success'
                            : item.condition === 'Maintenance'
                            ? 'warning'
                            : 'danger'
                        }
                        dot
                      >
                        {item.condition}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-zinc-950">
                      {available} units
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Equipment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Equipment to Fleet"
        description="Register staging equipment, serial stock, and rental rates."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreate}>
              Save Equipment
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="SKU Identifier"
              required
              placeholder="e.g. AV-LINE-K2"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />
            <Input
              label="Equipment Name"
              required
              placeholder="e.g. L-Acoustics K2 Line Array Speaker"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Fleet Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Sound & Audio">Sound & Audio</option>
              <option value="Lighting & FX">Lighting & FX</option>
              <option value="Visual Displays">Visual Displays</option>
              <option value="Staging & Trussing">Staging & Trussing</option>
              <option value="Power & Rigging">Power & Rigging</option>
            </Select>

            <Select
              label="Physical Condition"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
            >
              <option value="Good">Good</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Damaged">Damaged</option>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Total Qty"
              type="number"
              value={formData.totalQty}
              onChange={(e) => setFormData({ ...formData, totalQty: Number(e.target.value) })}
            />
            <Input
              label="Dispatched Qty"
              type="number"
              value={formData.allocatedQty}
              onChange={(e) => setFormData({ ...formData, allocatedQty: Number(e.target.value) })}
            />
            <Input
              label="Daily Rental (₹)"
              type="number"
              value={formData.rentalPrice}
              onChange={(e) => setFormData({ ...formData, rentalPrice: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Warehouse Bay / Storage Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
}
