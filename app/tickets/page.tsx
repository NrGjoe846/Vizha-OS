'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import {
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Ticket as TicketIcon,
  Search,
  Scan,
  Printer,
  Users,
  Clock,
  Sparkles
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { StatCard } from '@/components/ui/StatCard';

export default function TicketsPage() {
  const { tickets, ticketTypes, verifyTicket, issueTicket } = useERP();
  const [tokenInput, setTokenInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    ticket?: any;
  } | null>(null);

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueData, setIssueData] = useState({
    ticketTypeId: ticketTypes[0]?.id || 'tt-1',
    buyerName: '',
    buyerEmail: '',
    buyerPhone: ''
  });

  const handleVerify = (tokenToVerify?: string) => {
    const target = tokenToVerify !== undefined ? tokenToVerify : tokenInput;
    if (!target.trim()) return;

    const result = verifyTicket(target);
    setScanResult(result);
    setTokenInput('');
  };

  const handleIssueTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueData.buyerName || !issueData.buyerEmail) return;

    issueTicket(
      issueData.ticketTypeId,
      issueData.buyerName,
      issueData.buyerEmail,
      issueData.buyerPhone
    );

    setIsIssueModalOpen(false);
    setIssueData({
      ticketTypeId: ticketTypes[0]?.id || 'tt-1',
      buyerName: '',
      buyerEmail: '',
      buyerPhone: ''
    });
  };

  const scannedCount = tickets.filter(t => t.isScanned).length;

  const filteredTickets = tickets.filter(t =>
    t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.ticketTypeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Tickets & Gate Scanner"
        description="Anti-fraud QR token admission, gate barcode scanning, pass tier sales, and printable badges."
        badge={
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            {scannedCount} of {tickets.length} Admitted
          </span>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsIssueModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Issue Ticket Pass
          </Button>
        }
      />

      {/* Optical Scanner & Admission Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xs">
              <span>Gate QR Scanner</span>
              <Badge variant="purple" dot className="font-mono text-[10px]">Turnstile 1</Badge>
            </CardTitle>
            <CardDescription>
              Scan customer camera QR code or manual token entry
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {/* Viewfinder simulation */}
            <div className="relative h-44 bg-zinc-950 rounded-lg overflow-hidden flex flex-col items-center justify-center p-4 border border-zinc-800">
              <div className="w-24 h-24 border border-zinc-500/50 rounded-lg relative flex items-center justify-center">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white"></div>
                <QrCode className="w-10 h-10 text-zinc-600 animate-pulse" />
              </div>
              <p className="text-[10px] font-mono text-zinc-400 mt-2">Align QR Code within frame</p>
            </div>

            {/* Manual Token Verification */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter QR token / code..."
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                />
                <Button variant="primary" size="sm" onClick={() => handleVerify()}>
                  Verify
                </Button>
              </div>

              {/* Quick test token helpers */}
              <div className="pt-2 border-t border-zinc-100 flex flex-wrap gap-1.5">
                <span className="text-[10px] text-zinc-400 w-full">Quick Test Simulation:</span>
                <button
                  onClick={() => handleVerify('qr-tok-5501')}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                >
                  Valid Token
                </button>
                <button
                  onClick={() => handleVerify('qr-tok-5502')}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                >
                  Duplicate Token
                </button>
                <button
                  onClick={() => handleVerify('FAKE-INVALID-TOKEN')}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                >
                  Fake Token
                </button>
              </div>
            </div>

            {/* Verification Result Feedback */}
            {scanResult && (
              <div
                className={`p-3.5 rounded-lg border text-xs space-y-1 animate-in fade-in ${
                  scanResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {scanResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{scanResult.message}</span>
                </div>
                {scanResult.ticket && (
                  <p className="text-[11px] opacity-80 font-mono">
                    Attendee: {scanResult.ticket.buyerName} &bull; Tier: {scanResult.ticket.ticketTypeName}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right 2 Cols: Ticket Tiers & Master Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Tier Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ticketTypes.map((tier) => (
              <Card key={tier.id} className="p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-zinc-950">{tier.name}</h4>
                    <span className="text-xs font-mono font-bold text-zinc-900">
                      ₹{tier.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">Official admission pass</p>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Sold: {tier.soldCount}/{tier.totalSupply}</span>
                  <span className="text-emerald-600 font-semibold">
                    {tier.totalSupply - tier.soldCount} left
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Master Tickets Table */}
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xs">Issued Passes & Badges</CardTitle>
                  <CardDescription>Anti-fraud optical credentials and audit logs</CardDescription>
                </div>
                <div className="w-48">
                  <Input
                    placeholder="Filter passes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="w-3.5 h-3.5" />}
                  />
                </div>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200/80 text-zinc-500 font-mono uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Pass Number</th>
                    <th className="py-2.5 px-4">Attendee / Buyer</th>
                    <th className="py-2.5 px-4">Pass Tier</th>
                    <th className="py-2.5 px-4">QR Token</th>
                    <th className="py-2.5 px-4">Admission</th>
                    <th className="py-2.5 px-4 text-right">Badge Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {filteredTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-zinc-900">{t.ticketNumber}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-zinc-950">{t.buyerName}</p>
                        <p className="text-[11px] text-zinc-400 truncate max-w-xs">{t.buyerEmail}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {t.ticketTypeName}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-500">{t.qrToken}</td>
                      <td className="py-3 px-4">
                        <Badge variant={t.isScanned ? 'success' : 'neutral'} dot>
                          {t.isScanned ? 'Admitted' : 'Unscanned'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`/tickets/${t.id}/print`}>
                          <Button variant="outline" size="sm" icon={<Printer className="w-3 h-3" />}>
                            Print Badge
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Issue Ticket Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Ticket Pass"
        description="Generate an anti-fraud digital pass with unique QR token."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleIssueTicket}>
              Issue Pass
            </Button>
          </>
        }
      >
        <form onSubmit={handleIssueTicket} className="space-y-3.5">
          <Select
            label="Pass Tier"
            value={issueData.ticketTypeId}
            onChange={(e) => setIssueData({ ...issueData, ticketTypeId: e.target.value })}
          >
            {ticketTypes.map(tt => (
              <option key={tt.id} value={tt.id}>
                {tt.name} (₹{tt.price.toLocaleString()})
              </option>
            ))}
          </Select>

          <Input
            label="Attendee / Buyer Full Name"
            required
            placeholder="e.g. Siddharth Malhotra"
            value={issueData.buyerName}
            onChange={(e) => setIssueData({ ...issueData, buyerName: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="siddharth@example.com"
              value={issueData.buyerEmail}
              onChange={(e) => setIssueData({ ...issueData, buyerEmail: e.target.value })}
            />
            <Input
              label="Phone Number"
              placeholder="+91 98200 88776"
              value={issueData.buyerPhone}
              onChange={(e) => setIssueData({ ...issueData, buyerPhone: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
