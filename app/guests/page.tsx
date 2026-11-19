'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import {
  Users,
  Plus,
  CheckCircle2,
  Clock,
  Search,
  Check,
  Utensils,
  Filter,
  Layers
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { StatCard } from '@/components/ui/StatCard';

export default function GuestsPage() {
  const { guests, addGuest, toggleGuestCheckIn, events } = useERP();
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
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

  const eventFilteredGuests = guests.filter(g =>
    selectedEventId === 'all' || g.eventId === selectedEventId || g.eventTitle === events.find(e => e.id === selectedEventId)?.title
  );

  const checkedInCount = eventFilteredGuests.filter(g => g.isCheckedIn).length;
  const checkInRate = eventFilteredGuests.length > 0 ? Math.round((checkedInCount / eventFilteredGuests.length) * 100) : 0;

  const categories = [
    { id: 'all', label: 'All Guests', count: eventFilteredGuests.length },
    { id: 'VIP', label: 'VIP' },
    { id: 'Family', label: 'Family' },
    { id: 'Corporate', label: 'Corporate' },
    { id: 'Media', label: 'Media' },
  ];

  const filteredGuests = eventFilteredGuests.filter((g) => {
    const matchesGroup = filterGroup === 'all' || g.group === filterGroup;
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.passCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tableNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  // Calculate table distribution
  const tableCounts = eventFilteredGuests.reduce((acc, g) => {
    acc[g.tableNo] = (acc[g.tableNo] || 0) + 1 + g.plusOnes;
    return acc;
  }, {} as Record<string, number>);

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Guest List & RSVP"
        description="Gate admission pass codes, VIP delegation seating tables, dietary requirements, and check-in tracking."
        badge={
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            {eventFilteredGuests.length} Confirmed RSVPs
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="w-56">
              <Select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
              >
                <option value="all">All Events Scope</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </Select>
            </div>
            <div className="w-52">
              <Input
                placeholder="Search guests or pass..."
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
              Add RSVP
            </Button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Confirmed Guest RSVPs"
          value={`${eventFilteredGuests.length} Attendees`}
          icon={<Users className="w-4 h-4" />}
          description="Seating assigned across banquet tables"
        />
        <StatCard
          label="Gate Check-in Progress"
          value={`${checkInRate}%`}
          change={`${checkedInCount} of ${eventFilteredGuests.length} admitted`}
          changeType="positive"
          icon={<CheckCircle2 className="w-4 h-4" />}
          description="Live barcode scanning at venue turnstiles"
        />
        <StatCard
          label="Seating Tables Active"
          value={`${Object.keys(tableCounts).length} Tables`}
          icon={<Layers className="w-4 h-4" />}
          description="Assigned banquet floorplan zones"
        />
      </div>

      {/* Category Tabs */}
      <Tabs
        items={categories}
        activeId={filterGroup}
        onChange={setFilterGroup}
      />

      {/* Guests Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200/80 text-zinc-500 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Pass Code</th>
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Delegation Group</th>
                <th className="py-3 px-4">Table #</th>
                <th className="py-3 px-4">+Ones</th>
                <th className="py-3 px-4">Dietary Requirement</th>
                <th className="py-3 px-4">Gate Status</th>
                <th className="py-3 px-4 text-right">Quick Admission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filteredGuests.map((g) => (
                <tr key={g.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-zinc-900">{g.passCode}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-zinc-950">{g.name}</p>
                    <p className="text-[11px] text-zinc-400 font-mono">{g.phone || g.email}</p>
                  </td>
                  <td className="py-3 px-4 text-zinc-600 truncate max-w-xs">{g.eventTitle}</td>
                  <td className="py-3 px-4">
                    <Badge variant={g.group === 'VIP' ? 'purple' : 'neutral'} dot>
                      {g.group}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-zinc-900">{g.tableNo}</td>
                  <td className="py-3 px-4 font-mono text-zinc-600">+{g.plusOnes}</td>
                  <td className="py-3 px-4 text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <Utensils className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span>{g.dietaryPref}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={g.isCheckedIn ? 'success' : 'neutral'} dot>
                      {g.isCheckedIn ? 'Admitted' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant={g.isCheckedIn ? 'secondary' : 'primary'}
                      size="sm"
                      className="h-7 px-2.5 text-[11px]"
                      onClick={() => toggleGuestCheckIn(g.id)}
                      icon={g.isCheckedIn ? <Check className="w-3 h-3" /> : undefined}
                    >
                      {g.isCheckedIn ? 'Admitted' : 'Check In'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Guest Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Guest RSVP"
        description="Register a confirmed attendee and assign table seating."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateGuest}>
              Save RSVP
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateGuest} className="space-y-3.5">
          <Select
            label="Assigned Production Event"
            value={formData.eventId}
            onChange={(e) => {
              const ev = events.find(event => event.id === e.target.value);
              setFormData({
                ...formData,
                eventId: e.target.value,
                eventTitle: ev?.title || formData.eventTitle
              });
            }}
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </Select>

          <Input
            label="Guest Full Name"
            required
            placeholder="e.g. Vikramaditya Singhania"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Delegation Category"
              value={formData.group}
              onChange={(e) => setFormData({ ...formData, group: e.target.value as any })}
            >
              <option value="VIP">VIP</option>
              <option value="Family">Family</option>
              <option value="Corporate">Corporate</option>
              <option value="Media">Media</option>
              <option value="General">General</option>
            </Select>

            <Input
              label="Table Designation"
              value={formData.tableNo}
              onChange={(e) => setFormData({ ...formData, tableNo: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Additional Guests (+Ones)"
              type="number"
              min={0}
              value={formData.plusOnes}
              onChange={(e) => setFormData({ ...formData, plusOnes: Number(e.target.value) })}
            />
            <Input
              label="Dietary Requirements"
              value={formData.dietaryPref}
              onChange={(e) => setFormData({ ...formData, dietaryPref: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
