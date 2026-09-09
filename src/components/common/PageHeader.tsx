/**
 * Business Communication OS - Reusable Page Header Component
 * Feature IDs: UI-001, UI-002, UI-007, UI-008
 */

import React from 'react';

interface PageHeaderProps {
  id?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  id = 'page-header',
  title,
  description,
  action,
  badge,
}) => {
  return (
    <div id={id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800 mb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};
