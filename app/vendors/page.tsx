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
  Search,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';

export default function VendorsPage() {
  const { vendors, addVendor } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
    setFormData({
      name: '',
      companyName: '',
      category: 'Sound & Engineering',
      phone: '',
      email: '',
      city: 'Mumbai',
      rating: 4.8,
      gstin: '',
      status: 'preferred'
    });
  };

  const categories = [
    { id: 'all', label: 'All Categories', count: vendors.length },
    { id: 'Sound & Engineering', label: 'Sound & AV' },
    { id: 'Catering & Hospitality', label: 'Catering' },
    { id: 'Floral & Decor', label: 'Décor & Floral' },
    { id: 'Cinematography', label: 'Media' },
  ];

  const filteredVendors = vendors.filter(v => {
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Vendors & Suppliers"
        description="Subcontractors, AV sound engineers, floral artists, banquet caterers, and lighting technicians."
        badge={
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            {vendors.length} Partners
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="w-52">
              <Input
                placeholder="Search suppliers..."
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
              Add Vendor
            </Button>
          </div>
        }
      />

      {/* Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Tabs
          items={categories}
          activeId={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map((ven) => (
          <Card key={ven.id} className="p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-zinc-950 tracking-tight">{ven.companyName}</h3>
                  <p className="text-[11px] text-zinc-500">{ven.category}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 text-xs font-medium text-zinc-800">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="font-mono text-[11px]">{ven.rating}</span>
                  </div>
                  <Badge
                    variant={ven.status === 'preferred' ? 'purple' : 'neutral'}
                    dot
                  >
                    {ven.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-zinc-500 pt-1 border-t border-zinc-100">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>Contact: {ven.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{ven.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{ven.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{ven.city}</span>
                </div>
              </div>
            </div>

            {/* GSTIN & Portal Badge */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              {ven.gstin ? (
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-200">
                  GST: {ven.gstin}
                </span>
              ) : (
                <span className="text-[10px] text-zinc-400">Unregistered Vendor</span>
              )}
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Active Supplier
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Vendor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Vendor Partner"
        description="Register a specialized subcontractor or event equipment provider."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreate}>
              Save Vendor
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-3.5">
          <Input
            label="Company / Agency Name"
            required
            placeholder="e.g. Aura Pro Audio & Rigging"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Service Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Sound & Engineering">Sound & AV</option>
              <option value="Catering & Hospitality">Catering & Banquet</option>
              <option value="Floral & Decor">Floral & Staging</option>
              <option value="Cinematography">Cinematography</option>
              <option value="Security & Logistics">Security & Logistics</option>
            </Select>

            <Input
              label="Point of Contact"
              required
              placeholder="e.g. Vikramaditya Sen"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              required
              placeholder="+91 98111 22334"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="aura@prosound.in"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="GSTIN Identification"
              placeholder="27AAGCB1234F1Z8"
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
            />
            <Input
              label="Base City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
