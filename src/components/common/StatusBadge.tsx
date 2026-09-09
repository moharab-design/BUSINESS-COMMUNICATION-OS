/**
 * Business Communication OS - Status & Provider Badges
 * Feature ID: UI-001
 */

import React from 'react';
import { ProviderType, TaskPriority, TaskStatus } from '../../types/domain';

export const ProviderBadge: React.FC<{ provider: ProviderType }> = ({ provider }) => {
  const configs: Record<ProviderType, { label: string; bg: string; text: string }> = {
    GOOGLE: { label: 'Google', bg: 'bg-blue-50 dark:bg-blue-950/50', text: 'text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900' },
    MICROSOFT: { label: 'Microsoft', bg: 'bg-sky-50 dark:bg-sky-950/50', text: 'text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-900' },
    WHATSAPP_BUSINESS: { label: 'WhatsApp', bg: 'bg-emerald-50 dark:bg-emerald-950/50', text: 'text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900' },
    IMAP: { label: 'IMAP', bg: 'bg-purple-50 dark:bg-purple-950/50', text: 'text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900' },
    OTHER: { label: 'Custom', bg: 'bg-neutral-100 dark:bg-neutral-800', text: 'text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700' },
  };

  const c = configs[provider] || configs.OTHER;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${c.bg} ${c.text} whitespace-nowrap`}>
      {c.label}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const styles: Record<TaskPriority, string> = {
    URGENT: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
    HIGH: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
    MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
    LOW: 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${styles[priority]} whitespace-nowrap`}>
      {priority}
    </span>
  );
};

export const TaskStatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const labels: Record<TaskStatus, { text: string; color: string }> = {
    TODO: { text: 'To Do', color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300' },
    IN_PROGRESS: { text: 'In Progress', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' },
    COMPLETED: { text: 'Completed', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' },
    CANCELLED: { text: 'Cancelled', color: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400' },
  };

  const item = labels[status] || labels.TODO;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${item.color} whitespace-nowrap`}>
      {item.text}
    </span>
  );
};
