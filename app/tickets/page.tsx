'use client';

import React, { useState } from 'react';
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
  RefreshCw,
  Users,
  Clock
} from 'lucide-react';

export default function TicketsPage() {
  const { tickets, ticketTypes, verifyTicket, issueTicket } = useERP();
  const [tokenInput, setTokenInput] = useState('');
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ticketing & Gate QR Scanner</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Instant Gate Admission
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time token verification preventing fraudulent duplicate admissions at high-volume concerts & summits.
          </p>
        </div>

        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Pass / Ticket</span>
        </button>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live QR Scanner Terminal */}
        <div className="lg:col-span-2 bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <h2 className="text-sm font-bold tracking-wider uppercase text-emerald-400">Live Turnstile Scanner</h2>
              </div>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                Gate Terminal #1 &bull; Active
              </span>
            </div>

            {/* Simulated Viewfinder */}
            <div className="relative bg-slate-950 rounded-xl border-2 border-dashed border-slate-700 h-52 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-x-8 top-1/2 h-0.5 bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-pulse"></div>
              <QrCode className="w-24 h-24 text-slate-700/60" />
              <p className="text-xs font-mono text-slate-400 mt-2 z-10">Point optical scanner or enter token below</p>
            </div>

            {/* Quick token tester buttons */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-2">Simulate Optical Gate Scan (Click to test):</p>
              <div className="flex flex-wrap gap-2">
                {tickets.slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleVerify(t.qrToken)}
                    className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <Scan className="w-3 h-3 text-indigo-400" />
                    <span>{t.qrToken} ({t.buyerName.split(' ')[0]})</span>
                  </button>
                ))}
                <button
                  onClick={() => handleVerify('QR-INVALID-TOKEN-999')}
                  className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-3 h-3 text-rose-400" />
                  <span>Test Fraudulent Token</span>
                </button>
              </div>
            </div>

            {/* Manual Token Input Form */}
            <div className="flex gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Paste or type QR Token (e.g. QR-SUNWAVE-883190)..."
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  className="w-full text-xs font-mono bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={() => handleVerify()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
              >
                <Scan className="w-4 h-4" />
                <span>Verify Gate Pass</span>
              </button>
            </div>
          </div>

          {/* Verification Result Feedback Box */}
          {scanResult && (
            <div
              className={`mt-4 p-4 rounded-xl border flex items-start gap-3.5 animate-in fade-in duration-200 ${
                scanResult.success
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/80 border-rose-500 text-rose-200'
              }`}
            >
              {scanResult.success ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold tracking-tight">
                  {scanResult.success ? 'ENTRY GRANTED &bull; GATE PASS VALID' : 'ENTRY DENIED &bull; VERIFICATION FAILED'}
                </h4>
                <p className="text-xs mt-1 text-slate-300 font-medium">{scanResult.message}</p>
                {scanResult.ticket && (
                  <div className="mt-2 text-[11px] font-mono text-slate-300 bg-black/40 p-2 rounded border border-slate-700/50">
                    <p>Ticket: {scanResult.ticket.ticketNumber} &bull; Tier: {scanResult.ticket.ticketTypeName}</p>
                    <p>Event: {scanResult.ticket.eventTitle}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Live Stats & Tier Breakdown */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gate Throughput</h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">{scannedCount}</span>
              <span className="text-xs text-slate-500">of {tickets.length} passes admitted</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${tickets.length > 0 ? (scannedCount / tickets.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 mb-3">Ticket Tiers & Availability</h3>
            <div className="space-y-3">
              {ticketTypes.map((tier) => (
                <div key={tier.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{tier.name}</span>
                    <span className="text-xs font-bold text-indigo-700">₹{tier.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>Sold: {tier.soldCount} passes</span>
                    <span>Cap: {tier.totalSupply}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Issued Tickets Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Registered Gate Passes & QR Tokens</h2>
          <span className="text-xs text-slate-500">{tickets.length} total generated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ticket Number</th>
                <th className="py-3 px-4">Attendee</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">QR Token</th>
                <th className="py-3 px-4">Price Paid</th>
                <th className="py-3 px-4">Gate Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{t.ticketNumber}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{t.buyerName}</p>
                    <p className="text-[10px] text-slate-400">{t.buyerEmail}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{t.ticketTypeName}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-indigo-700 bg-indigo-50/50 px-2 rounded">
                    {t.qrToken}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">₹{t.pricePaid.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    {t.isScanned ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Admitted ({t.scannedAt?.split(' ')[1] || 'Yes'})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3" />
                        <span>Not Checked In</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerify(t.qrToken)}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        Scan Token
                      </button>
                      <span className="text-slate-300">&bull;</span>
                      <a
                        href={`/tickets/${t.ticketNumber}/print`}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:underline"
                      >
                        Print Pass
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Issue Pass */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900">Issue New Gate Ticket</h2>
            <p className="text-xs text-slate-500 mt-0.5">Generate pass with unique tamper-proof QR token</p>

            <form onSubmit={handleIssueTicket} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ticket Tier *</label>
                <select
                  value={issueData.ticketTypeId}
                  onChange={(e) => setIssueData({ ...issueData, ticketTypeId: e.target.value })}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {ticketTypes.map(tt => (
                    <option key={tt.id} value={tt.id}>{tt.name} (₹{tt.price.toLocaleString('en-IN')})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Attendee Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={issueData.buyerName}
                  onChange={(e) => setIssueData({ ...issueData, buyerName: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Attendee Email *</label>
                <input
                  type="email"
                  required
                  placeholder="attendee@example.com"
                  value={issueData.buyerEmail}
                  onChange={(e) => setIssueData({ ...issueData, buyerEmail: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98200 00000"
                  value={issueData.buyerPhone}
                  onChange={(e) => setIssueData({ ...issueData, buyerPhone: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  Generate QR Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
