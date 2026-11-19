'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import {
  Users,
  Plus,
  Building,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Search,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/format';

export default function ClientsPage() {
  const { clients, addClient } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    gstin: '',
    city: 'Mumbai'
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addClient(formData);
    setIsModalOpen(false);
    setFormData({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      gstin: '',
      city: 'Mumbai'
    });
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.companyName && c.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Clients Directory"
        description="Master client profiles, GSTIN identification records, lifetime billing, and portal accounts."
        badge={
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            {clients.length} Accounts
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="w-52">
              <Input
                placeholder="Search clients..."
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
              Add Client
            </Button>
          </div>
        }
      />

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((c) => (
          <Card key={c.id} className="p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-semibold text-zinc-800">
                    {c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-950 tracking-tight">{c.name}</h3>
                    <p className="text-[11px] text-zinc-500">{c.companyName || 'Private Individual'}</p>
                  </div>
                </div>
                <Badge variant={c.companyName ? 'purple' : 'neutral'}>
                  {c.companyName ? 'Corporate' : 'Individual'}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs text-zinc-500 pt-1 border-t border-zinc-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{c.city}</span>
                </div>
                {c.gstin && (
                  <div className="pt-1">
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-200">
                      GSTIN: {c.gstin}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Overview */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Bookings</span>
                <p className="font-mono font-medium text-zinc-800">{c.totalBookings} Events</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Lifetime Spent</span>
                <p className="font-mono font-semibold text-zinc-950">₹{formatCurrency(c.totalSpent)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Client Profile"
        description="Create a client record with contact and GST credentials."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreate}>
              Save Profile
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-3.5">
          <Input
            label="Client Contact Person"
            required
            placeholder="e.g. Rahul Oberoi"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Company Name (Optional)"
            placeholder="e.g. Oberoi Enterprises Ltd"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="rahul@oberoi.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone Number"
              required
              placeholder="+91 98200 12345"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="GSTIN Number"
              placeholder="27AABCU9603R1ZM"
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
            />
            <Input
              label="City"
              placeholder="Mumbai"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
