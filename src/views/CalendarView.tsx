/**
 * Business Communication OS - Calendar View
 * Feature IDs: SYS-005, SYS-022, UI-001, UI-016
 */

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Video, Users, Plus, Check } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { ProviderBadge } from '../components/common/StatusBadge';
import { useLanguage } from '../i18n/LanguageContext';
import { CalendarEvent } from '../types/domain';
import { INITIAL_CALENDAR_EVENTS } from '../persistence/repositories';

export const CalendarView: React.FC = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('14:00');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const start = new Date(`${newDate}T${newTime}:00Z`).toISOString();
    const end = new Date(new Date(start).getTime() + 1000 * 60 * 45).toISOString();

    const newEvt: CalendarEvent = {
      id: `evt-${Date.now()}`,
      provider: 'GOOGLE',
      accountId: 'acc-google-01',
      title: newTitle,
      description: 'Scheduled via Business Communication OS',
      location: 'Google Meet',
      startTime: start,
      endTime: end,
      isAllDay: false,
      status: 'CONFIRMED',
      attendees: [{ name: 'Current User', email: 'user@enterprise.com', role: 'ORGANIZER' }],
      organizer: { name: 'Current User', email: 'user@enterprise.com' },
      conferenceUrl: 'https://meet.google.com/new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEvents(prev => [...prev, newEvt]);
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div id="view-calendar" className="space-y-6">
      <PageHeader
        id="calendar-header"
        title={t.navCalendar}
        description="Synchronized schedule unifying Google Calendar and Microsoft Outlook events."
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.calendarNewEvent}</span>
          </button>
        }
      />

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-md w-full shadow-xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              {t.calendarNewEvent}
            </h3>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Weekly Team Sync"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
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

      {events.length === 0 ? (
        <EmptyState
          icon={CalendarIcon}
          title={t.calendarNoEvents}
          description={t.calendarNoEventsDesc}
          actionLabel={t.calendarNewEvent}
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    {evt.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(evt.startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} • {new Date(evt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <ProviderBadge provider={evt.provider} />
              </div>

              {evt.description && (
                <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
                  {evt.description}
                </p>
              )}

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-neutral-500">
                  {evt.conferenceUrl ? (
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                      <Video className="w-3.5 h-3.5" />
                      <span>Video Call</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{evt.location}</span>
                    </span>
                  )}
                </div>

                {evt.conferenceUrl && (
                  <a
                    href={evt.conferenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:underline"
                  >
                    <span>{t.calendarJoinMeeting}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
