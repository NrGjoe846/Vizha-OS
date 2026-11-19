'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import { EventStatus } from '@/lib/types';
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
  AlertCircle
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
    addEventTask
  } = useERP();

  const event = events.find(e => e.id === resolvedParams.id) || events[0];

  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks' | 'financials'>('schedule');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

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

  const tabItems = [
    { id: 'schedule', label: 'Run of Show (Cues)', count: event.schedules?.length || 0, icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'tasks', label: 'Checklist & Tasks', count: event.tasks?.length || 0, icon: <ClipboardList className="w-3.5 h-3.5" /> },
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
        description={`${event.eventType} • Produced by ${event.managerName}`}
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
          description={`Spent: ₹${formatCurrency(event.actualSpend)}`}
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
                {event.schedules.map((item, idx) => (
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
                          <h4 className={`text-xs font-semibold ${item.isCompleted ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                            {item.title}
                          </h4>
                        </div>
                        <span className="text-[11px] text-zinc-400">
                          Lead: <span className="font-medium text-zinc-700">{item.leadPerson}</span>
                        </span>
                      </div>

                      <p className="text-xs text-zinc-500 mt-1">{item.description}</p>

                      {item.cueNotes && (
                        <div className="mt-2 text-[11px] font-mono text-amber-800 bg-amber-50/70 px-2.5 py-1 rounded border border-amber-200/50 inline-block">
                          CUE: {item.cueNotes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 py-6 text-center">No timeline items recorded yet.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab: Tasks & Checklist */}
      {activeTab === 'tasks' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Milestone Production Checklist</CardTitle>
                <CardDescription>
                  Operational readiness, licensing, staging load-in, catering tastings, and QA checks.
                </CardDescription>
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
          <CardContent className="space-y-2.5 pt-4">
            {event.tasks && event.tasks.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {event.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleEventTask(event.id, task.id)}
                    className="py-3 flex items-center justify-between cursor-pointer hover:bg-zinc-50/50 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => {}}
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
                      />
                      <div>
                        <p className={`text-xs font-medium ${task.isCompleted ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                          {task.title}
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Assigned to {task.assignedTo} &bull; Due {task.dueDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={task.priority === 'urgent' ? 'danger' : 'neutral'} dot>
                        {task.priority}
                      </Badge>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                        {task.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 py-6 text-center">No production tasks logged.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab: Budget & Financials */}
      {activeTab === 'financials' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Budget Allocation Breakdown</CardTitle>
              <CardDescription>Production expenditure vs contractual budget</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Utilization Rate</span>
                  <span className="font-mono font-medium text-zinc-900">
                    {Math.round((event.actualSpend / (event.budget || 1)) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((event.actualSpend / (event.budget || 1)) * 100))}%` }}
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
                    ₹{formatCurrency(event.actualSpend)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Associated financial documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              <Link href="/quotations" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  View Quotations
                </Button>
              </Link>
              <Link href="/invoices" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  View GST Invoices
                </Button>
              </Link>
              <Link href="/expenses" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  Log Production Expense
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
    </div>
  );
}
