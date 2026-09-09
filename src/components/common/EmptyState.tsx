/**
 * Business Communication OS - Reusable Empty State Component
 * Feature ID: UI-016
 */

import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  id?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  id = 'empty-state',
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div 
      id={id} 
      className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 my-4"
    >
      <div className="w-12 h-12 rounded-full bg-neutral-200/70 dark:bg-neutral-800 flex items-center justify-center mb-4 text-neutral-500 dark:text-neutral-400">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/60 transition-colors shadow-xs cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
