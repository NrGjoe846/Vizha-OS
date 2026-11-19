'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import {
  MapPin,
  Plus,
  Users,
  Star,
  Phone,
  Search,
  CheckCircle2
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

export default function VenuesPage() {
  const { venues, addVenue } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredVenues = venues.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Partner Venues"
        description="Curated luxury hotel ballrooms, convention centers, palace grounds, and oceanfront resorts."
        badge={
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            {venues.length} Locations
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="w-52">
              <Input
                placeholder="Search venues..."
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
              Add Venue
            </Button>
          </div>
        }
      />

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredVenues.map((v) => (
          <Card key={v.id} className="overflow-hidden flex flex-col group">
            {/* Venue Image */}
            <div className="relative h-48 w-full bg-zinc-100 overflow-hidden border-b border-zinc-100">
              <img
                src={v.imageUrl}
                alt={v.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <Badge variant={v.isAvailable ? 'success' : 'neutral'} dot>
                  {v.isAvailable ? 'Available' : 'Booked'}
                </Badge>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-950/70 text-white backdrop-blur-xs">
                  {v.type}
                </span>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-xs font-semibold text-zinc-900 border border-zinc-200">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{v.rating}</span>
              </div>
            </div>

            {/* Venue Details */}
            <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-950 tracking-tight">{v.name}</h3>
                  <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{v.address}, {v.city}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {v.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-zinc-50 text-zinc-600 border border-zinc-200/60"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Capacity Strip */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Max Capacity</span>
                  <p className="font-mono font-medium text-zinc-800">{v.capacity.toLocaleString()} Guests</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Rental Rate</span>
                  <p className="font-mono font-semibold text-zinc-950">₹{(v.rentalRate).toLocaleString()} / day</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Venue Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Partner Venue"
        description="Register a new venue location and operational specifications."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreate}>
              Save Venue
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-3.5">
          <Input
            label="Venue Name"
            required
            placeholder="e.g. The Taj Mahal Palace, Mumbai"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Venue Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Luxury Hotel Ballroom">Luxury Hotel Ballroom</option>
              <option value="Heritage Palace">Heritage Palace</option>
              <option value="Convention Center">Convention Center</option>
              <option value="Beachside Resort">Beachside Resort</option>
              <option value="Open Air Arena">Open Air Arena</option>
            </Select>

            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <Input
            label="Street Address"
            placeholder="Apollo Bunder, Colaba"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Guest Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            />
            <Input
              label="Daily Rental Rate (₹)"
              type="number"
              value={formData.rentalRate}
              onChange={(e) => setFormData({ ...formData, rentalRate: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Photo URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
}
