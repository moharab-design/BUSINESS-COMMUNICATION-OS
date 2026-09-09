/**
 * Business Communication OS - Home Dashboard View
 * Feature IDs: DASH-001, UI-001, UI-005, UI-006, UI-007, UI-008
 */

import React from 'react';
import { 
  Mail, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  Layers, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { ProviderBadge, PriorityBadge } from '../components/common/StatusBadge';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../services/auth/AuthContext';
import { 
  INITIAL_MESSAGES, 
  INITIAL_CALENDAR_EVENTS, 
  INITIAL_TASKS, 
  INITIAL_SCHEDULES, 
  INITIAL_CONNECTED_ACCOUNTS 
} from '../persistence/repositories';
import { NavRoute } from '../components/layout/Sidebar';

interface HomeViewProps {
  onNavigate: (route: NavRoute) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const unreadCount = INITIAL_MESSAGES.filter(m => !m.isRead).length;
  const pendingTasksCount = INITIAL_TASKS.filter(t => t.status !== 'COMPLETED').length;
  const upcomingEventsCount = INITIAL_CALENDAR_EVENTS.length;
  const scheduledCount = INITIAL_SCHEDULES.length;

  const statCards = [
    {
      title: t.dashUnreadMail,
      value: unreadCount,
      icon: Mail,
      route: 'mail' as NavRoute,
      desc: 'Across all connected inboxes',
    },
    {
      title: t.dashUpcomingEvents,
      value: upcomingEventsCount,
      icon: Calendar,
      route: 'calendar' as NavRoute,
      desc: 'Next 48 hours agenda',
    },
    {
      title: t.dashPendingTasks,
      value: pendingTasksCount,
      icon: CheckSquare,
      route: 'tasks' as NavRoute,
      desc: '1 urgent priority action',
    },
    {
      title: t.dashScheduledActions,
      value: scheduledCount,
      icon: Clock,
      route: 'scheduled' as NavRoute,
      desc: 'Follow-ups and deferred items',
    },
  ];

  return (
    <div id="view-dashboard" className="space-y-6">
      <PageHeader
        id="dashboard-header"
        title={t.dashWelcome}
        description={t.dashSubtitle}
        action={
          <button
            onClick={() => onNavigate('ai')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.navAI}</span>
          </button>
        }
      />

      {/* Operational Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigate(card.route)}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-neutral-100 dark:group-hover:text-neutral-900 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                {card.value}
              </div>
              <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                {card.title}
              </div>
              <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
                {card.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Mail & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Communications */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {t.dashRecentCommunications}
            </h2>
            <button
              onClick={() => onNavigate('mail')}
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {INITIAL_MESSAGES.map((msg) => (
              <div
                key={msg.id}
                onClick={() => onNavigate('mail')}
                className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {msg.from.name}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <ProviderBadge provider={msg.provider} />
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                    )}
                  </div>
                </div>
                <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200 line-clamp-1">
                  {msg.subject}
                </p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 line-clamp-1 mt-0.5">
                  {msg.snippet}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Agenda & Urgent Tasks */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {t.dashAgendaToday}
            </h2>
            <button
              onClick={() => onNavigate('calendar')}
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium cursor-pointer"
            >
              View calendar
            </button>
          </div>

          <div className="space-y-3">
            {INITIAL_CALENDAR_EVENTS.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onNavigate('calendar')}
                className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {evt.title}
                  </span>
                  <ProviderBadge provider={evt.provider} />
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                  <span>{new Date(evt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>•</span>
                  <span>{evt.location}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Top Pending Action
              </span>
              <PriorityBadge priority="URGENT" />
            </div>
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 text-xs">
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {INITIAL_TASKS[0]?.title}
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                Source: {INITIAL_TASKS[0]?.sourceType} • Due: {INITIAL_TASKS[0]?.dueDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Providers Row */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {t.dashConnectedAccounts}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t.dashConnectPrompt}
            </p>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="text-xs font-medium text-neutral-900 dark:text-neutral-100 hover:underline self-start sm:self-auto cursor-pointer"
          >
            Manage Providers
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {INITIAL_CONNECTED_ACCOUNTS.map((acc) => (
            <div
              key={acc.id}
              className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {acc.displayName || acc.provider}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  {acc.accountEmail}
                </p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                acc.status === 'ACTIVE' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                  : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
              }`}>
                {acc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
