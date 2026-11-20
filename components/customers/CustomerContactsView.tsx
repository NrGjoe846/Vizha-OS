'use client';

import React, { useState } from 'react';
import { Client, CustomerContact, CustomerAddress } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Search, Phone, Mail, MapPin, Building, User, ShieldCheck } from 'lucide-react';

interface CustomerContactsViewProps {
  clients: Client[];
  onSelectCustomer: (client: Client) => void;
}

export function CustomerContactsView({ clients, onSelectCustomer }: CustomerContactsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'contacts' | 'addresses'>('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Flatten all contacts with parent client reference
  const allContacts: { contact: CustomerContact; client: Client }[] = [];
  const allAddresses: { address: CustomerAddress; client: Client }[] = [];

  clients.forEach(c => {
    (c.contacts || []).forEach(con => {
      allContacts.push({ contact: con, client: c });
    });
    (c.addresses || []).forEach(addr => {
      allAddresses.push({ address: addr, client: c });
    });
  });

  const filteredContacts = allContacts.filter(({ contact, client }) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      contact.name.toLowerCase().includes(q) ||
      contact.phone.includes(q) ||
      contact.email.toLowerCase().includes(q) ||
      client.name.toLowerCase().includes(q) ||
      (client.companyName && client.companyName.toLowerCase().includes(q));

    const matchesRole = roleFilter === 'all' || contact.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredAddresses = allAddresses.filter(({ address, client }) => {
    const q = searchQuery.toLowerCase();
    return (
      address.addressName.toLowerCase().includes(q) ||
      address.line1.toLowerCase().includes(q) ||
      address.city.toLowerCase().includes(q) ||
      address.pinCode.includes(q) ||
      client.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Sub-navigation bar */}
      <div className="flex items-center justify-between gap-3 p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl text-xs flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('contacts')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeSubTab === 'contacts'
                ? 'bg-zinc-950 text-white shadow-2xs font-semibold'
                : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200'
            }`}
          >
            All Contact Persons ({allContacts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('addresses')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeSubTab === 'addresses'
                ? 'bg-zinc-950 text-white shadow-2xs font-semibold'
                : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200'
            }`}
          >
            All Operational Addresses ({allAddresses.length})
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-56">
            <Input
              placeholder={activeSubTab === 'contacts' ? "Search contacts, phone, client..." : "Search addresses, city, pin..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-3.5 h-3.5" />}
            />
          </div>

          {activeSubTab === 'contacts' && (
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-40 text-xs"
            >
              <option value="all">All Roles</option>
              <option value="Owner / Director">Owner / Director</option>
              <option value="Event Coordinator">Event Coordinator</option>
              <option value="Procurement Manager">Procurement Manager</option>
              <option value="Finance Manager">Finance Manager</option>
              <option value="Authorized Signatory">Authorized Signatory</option>
              <option value="Family Representative">Family Representative</option>
            </Select>
          )}
        </div>
      </div>

      {/* CONTACTS DIRECTORY GRID */}
      {activeSubTab === 'contacts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredContacts.map(({ contact, client }) => (
            <div
              key={contact.id}
              className="p-3.5 bg-white border border-zinc-200/80 rounded-xl space-y-2 hover:border-zinc-300 transition-colors text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-zinc-900 text-sm">{contact.name}</span>
                    {contact.isPrimary && (
                      <Badge variant="success" className="text-[9px] px-1 py-0">Primary</Badge>
                    )}
                    {contact.isDecisionMaker && (
                      <Badge variant="purple" className="text-[9px] px-1 py-0">Signatory</Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 font-medium">{contact.designation || contact.role}</p>
                </div>

                <button
                  onClick={() => onSelectCustomer(client)}
                  className="text-[10px] font-mono text-indigo-600 hover:underline"
                >
                  View 360°
                </button>
              </div>

              <div className="p-2 bg-zinc-50 rounded-lg space-y-1 font-mono text-[11px] text-zinc-600 border border-zinc-100">
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-zinc-400" /> {contact.phone}
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-zinc-400" /> {contact.email}
                </p>
              </div>

              <div className="pt-1.5 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-500">
                <span>Account: <strong className="text-zinc-800">{client.name}</strong></span>
                <span className="font-mono text-zinc-400">{client.customerCode || client.id}</span>
              </div>
            </div>
          ))}

          {filteredContacts.length === 0 && (
            <div className="col-span-full py-10 text-center text-zinc-400">
              No contacts match the search criteria.
            </div>
          )}
        </div>
      )}

      {/* ADDRESSES DIRECTORY GRID */}
      {activeSubTab === 'addresses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredAddresses.map(({ address, client }) => (
            <div
              key={address.id}
              className="p-3.5 bg-white border border-zinc-200/80 rounded-xl space-y-2 hover:border-zinc-300 transition-colors text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-zinc-900 text-sm">{address.addressName}</span>
                    {address.isPrimaryBilling && (
                      <Badge variant="info" className="text-[9px] px-1 py-0">Default Billing</Badge>
                    )}
                  </div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400">{address.type}</span>
                </div>

                <button
                  onClick={() => onSelectCustomer(client)}
                  className="text-[10px] font-mono text-indigo-600 hover:underline"
                >
                  View 360°
                </button>
              </div>

              <div className="p-2 bg-zinc-50 rounded-lg space-y-0.5 text-[11px] text-zinc-700 border border-zinc-100">
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                <p className="font-medium text-zinc-900">
                  {address.city}, {address.state} - {address.pinCode}
                </p>
              </div>

              <div className="pt-1.5 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-500">
                <span>Customer: <strong className="text-zinc-800">{client.name}</strong></span>
                <span className="font-mono text-zinc-400">{client.customerCode || client.id}</span>
              </div>
            </div>
          ))}

          {filteredAddresses.length === 0 && (
            <div className="col-span-full py-10 text-center text-zinc-400">
              No addresses match the search criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
