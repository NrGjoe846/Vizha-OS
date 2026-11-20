'use client';

import React, { useState } from 'react';
import { Client, CustomerStatus } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/format';
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  GitMerge,
  Archive,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  AlertTriangle,
  Download,
  Tag,
  UserCheck,
  RotateCcw
} from 'lucide-react';

interface CustomerTableProps {
  clients: Client[];
  onSelectCustomer: (client: Client) => void;
  onEditCustomer: (client: Client) => void;
  onOpenMergeModal: (client?: Client) => void;
  onArchiveCustomer: (clientId: string) => void;
  onRestoreCustomer: (clientId: string) => void;
  onBulkUpdateStatus: (clientIds: string[], status: CustomerStatus) => void;
  onBulkAssignManager: (clientIds: string[], manager: string) => void;
  onBulkAddTags: (clientIds: string[], tags: string[]) => void;
}

export function CustomerTable({
  clients,
  onSelectCustomer,
  onEditCustomer,
  onOpenMergeModal,
  onArchiveCustomer,
  onRestoreCustomer,
  onBulkUpdateStatus,
  onBulkAssignManager,
  onBulkAddTags
}: CustomerTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [managerFilter, setManagerFilter] = useState('all');
  const [onlyOutstanding, setOnlyOutstanding] = useState(false);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkTagInput, setBulkTagInput] = useState('');
  const [showBulkTagInput, setShowBulkTagInput] = useState(false);

  // Filter logic
  const filteredClients = clients.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      (c.customerCode && c.customerCode.toLowerCase().includes(q)) ||
      (c.companyName && c.companyName.toLowerCase().includes(q)) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.gstin && c.gstin.toLowerCase().includes(q)) ||
      c.city.toLowerCase().includes(q);

    const matchesType = typeFilter === 'all' || c.customerType === typeFilter;
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || (c.status || 'active') === statusFilter;
    const matchesBranch = branchFilter === 'all' || c.branchName === branchFilter;
    const matchesManager = managerFilter === 'all' || c.accountManager === managerFilter;
    const matchesOutstanding = !onlyOutstanding || (c.totalOutstanding || 0) > 0;

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesStatus &&
      matchesBranch &&
      matchesManager &&
      matchesOutstanding
    );
  });

  const managers = Array.from(new Set(clients.map(c => c.accountManager || 'Rajesh Verma')));
  const branches = Array.from(new Set(clients.map(c => c.branchName || 'Mumbai HQ')));

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredClients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredClients.map(c => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const exportCSV = () => {
    const headers = ['Customer ID', 'Customer Code', 'Name', 'Company', 'Type', 'Category', 'Status', 'Phone', 'Email', 'City', 'Bookings', 'Total Spent', 'Outstanding'];
    const rows = filteredClients.map(c => [
      c.id,
      c.customerCode || '',
      `"${c.name}"`,
      `"${c.companyName || ''}"`,
      c.customerType || 'Individual',
      c.category || 'Regular',
      c.status || 'active',
      `"${c.phone}"`,
      `"${c.email}"`,
      c.city,
      c.totalBookings,
      c.totalSpent,
      c.totalOutstanding || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customer_directory_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-3">
      {/* Search & Filter Bar */}
      <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-2.5 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <div className="w-64">
              <Input
                placeholder="Search name, code, phone, email, GSTIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-3.5 h-3.5" />}
              />
            </div>

            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-36 text-xs"
            >
              <option value="all">All Types</option>
              <option value="Individual">Individual</option>
              <option value="Family">Family</option>
              <option value="Corporate">Corporate</option>
              <option value="Institution">Institution</option>
              <option value="Government">Government</option>
              <option value="Agency">Agency</option>
              <option value="Association">Association</option>
            </Select>

            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-36 text-xs"
            >
              <option value="all">All Tiers / Categories</option>
              <option value="VIP">VIP</option>
              <option value="Premium">Premium</option>
              <option value="Regular">Regular</option>
              <option value="Returning">Returning</option>
              <option value="Referral Partner">Referral Partner</option>
              <option value="Blacklisted">Blacklisted</option>
            </Select>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-32 text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
              <option value="archived">Archived</option>
            </Select>

            <Select
              value={managerFilter}
              onChange={(e) => setManagerFilter(e.target.value)}
              className="w-36 text-xs"
            >
              <option value="all">All Account Owners</option>
              {managers.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>

            <button
              onClick={() => setOnlyOutstanding(!onlyOutstanding)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                onlyOutstanding
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              Due Balance Only
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-zinc-500">
            <span>{filteredClients.length} of {clients.length} Records</span>
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Bulk Action Controls Bar */}
        {selectedIds.length > 0 && (
          <div className="p-2.5 bg-zinc-950 text-white rounded-lg flex items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
            <span className="font-mono text-zinc-300 font-medium">
              {selectedIds.length} customer records selected
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                className="text-[11px] h-7 bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
                onClick={() => onBulkUpdateStatus(selectedIds, 'active')}
              >
                Mark Active
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="text-[11px] h-7 bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
                onClick={() => onBulkUpdateStatus(selectedIds, 'inactive')}
              >
                Mark Inactive
              </Button>

              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onBulkAssignManager(selectedIds, e.target.value);
                  }
                }}
                className="text-[11px] bg-zinc-800 border border-zinc-700 text-white rounded px-2 py-1 focus:outline-none"
              >
                <option value="">Reassign Manager...</option>
                <option value="Rajesh Verma">Rajesh Verma</option>
                <option value="Priya Sharma">Priya Sharma</option>
                <option value="Vikram Rathore">Vikram Rathore</option>
              </select>

              {showBulkTagInput ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Tag name..."
                    value={bulkTagInput}
                    onChange={(e) => setBulkTagInput(e.target.value)}
                    className="px-2 py-1 text-[11px] bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none w-28"
                  />
                  <button
                    onClick={() => {
                      if (bulkTagInput) {
                        onBulkAddTags(selectedIds, [bulkTagInput]);
                        setBulkTagInput('');
                        setShowBulkTagInput(false);
                      }
                    }}
                    className="px-2 py-1 text-[11px] bg-white text-zinc-950 font-semibold rounded"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowBulkTagInput(false)}
                    className="px-1 text-zinc-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-[11px] h-7 bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
                  onClick={() => setShowBulkTagInput(true)}
                  icon={<Tag className="w-3 h-3" />}
                >
                  Bulk Tag
                </Button>
              )}

              <Button
                variant="secondary"
                size="sm"
                className="text-[11px] h-7 bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
                onClick={() => setSelectedIds([])}
              >
                Deselect All
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Master Customer Table */}
      <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200/80 font-mono text-[10px] uppercase text-zinc-500">
              <tr>
                <th className="py-3 px-3.5 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredClients.length}
                    onChange={toggleSelectAll}
                    className="rounded border-zinc-300"
                  />
                </th>
                <th className="py-3 px-3.5">Customer Master</th>
                <th className="py-3 px-3.5">Classification</th>
                <th className="py-3 px-3.5">Primary Contact</th>
                <th className="py-3 px-3.5">City & Branch</th>
                <th className="py-3 px-3.5 text-right">Events & CLV</th>
                <th className="py-3 px-3.5 text-right">Outstanding</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filteredClients.map((c) => {
                const isSelected = selectedIds.includes(c.id);
                const isBlocked = c.status === 'blocked';
                const isArchived = c.status === 'archived';

                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-zinc-50/70 transition-colors ${
                      isSelected ? 'bg-zinc-50/90' : isBlocked ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(c.id)}
                        className="rounded border-zinc-300"
                      />
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-zinc-400 font-semibold">
                          {c.customerCode || c.id}
                        </span>
                        {c.category === 'VIP' && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] px-1 rounded font-bold border border-amber-300 font-mono">
                            VIP
                          </span>
                        )}
                      </div>
                      <p
                        onClick={() => onSelectCustomer(c)}
                        className="font-bold text-zinc-900 hover:text-indigo-600 cursor-pointer text-xs"
                      >
                        {c.name}
                      </p>
                      {c.companyName && (
                        <p className="text-[10px] text-zinc-500 truncate max-w-xs">{c.companyName}</p>
                      )}
                      {c.gstin && (
                        <span className="font-mono text-[9px] text-zinc-400 block">GSTIN: {c.gstin}</span>
                      )}
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="space-y-1">
                        <Badge
                          variant={
                            c.customerType === 'Corporate'
                              ? 'info'
                              : c.customerType === 'Government'
                              ? 'purple'
                              : c.customerType === 'Institution'
                              ? 'neutral'
                              : 'default'
                          }
                          className="text-[10px]"
                        >
                          {c.customerType || 'Individual'}
                        </Badge>
                        <span className="block text-[10px] font-mono text-zinc-500">
                          {c.category || 'Regular'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3.5">
                      <p className="font-semibold text-zinc-900">{c.primaryContact || c.name}</p>
                      <p className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5 text-zinc-400" /> {c.phone}
                      </p>
                      <p className="text-[10px] text-zinc-400 truncate max-w-xs">{c.email}</p>
                    </td>

                    <td className="py-3 px-3.5">
                      <p className="font-medium text-zinc-900">{c.city}</p>
                      <span className="text-[10px] font-mono text-zinc-400">{c.branchName || 'Mumbai HQ'}</span>
                    </td>

                    <td className="py-3 px-3.5 text-right font-mono">
                      <span className="font-bold text-zinc-950 block">₹{formatCurrency(c.totalSpent || 0)}</span>
                      <span className="text-[10px] text-zinc-500">{c.totalBookings || 0} Events</span>
                    </td>

                    <td className="py-3 px-3.5 text-right font-mono">
                      {(c.totalOutstanding || 0) > 0 ? (
                        <span className="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-[11px]">
                          ₹{formatCurrency(c.totalOutstanding || 0)}
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-[10px]">Settled (₹0)</span>
                      )}
                    </td>

                    <td className="py-3 px-3.5">
                      <Badge
                        variant={
                          c.status === 'active' || !c.status
                            ? 'success'
                            : c.status === 'blocked'
                            ? 'danger'
                            : c.status === 'archived'
                            ? 'neutral'
                            : 'warning'
                        }
                        dot
                        className="text-[10px] uppercase font-mono"
                      >
                        {c.status || 'active'}
                      </Badge>
                    </td>

                    <td className="py-3 px-3.5 text-right space-x-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[11px] h-7 px-2"
                        onClick={() => onSelectCustomer(c)}
                        icon={<Eye className="w-3.5 h-3.5" />}
                      >
                        360°
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[11px] h-7 px-1.5"
                        onClick={() => onEditCustomer(c)}
                        title="Edit Customer"
                        icon={<Edit2 className="w-3.5 h-3.5 text-zinc-500" />}
                      />

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[11px] h-7 px-1.5"
                        onClick={() => onOpenMergeModal(c)}
                        title="Merge with Duplicate Record"
                        icon={<GitMerge className="w-3.5 h-3.5 text-purple-600" />}
                      />

                      {isArchived ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[11px] h-7 px-1.5 text-emerald-600"
                          onClick={() => onRestoreCustomer(c.id)}
                          title="Restore Account"
                          icon={<RotateCcw className="w-3.5 h-3.5" />}
                        />
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[11px] h-7 px-1.5 text-zinc-400 hover:text-rose-600"
                          onClick={() => onArchiveCustomer(c.id)}
                          title="Archive Customer"
                          icon={<Archive className="w-3.5 h-3.5" />}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-zinc-400">
                    No customer master records match the current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
