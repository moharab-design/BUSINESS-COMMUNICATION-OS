/**
 * Business Communication OS - Reusable Loading Skeleton Component
 * Feature ID: UI-014
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 ${className}`}
    />
  );
};

export const TableLoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="w-full space-y-3 p-4">
      <Skeleton className="h-8 w-full max-w-sm mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b border-neutral-100 dark:border-neutral-800/80">
          <Skeleton className="w-9 h-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3.5 w-3/4" />
          </div>
          <Skeleton className="h-4 w-20 shrink-0" />
        </div>
      ))}
    </div>
  );
};

export const CardLoadingSkeleton: React.FC<{ cards?: number }> = ({ cards = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
};
