/**
 * Business Communication OS - Scheduled Actions & Follow-ups View
 * Feature IDs: SYS-006, UI-001, UI-016
 */

import React, { useState } from 'react';
import { Clock, Plus, AlertCircle, CheckCircle, Repeat, Send, Bell } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { useLanguage } from '../i18n/LanguageContext';
import { Schedule, ScheduleActionType } from '../types/domain';
import { INITIAL_SCHEDULES } from '../persistence/repositories';

export const ScheduledView: React.FC = () => {
  const { t } = useLanguage();
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [actionType, setActionType] = useState<ScheduleActionType>('FOLLOW_UP');
  const [scheduleDate, setScheduleDate] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0]
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSch: Schedule = {
      id: `sch-${Date.now()}`,
      userId: 'usr-default',
      title,
      actionType,
      payload: { note: 'Automated follow-up' },
      scheduledAt: new Date(`${scheduleDate}T10:00:00Z`).toISOString(),
      status: 'PENDING',
      recurrence: 'NONE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSchedules(prev => [newSch, ...prev]);
    setTitle('');
    setShowAddModal(false);
  };

  const getActionBadge = (type: ScheduleActionType) => {
    switch (type) {
      case 'FOLLOW_UP':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900">Follow-up</span>;
      case 'EMAIL_SEND':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-900">Email Send</span>;
      case 'REMINDER':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900">Reminder</span>;
      case 'WHATSAPP_SEND':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">WhatsApp Send</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">{type}</span>;
    }
  };

  return (
    <div id="view-scheduled" className="space-y-6">
      <PageHeader
        id="scheduled-header"
        title={t.scheduledTitle}
        description={t.scheduledSubtitle}
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.scheduledNewAction}</span>
          </button>
        }
      />

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-md w-full shadow-xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              {t.scheduledNewAction}
            </h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Action Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Check-in with Western Telecom"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Action Type
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as ScheduleActionType)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden"
                >
                  <option value="FOLLOW_UP">Follow-up</option>
                  <option value="EMAIL_SEND">Email Send</option>
                  <option value="REMINDER">Reminder</option>
                  <option value="TASK">Task</option>
                  <option value="WHATSAPP_SEND">WhatsApp Send</option>
                  <option value="WORKFLOW">Workflow Trigger</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Execution Date
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg shadow-xs cursor-pointer"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {schedules.length === 0 ? (
        <EmptyState
          icon={Clock}
          title={t.scheduledNoActions}
          description={t.scheduledNoActionsDesc}
          actionLabel={t.scheduledNewAction}
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedules.map((sch) => (
            <div
              key={sch.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                  {sch.title}
                </h3>
                {getActionBadge(sch.actionType)}
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  Scheduled: {new Date(sch.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(sch.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-400">
                  <Repeat className="w-3 h-3" />
                  <span>{sch.recurrence}</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {sch.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
