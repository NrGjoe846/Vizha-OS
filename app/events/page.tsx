'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import { EventStatus } from '@/lib/types';
import {
  Calendar,
  Plus,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';

export default function EventsPage() {
  const { events, addEvent, clients, venues } = useERP();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredEvents = events.filter((e) => {
    const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venueName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent(formData);
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'in_progress':
        return <Badge variant="purple" dot>In Progress</Badge>;
      case 'confirmed':
        return <Badge variant="success" dot>Confirmed</Badge>;
      case 'planning':
        return <Badge variant="info" dot>Planning</Badge>;
      case 'completed':
        return <Badge variant="neutral">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const tabs = [
    { id: 'all', label: 'All Productions', count: events.length },
    { id: 'in_progress', label: 'In Progress', count: events.filter(e => e.status === 'in_progress').length },
    { id: 'planning', label: 'Planning', count: events.filter(e => e.status === 'planning').length },
    { id: 'confirmed', label: 'Confirmed', count: events.filter(e => e.status === 'confirmed').length },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Event Productions"
        description="End-to-end event management, staging execution, minute-by-minute run of show, and milestone tracking."
        badge={
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            {events.length} Active
          </span>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Production
          </Button>
        }
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Tabs items={tabs} activeId={filterStatus} onChange={setFilterStatus} />

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search events, clients, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-3.5 h-3.5" />}
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => {
          const budgetPercentage = Math.min(
            100,
            Math.round((evt.actualSpend / (evt.budget || 1)) * 100)
          );

          return (
            <Card key={evt.id} className="overflow-hidden flex flex-col group">
              {/* Event Image Banner */}
              <div className="relative h-44 w-full bg-zinc-100 overflow-hidden border-b border-zinc-100">
                <img
                  src={evt.coverImage}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  {getStatusBadge(evt.status)}
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-mono uppercase px-2 py-1 rounded bg-zinc-950/75 text-white backdrop-blur-xs">
                    {evt.eventType}
                  </span>
                </div>
              </div>

              {/* Event Details Content */}
              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <Link href={`/events/${evt.id}`}>
                    <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors tracking-tight line-clamp-1">
                      {evt.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-zinc-500 font-medium">{evt.clientName}</p>

                  <div className="space-y-1.5 text-xs text-zinc-500 pt-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{evt.venueName}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{evt.startDate} to {evt.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{evt.guestCount} expected guests</span>
                    </div>
                  </div>
                </div>

                {/* Budget Meter */}
                <div className="pt-2 border-t border-zinc-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 text-[11px]">Budget Utilized</span>
                    <span className="font-mono font-medium text-zinc-900 text-[11px]">
                      ₹{(evt.actualSpend).toLocaleString()} / ₹{(evt.budget).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        budgetPercentage > 90 ? 'bg-rose-500' : 'bg-zinc-900'
                      }`}
                      style={{ width: `${budgetPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
                  <span className="text-[11px] text-zinc-400">
                    Lead: {evt.managerName}
                  </span>
                  <Link href={`/events/${evt.id}`}>
                    <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Run of Show
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Production"
        description="Initialize an enterprise event with venue, client, budget, and staging assignments."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateEvent}>
              Confirm Production
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <Input
            label="Event Production Title"
            required
            placeholder="e.g. Oberoi Heritage Sangeet & Reception"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Event Type"
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
            >
              <option value="Luxury Wedding">Luxury Wedding</option>
              <option value="Corporate Summit">Corporate Summit</option>
              <option value="Music Concert">Music Concert</option>
              <option value="Award Gala">Award Gala</option>
              <option value="Brand Launch">Brand Launch</option>
            </Select>

            <Select
              label="Primary Client"
              value={formData.clientId}
              onChange={(e) => {
                const c = clients.find(cl => cl.id === e.target.value);
                setFormData({
                  ...formData,
                  clientId: e.target.value,
                  clientName: c?.name || ''
                });
              }}
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.companyName || c.city})</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Venue Location"
              value={formData.venueId}
              onChange={(e) => {
                const v = venues.find(vn => vn.id === e.target.value);
                setFormData({
                  ...formData,
                  venueId: e.target.value,
                  venueName: v?.name || ''
                });
              }}
            >
              {venues.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.city})</option>
              ))}
            </Select>

            <Input
              label="Production Lead Manager"
              value={formData.managerName}
              onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
            <Input
              label="Expected Guests"
              type="number"
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Estimated Budget (₹)"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
            />
            <Input
              label="Cover Image URL"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
