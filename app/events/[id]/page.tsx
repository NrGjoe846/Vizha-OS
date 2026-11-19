'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import { EventStatus } from '@/lib/types';
import {
  CalendarDays,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Sparkles,
  ClipboardList,
  User
} from 'lucide-react';

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

  if (!event) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-slate-500">Event not found.</p>
        <Link href="/events" className="text-indigo-600 text-xs font-semibold mt-2 inline-block">
          &larr; Back to Events
        </Link>
      </div>
    );
  }

  const budgetUsedPercent = Math.min(100, Math.round((event.actualSpend / (event.budget || 1)) * 100));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Productions</span>
        </Link>

        {/* Status quick changer */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={event.status}
            onChange={(e) => updateEventStatus(event.id, e.target.value as EventStatus)}
            className="text-xs font-bold uppercase tracking-wider bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 shadow-xs"
          >
            <option value="draft">Draft</option>
            <option value="planning">Planning</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Production Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white min-h-[200px] flex flex-col justify-end p-6 md:p-8 shadow-xl">
        <img
          src={event.coverImage}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold bg-indigo-600/80 px-2.5 py-0.5 rounded backdrop-blur-md">
              {event.code}
            </span>
            <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-0.5 rounded backdrop-blur-md">
              {event.eventType}
            </span>
            <span className="text-xs text-slate-300">
              Producer Lead: <strong className="text-white">{event.managerName}</strong>
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{event.title}</h1>

          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-300 pt-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>{event.venueName}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-indigo-400" />
              <span>{event.startDate} &rarr; {event.endDate}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>{event.guestCount} Guests Confirmed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Client: {event.clientName}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'schedule'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Minute-by-Minute Run of Show ({event.schedules.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'tasks'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Production Checklists ({event.tasks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'financials'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Budget & Spend Analytics</span>
          </button>
        </div>

        {activeTab === 'schedule' && (
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="mb-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Show Cue</span>
          </button>
        )}

        {activeTab === 'tasks' && (
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="mb-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Checklist Task</span>
          </button>
        )}
      </div>

      {/* Tab 1: Minute-by-Minute Run of Show */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-xl flex items-center gap-2.5 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Real-time show cues are synchronized across AV technicians, stage directors, and vendor leads. Check items to mark as staged.
            </span>
          </div>

          <div className="space-y-3">
            {event.schedules.map((sch) => (
              <div
                key={sch.id}
                className={`bg-white rounded-xl border p-4.5 transition-all shadow-xs ${
                  sch.isCompleted
                    ? 'border-slate-200 bg-slate-50/70 opacity-70'
                    : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => toggleEventSchedule(event.id, sch.id)}
                      className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        sch.isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-indigo-600'
                      }`}
                    >
                      {sch.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                          {sch.timeSlot}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">Day {sch.dayNumber}</span>
                        <h3 className={`text-sm font-bold ${sch.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {sch.title}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-600 mt-1.5">{sch.description}</p>

                      {sch.cueNotes && (
                        <div className="mt-2.5 text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span><strong>Staging Cue:</strong> {sch.cueNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      Lead: {sch.leadPerson}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {event.schedules.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No cues added yet. Click &quot;Add Show Cue&quot; above to build the minute-by-minute itinerary.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Production Tasks */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Milestone Checklists & Safety Protocol</h3>
            <span className="text-xs font-semibold text-indigo-600">
              {event.tasks.filter(t => t.isCompleted).length} / {event.tasks.length} Done
            </span>
          </div>

          <div className="space-y-3">
            {event.tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                  task.isCompleted ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleEventTask(event.id, task.id)}
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                      task.isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-indigo-600'
                    }`}
                  >
                    {task.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <div>
                    <p className={`text-xs font-semibold ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {task.category}
                      </span>
                      <span className="text-[10px] text-slate-400">Due: {task.dueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    task.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : task.priority === 'high'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {task.priority}
                  </span>
                  <span className="text-xs font-medium text-slate-600">
                    {task.assignedTo}
                  </span>
                </div>
              </div>
            ))}

            {event.tasks.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                No production tasks created yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Financials & Budget */}
      {activeTab === 'financials' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Allocated Production Budget</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">₹{event.budget.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-400 mt-1">Sanctioned by Client Agreement</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Actual Spend & Disbursements</span>
            <p className="text-2xl font-extrabold text-indigo-600 mt-2">₹{event.actualSpend.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-400 mt-1">{budgetUsedPercent}% of budget consumed</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contingency Reserve Left</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-2">
              ₹{Math.max(0, event.budget - event.actualSpend).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-emerald-700 mt-1 font-medium">Within safe margin</p>
          </div>
        </div>
      )}

      {/* Modal: Add Show Cue */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900">Add Minute-by-Minute Cue</h2>
            <p className="text-xs text-slate-500 mt-0.5">Insert a timeline milestone into the Run of Show</p>

            <form onSubmit={handleAddSchedule} className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Day Number</label>
                  <input
                    type="number"
                    min="1"
                    value={scheduleData.dayNumber}
                    onChange={(e) => setScheduleData({ ...scheduleData, dayNumber: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot *</label>
                  <input
                    type="text"
                    placeholder="19:00 - 20:30"
                    value={scheduleData.timeSlot}
                    onChange={(e) => setScheduleData({ ...scheduleData, timeSlot: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Celebrity Grand Entrance & Pyro Cascade"
                  value={scheduleData.title}
                  onChange={(e) => setScheduleData({ ...scheduleData, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={2}
                  placeholder="Instructions for host, audio team, and camera crew..."
                  value={scheduleData.description}
                  onChange={(e) => setScheduleData({ ...scheduleData, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lead In-Charge</label>
                <input
                  type="text"
                  value={scheduleData.leadPerson}
                  onChange={(e) => setScheduleData({ ...scheduleData, leadPerson: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Critical Staging Cue Note</label>
                <input
                  type="text"
                  placeholder="e.g. Trigger fog cannons on drum roll at 19:15"
                  value={scheduleData.cueNotes}
                  onChange={(e) => setScheduleData({ ...scheduleData, cueNotes: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  Save Cue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Checklist Task */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900">Add Production Task</h2>

            <form onSubmit={handleAddTask} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspect rigging truss safety clamps"
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={taskData.category}
                    onChange={(e) => setTaskData({ ...taskData, category: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Production">Production</option>
                    <option value="Tech/AV">Tech / AV</option>
                    <option value="Decor">Decor & Floral</option>
                    <option value="Catering">Catering</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Licensing">Licensing / NOC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={taskData.priority}
                    onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assignee</label>
                  <input
                    type="text"
                    value={taskData.assignedTo}
                    onChange={(e) => setTaskData({ ...taskData, assignedTo: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskData.dueDate}
                    onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
