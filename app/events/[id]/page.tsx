'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import { EventStatus, EventEquipmentRequisition, VendorWorkOrder } from '@/lib/types';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  ClipboardList,
  User,
  AlertCircle,
  Truck,
  Briefcase,
  Printer,
  FileCheck,
  Building2,
  Package
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency } from '@/lib/format';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const {
    events,
    updateEventStatus,
    toggleEventSchedule,
    addEventSchedule,
    toggleEventTask,
    addEventTask,
    inventory,
    equipmentRequisitions,
    addEquipmentRequisition,
    updateRequisitionStatus,
    vendors,
    vendorWorkOrders,
    addVendorWorkOrder,
    updateWorkOrderStatus,
    expenses
  } = useERP();

  const event = events.find(e => e.id === resolvedParams.id) || events[0];

  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks' | 'gear' | 'work_orders' | 'financials'>('schedule');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<VendorWorkOrder | null>(null);

  // New Schedule form
  const [scheduleData, setScheduleData] = useState({
    dayNumber: 1,
    timeSlot: '20:00 - 21:00',
    title: '',
    description: '',
    leadPerson: 'Priya Sharma',
    cueNotes: ''
  });

  // New Task form
  const [taskData, setTaskData] = useState({
    title: '',
    category: 'Production',
    priority: 'high',
    assignedTo: 'Vikram Rathore',
    dueDate: '2026-11-29'
  });

  // New Equipment Requisition form
  const [requisitionData, setRequisitionData] = useState({
    itemId: inventory[0]?.id || '',
    itemName: inventory[0]?.name || '',
    itemSku: inventory[0]?.sku || '',
    quantity: 2,
    rentalPrice: inventory[0]?.rentalPrice || 10000,
    days: 2,
    totalCost: (inventory[0]?.rentalPrice || 10000) * 2 * 2
  });

  // New Vendor Work Order form
  const [workOrderData, setWorkOrderData] = useState({
    vendorId: vendors[0]?.id || '',
    vendorName: vendors[0]?.name || '',
    vendorCategory: vendors[0]?.category || 'Audio & Visual',
    scopeOfWork: 'Comprehensive stage sound setup, line array rigging, and live engineer support.',
    contractAmount: 350000,
    advancePaid: 150000,
    cueAssignments: 'Cue 01: Walk-in background audio; Cue 05: Fanfare spotlight',
    dueDate: '2026-12-05'
  });

  if (!event) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-zinc-500">Event production not found.</p>
        <Link href="/events" className="mt-4 inline-block text-xs font-semibold text-zinc-900 underline">
          Back to Events
        </Link>
      </div>
    );
  }

  // Filter requisitions and work orders for this event
  const eventRequisitions = equipmentRequisitions.filter(r => r.eventId === event.id);
  const eventWorkOrders = vendorWorkOrders.filter(w => w.eventId === event.id);
  const eventApprovedExpenses = expenses.filter(e => e.eventId === event.id && e.status === 'approved');
  const computedActualSpend = eventApprovedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    addEventSchedule(event.id, scheduleData);
    setIsScheduleModalOpen(false);
    setScheduleData({
      dayNumber: 1,
      timeSlot: '20:00 - 21:00',
      title: '',
      description: '',
      leadPerson: 'Priya Sharma',
      cueNotes: ''
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    addEventTask(event.id, taskData);
    setIsTaskModalOpen(false);
    setTaskData({
      title: '',
      category: 'Production',
      priority: 'high',
      assignedTo: 'Vikram Rathore',
      dueDate: '2026-11-29'
    });
  };

  const handleAddRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    addEquipmentRequisition({
      eventId: event.id,
      eventTitle: event.title,
      itemId: requisitionData.itemId,
      itemName: requisitionData.itemName,
      itemSku: requisitionData.itemSku,
      quantity: requisitionData.quantity,
      rentalPrice: requisitionData.rentalPrice,
      days: requisitionData.days,
      totalCost: requisitionData.totalCost
    });
    setIsRequisitionModalOpen(false);
  };

  const handleAddWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    addVendorWorkOrder({
      eventId: event.id,
      eventTitle: event.title,
      vendorId: workOrderData.vendorId,
      vendorName: workOrderData.vendorName,
      vendorCategory: workOrderData.vendorCategory,
      scopeOfWork: workOrderData.scopeOfWork,
      contractAmount: workOrderData.contractAmount,
      advancePaid: workOrderData.advancePaid,
      cueAssignments: workOrderData.cueAssignments,
      dueDate: workOrderData.dueDate
    });
    setIsWorkOrderModalOpen(false);
  };

  const tabItems = [
    { id: 'schedule', label: 'Run of Show (Cues)', count: event.schedules?.length || 0, icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'tasks', label: 'Checklist & Tasks', count: event.tasks?.length || 0, icon: <ClipboardList className="w-3.5 h-3.5" /> },
    { id: 'gear', label: 'Gear Requisitions', count: eventRequisitions.length, icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'work_orders', label: 'Vendor Work Orders', count: eventWorkOrders.length, icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'financials', label: 'Budget & Spend', icon: <DollarSign className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Productions', href: '/events' },
          { label: event.title }
        ]}
        title={event.title}
        description={`${event.eventType} • Produced by ${event.managerName} • ${event.branchName || 'Mumbai HQ'}`}
        badge={
          <Badge
            variant={event.status === 'confirmed' ? 'success' : event.status === 'in_progress' ? 'purple' : 'default'}
            dot
          >
            {event.status.replace('_', ' ')}
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Select
              value={event.status}
              onChange={(e) => updateEventStatus(event.id, e.target.value as EventStatus)}
              className="text-xs"
            >
              <option value="draft">Status: Draft</option>
              <option value="planning">Status: Planning</option>
              <option value="confirmed">Status: Confirmed</option>
              <option value="in_progress">Status: In Progress</option>
              <option value="completed">Status: Completed</option>
            </Select>

            {activeTab === 'schedule' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsScheduleModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Timeline Cue
              </Button>
            )}

            {activeTab === 'tasks' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsTaskModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Task
              </Button>
            )}

            {activeTab === 'gear' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsRequisitionModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Requisition Gear
              </Button>
            )}

            {activeTab === 'work_orders' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsWorkOrderModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Issue Work Order
              </Button>
            )}
          </div>
        }
      />

      {/* Production Metadata Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Venue"
          value={event.venueName.split(',')[0]}
          icon={<MapPin className="w-4 h-4" />}
          description={event.venueName}
        />
        <StatCard
          label="Dates"
          value={event.startDate}
          icon={<Calendar className="w-4 h-4" />}
          description={`Concludes: ${event.endDate}`}
        />
        <StatCard
          label="Budget Allocated"
          value={`₹${formatCurrency(event.budget)}`}
          icon={<DollarSign className="w-4 h-4" />}
          description={`Spent: ₹${formatCurrency(computedActualSpend || event.actualSpend)}`}
        />
        <StatCard
          label="Client & Guests"
          value={`${event.guestCount} Guests`}
          icon={<Users className="w-4 h-4" />}
          description={`Client: ${event.clientName}`}
        />
      </div>

      {/* Navigation Tabs */}
      <Tabs
        items={tabItems}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* Tab: Run of Show Timeline */}
      {activeTab === 'schedule' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Minute-by-Minute Run of Show</CardTitle>
                <CardDescription>
                  Production cue calls, staging movements, AV triggers, and responsible team leads.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsScheduleModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Cue
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {event.schedules && event.schedules.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {event.schedules.map((item) => (
                  <div
                    key={item.id}
                    className={`py-3.5 flex items-start gap-4 transition-colors ${
                      item.isCompleted ? 'opacity-50' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleEventSchedule(event.id, item.id)}
                      className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                        item.isCompleted
                          ? 'bg-zinc-900 border-zinc-900 text-white'
                          : 'border-zinc-300 hover:border-zinc-500'
                      }`}
                    >
                      {item.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                            {item.timeSlot}
                          </span>
                          <h4 className="text-sm font-semibold text-zinc-900">{item.title}</h4>
                        </div>
                        <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1">
                          <User className="w-3 h-3" /> Lead: {item.leadPerson}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 mt-1">{item.description}</p>
                      {item.cueNotes && (
                        <p className="text-[11px] font-mono text-amber-700 bg-amber-50/80 px-2 py-1 rounded border border-amber-200/60 mt-2 inline-block">
                          Cue Notes: {item.cueNotes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-400 text-xs">
                No timeline cues scheduled yet. Click &quot;Add Timeline Cue&quot; to begin.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab: Tasks Checklist */}
      {activeTab === 'tasks' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Production Checklist & Operations</CardTitle>
                <CardDescription>Licensing, police permissions, stage rigging, and vendor readiness.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTaskModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {event.tasks && event.tasks.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {event.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`py-3 flex items-center justify-between gap-4 transition-colors ${
                      task.isCompleted ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleEventTask(event.id, task.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                          task.isCompleted
                            ? 'bg-zinc-900 border-zinc-900 text-white'
                            : 'border-zinc-300 hover:border-zinc-500'
                        }`}
                      >
                        {task.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <div>
                        <span className={`text-xs font-medium text-zinc-900 ${task.isCompleted ? 'line-through' : ''}`}>
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-zinc-400">{task.category}</span>
                          <span className="text-[10px] text-zinc-400">&bull;</span>
                          <span className="text-[10px] text-zinc-500">Assigned: {task.assignedTo}</span>
                          <span className="text-[10px] text-zinc-400">&bull;</span>
                          <span className="text-[10px] font-mono text-zinc-500">Due: {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        task.priority === 'urgent'
                          ? 'danger'
                          : task.priority === 'high'
                          ? 'warning'
                          : 'neutral'
                      }
                      dot
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-400 text-xs">
                No tasks assigned yet.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab: Gear & Fleet Requisitions */}
      {activeTab === 'gear' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Fleet & AV Equipment Requisitions</CardTitle>
                <CardDescription>
                  Directly reserved warehouse inventory, rental cost calculations, and load-in pull-sheet.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  icon={<Printer className="w-3.5 h-3.5" />}
                >
                  Print Pull-Sheet
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsRequisitionModalOpen(true)}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Requisition Gear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {eventRequisitions.length > 0 ? (
              <div className="border border-zinc-200/80 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200/80 font-mono text-[10px] uppercase text-zinc-500">
                    <tr>
                      <th className="py-2.5 px-3">Item / SKU</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-center">Rental Days</th>
                      <th className="py-2.5 px-3 text-right">Daily Rate</th>
                      <th className="py-2.5 px-3 text-right">Total Cost</th>
                      <th className="py-2.5 px-3 text-center">Dispatch Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {eventRequisitions.map((req) => (
                      <tr key={req.id} className="hover:bg-zinc-50/60">
                        <td className="py-3 px-3">
                          <p className="font-semibold text-zinc-900">{req.itemName}</p>
                          <p className="text-[10px] font-mono text-zinc-400">{req.itemSku}</p>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-medium">{req.quantity}</td>
                        <td className="py-3 px-3 text-center font-mono">{req.days} days</td>
                        <td className="py-3 px-3 text-right font-mono">₹{formatCurrency(req.rentalPrice)}</td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-zinc-950">
                          ₹{formatCurrency(req.totalCost)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Badge
                            variant={
                              req.status === 'dispatched'
                                ? 'purple'
                                : req.status === 'returned'
                                ? 'success'
                                : 'warning'
                            }
                            dot
                          >
                            {req.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1">
                          {req.status === 'reserved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[10px] h-6 px-1.5"
                              onClick={() => updateRequisitionStatus(req.id, 'dispatched')}
                            >
                              Dispatch
                            </Button>
                          )}
                          {req.status === 'dispatched' && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-[10px] h-6 px-1.5"
                              onClick={() => updateRequisitionStatus(req.id, 'returned')}
                            >
                              Return
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-400 text-xs">
                No equipment requisitions created yet for this production.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab: Vendor Work Orders */}
      {activeTab === 'work_orders' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Subcontractor Purchase Orders & Work Orders</CardTitle>
                <CardDescription>
                  Formal scopes of work, cue assignments, contracted advance payments, and bill tracking.
                </CardDescription>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsWorkOrderModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Issue Work Order
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {eventWorkOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eventWorkOrders.map((wo) => (
                  <div
                    key={wo.id}
                    className="p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-xl space-y-3 hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-400">{wo.workOrderNo}</span>
                        <h4 className="text-sm font-semibold text-zinc-900">{wo.vendorName}</h4>
                        <span className="text-[11px] text-zinc-500">{wo.vendorCategory}</span>
                      </div>
                      <Badge
                        variant={
                          wo.status === 'accepted'
                            ? 'success'
                            : wo.status === 'invoiced'
                            ? 'purple'
                            : wo.status === 'declined'
                            ? 'danger'
                            : 'warning'
                        }
                        dot
                      >
                        {wo.status}
                      </Badge>
                    </div>

                    <div className="text-xs text-zinc-600 bg-white p-2.5 rounded-lg border border-zinc-200/60 space-y-1">
                      <p className="font-medium text-zinc-900">Scope of Work:</p>
                      <p className="text-[11px]">{wo.scopeOfWork}</p>
                      {wo.cueAssignments && (
                        <p className="text-[11px] font-mono text-zinc-500 pt-1 border-t border-zinc-100">
                          Linked Cues: {wo.cueAssignments}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1 border-t border-zinc-200/60 font-mono">
                      <div>
                        <span className="text-zinc-400 text-[10px] block">Contract Value</span>
                        <span className="font-semibold text-zinc-950">₹{formatCurrency(wo.contractAmount)}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 text-[10px] block">Advance Paid</span>
                        <span className="text-emerald-700 font-medium">₹{formatCurrency(wo.advancePaid)}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 text-[10px] block">Due Date</span>
                        <span className="text-zinc-700">{wo.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-1.5 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7"
                        onClick={() => setSelectedWorkOrder(wo)}
                        icon={<Printer className="w-3 h-3" />}
                      >
                        View / Print PO
                      </Button>
                      {wo.status === 'issued' && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="text-[11px] h-7"
                          onClick={() => updateWorkOrderStatus(wo.id, 'accepted')}
                        >
                          Mark Accepted
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-400 text-xs">
                No vendor work orders issued yet for this event.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab: Financials & Budget */}
      {activeTab === 'financials' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Budget Health & Expenditure</CardTitle>
              <CardDescription>Production expenditure vs contractual budget</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Utilization Rate</span>
                  <span className="font-mono font-medium text-zinc-900">
                    {Math.round(((computedActualSpend || event.actualSpend) / (event.budget || 1)) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 rounded-full"
                    style={{ width: `${Math.min(100, Math.round(((computedActualSpend || event.actualSpend) / (event.budget || 1)) * 100))}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100 text-xs">
                <div>
                  <p className="text-zinc-400 text-[11px]">Total Contract Budget</p>
                  <p className="font-mono font-semibold text-zinc-900 text-base mt-1">
                    ₹{formatCurrency(event.budget)}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-400 text-[11px]">Actual Spend To Date</p>
                  <p className="font-mono font-semibold text-zinc-900 text-base mt-1">
                    ₹{formatCurrency(computedActualSpend || event.actualSpend)}
                  </p>
                </div>
              </div>

              {eventApprovedExpenses.length > 0 && (
                <div className="pt-3 border-t border-zinc-100">
                  <h5 className="font-semibold text-zinc-900 text-xs mb-2">Approved Expenditures</h5>
                  <div className="space-y-1.5">
                    {eventApprovedExpenses.map((exp) => (
                      <div key={exp.id} className="p-2 bg-zinc-50 rounded border border-zinc-200/60 flex justify-between items-center text-[11px]">
                        <div>
                          <span className="font-medium text-zinc-900">{exp.description}</span>
                          <span className="text-zinc-400 text-[10px] block">{exp.vendorName} &bull; {exp.category}</span>
                        </div>
                        <span className="font-mono font-semibold text-zinc-950">₹{formatCurrency(exp.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Commercial Operations</CardTitle>
              <CardDescription>Associated financial links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              <Link href="/quotations" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  View Quotations & Proposals
                </Button>
              </Link>
              <Link href="/invoices" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  View GST Milestone Invoices
                </Button>
              </Link>
              <Link href="/expenses" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  Review & Approve Expenses
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Schedule Cue Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Add Timeline Cue"
        description="Insert a minute-by-minute staging or production cue into the master run of show."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddSchedule}>
              Save Cue
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSchedule} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Day Number"
              type="number"
              value={scheduleData.dayNumber}
              onChange={(e) => setScheduleData({ ...scheduleData, dayNumber: Number(e.target.value) })}
            />
            <Input
              label="Time Slot"
              placeholder="e.g. 19:30 - 20:15"
              value={scheduleData.timeSlot}
              onChange={(e) => setScheduleData({ ...scheduleData, timeSlot: e.target.value })}
            />
          </div>

          <Input
            label="Cue Title"
            required
            placeholder="e.g. Bridal Entry Pyro & Spotlight Sequence"
            value={scheduleData.title}
            onChange={(e) => setScheduleData({ ...scheduleData, title: e.target.value })}
          />

          <Input
            label="Detailed Description"
            placeholder="Step-by-step description for stage crew..."
            value={scheduleData.description}
            onChange={(e) => setScheduleData({ ...scheduleData, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Stage Lead Person"
              value={scheduleData.leadPerson}
              onChange={(e) => setScheduleData({ ...scheduleData, leadPerson: e.target.value })}
            />
            <Input
              label="Cue Call Notes"
              placeholder="e.g. Cue 4B Cold Sparks on 3rd chord"
              value={scheduleData.cueNotes}
              onChange={(e) => setScheduleData({ ...scheduleData, cueNotes: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Add Production Task"
        description="Add a task item to the event production checklist."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddTask}>
              Add Task
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddTask} className="space-y-4">
          <Input
            label="Task Description"
            required
            placeholder="e.g. Sound system line check & wireless mic frequencies"
            value={taskData.title}
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={taskData.category}
              onChange={(e) => setTaskData({ ...taskData, category: e.target.value })}
            >
              <option value="Production">Production</option>
              <option value="Licensing">Licensing / Police / Fire</option>
              <option value="Catering">Catering / F&B</option>
              <option value="Decor">Décor & Floral</option>
              <option value="Security">Security & Admissions</option>
            </Select>

            <Select
              label="Priority"
              value={taskData.priority}
              onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Assigned To"
              value={taskData.assignedTo}
              onChange={(e) => setTaskData({ ...taskData, assignedTo: e.target.value })}
            />
            <Input
              label="Due Date"
              type="date"
              value={taskData.dueDate}
              onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Requisition Gear Modal */}
      <Modal
        isOpen={isRequisitionModalOpen}
        onClose={() => setIsRequisitionModalOpen(false)}
        title="Requisition Fleet Equipment"
        description="Select items from warehouse inventory to reserve for this production."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsRequisitionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddRequisition}>
              Confirm Requisition
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddRequisition} className="space-y-3.5">
          <Select
            label="Select Gear from Fleet Inventory"
            value={requisitionData.itemId}
            onChange={(e) => {
              const item = inventory.find(i => i.id === e.target.value);
              if (item) {
                const total = item.rentalPrice * requisitionData.quantity * requisitionData.days;
                setRequisitionData({
                  ...requisitionData,
                  itemId: item.id,
                  itemName: item.name,
                  itemSku: item.sku,
                  rentalPrice: item.rentalPrice,
                  totalCost: total
                });
              }
            }}
          >
            {inventory.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.sku}) - Available: {item.totalQty - item.allocatedQty} of {item.totalQty}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Quantity Needed"
              type="number"
              min={1}
              value={requisitionData.quantity}
              onChange={(e) => {
                const q = Math.max(1, Number(e.target.value));
                setRequisitionData({
                  ...requisitionData,
                  quantity: q,
                  totalCost: q * requisitionData.rentalPrice * requisitionData.days
                });
              }}
            />
            <Input
              label="Rental Days"
              type="number"
              min={1}
              value={requisitionData.days}
              onChange={(e) => {
                const d = Math.max(1, Number(e.target.value));
                setRequisitionData({
                  ...requisitionData,
                  days: d,
                  totalCost: requisitionData.quantity * requisitionData.rentalPrice * d
                });
              }}
            />
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-lg flex items-center justify-between font-mono text-xs">
            <span className="font-semibold text-zinc-900">Total Calculated Cost:</span>
            <span className="font-bold text-zinc-950 text-sm">₹{formatCurrency(requisitionData.totalCost)}</span>
          </div>
        </form>
      </Modal>

      {/* Issue Work Order Modal */}
      <Modal
        isOpen={isWorkOrderModalOpen}
        onClose={() => setIsWorkOrderModalOpen(false)}
        title="Issue Subcontractor Work Order"
        description="Contract a partner vendor with clear scope, cue assignments, and budget."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsWorkOrderModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddWorkOrder}>
              Issue Work Order
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddWorkOrder} className="space-y-3.5">
          <Select
            label="Partner Vendor"
            value={workOrderData.vendorId}
            onChange={(e) => {
              const v = vendors.find(ven => ven.id === e.target.value);
              if (v) {
                setWorkOrderData({
                  ...workOrderData,
                  vendorId: v.id,
                  vendorName: v.name,
                  vendorCategory: v.category
                });
              }
            }}
          >
            {vendors.map(v => (
              <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
            ))}
          </Select>

          <Input
            label="Scope of Work"
            required
            placeholder="Detailed deliverables and production responsibilities..."
            value={workOrderData.scopeOfWork}
            onChange={(e) => setWorkOrderData({ ...workOrderData, scopeOfWork: e.target.value })}
          />

          <Input
            label="Linked Timeline Cues"
            placeholder="e.g. Cue 01: Walk-in audio; Cue 03: Spotlight"
            value={workOrderData.cueAssignments}
            onChange={(e) => setWorkOrderData({ ...workOrderData, cueAssignments: e.target.value })}
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Contract Amount (₹)"
              type="number"
              value={workOrderData.contractAmount}
              onChange={(e) => setWorkOrderData({ ...workOrderData, contractAmount: Number(e.target.value) })}
            />
            <Input
              label="Advance Paid (₹)"
              type="number"
              value={workOrderData.advancePaid}
              onChange={(e) => setWorkOrderData({ ...workOrderData, advancePaid: Number(e.target.value) })}
            />
            <Input
              label="Completion Due"
              type="date"
              value={workOrderData.dueDate}
              onChange={(e) => setWorkOrderData({ ...workOrderData, dueDate: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Printable Purchase Order Modal */}
      {selectedWorkOrder && (
        <Modal
          isOpen={!!selectedWorkOrder}
          onClose={() => setSelectedWorkOrder(null)}
          title={`Purchase Order ${selectedWorkOrder.workOrderNo}`}
          description={`Contract issued to ${selectedWorkOrder.vendorName}`}
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                icon={<Printer className="w-3.5 h-3.5" />}
              >
                Print PO
              </Button>
              <Button variant="primary" size="sm" onClick={() => setSelectedWorkOrder(null)}>
                Close
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-start pb-3 border-b border-zinc-200">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400">Vendor</span>
                <p className="font-semibold text-zinc-900 text-sm mt-0.5">{selectedWorkOrder.vendorName}</p>
                <p className="text-zinc-500">{selectedWorkOrder.vendorCategory}</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] uppercase text-zinc-400">Timeline</span>
                <p className="text-zinc-900 mt-0.5">Issued: {selectedWorkOrder.issuedDate}</p>
                <p className="text-rose-600">Due: {selectedWorkOrder.dueDate}</p>
              </div>
            </div>

            <div className="p-3 bg-zinc-50 rounded-lg space-y-1">
              <span className="font-semibold text-zinc-900 block">Deliverables & Scope of Work:</span>
              <p className="text-zinc-700">{selectedWorkOrder.scopeOfWork}</p>
              {selectedWorkOrder.cueAssignments && (
                <p className="text-[11px] font-mono text-zinc-500 pt-1 border-t border-zinc-200">
                  Required Cue Execution: {selectedWorkOrder.cueAssignments}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs pt-2">
              <div className="p-2.5 bg-white border border-zinc-200 rounded">
                <span className="text-zinc-400 text-[10px] block">Agreed Contract Amount</span>
                <span className="font-bold text-zinc-950 text-sm">₹{formatCurrency(selectedWorkOrder.contractAmount)}</span>
              </div>
              <div className="p-2.5 bg-white border border-zinc-200 rounded">
                <span className="text-zinc-400 text-[10px] block">Mobilization Advance</span>
                <span className="font-bold text-emerald-700 text-sm">₹{formatCurrency(selectedWorkOrder.advancePaid)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
