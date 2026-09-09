/**
 * Business Communication OS - Reusable Error State Component
 * Feature ID: UI-015
 */

import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorStateProps {
  id?: string;
  title?: string;
  message?: string;
  details?: unknown;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  id = 'error-state',
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this view.',
  details,
  onRetry,
  retryLabel = 'Retry',
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div 
      id={id} 
      className="p-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/20 text-neutral-900 dark:text-neutral-100 my-4"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-red-900 dark:text-red-300">
            {title}
          </h3>
          <p className="text-sm text-red-700 dark:text-red-400 mt-1 leading-relaxed">
            {message}
          </p>

          {details ? (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowDetails(prev => !prev)}
                className="inline-flex items-center gap-1 text-xs font-medium text-red-700 dark:text-red-400 hover:underline cursor-pointer"
              >
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showDetails ? 'Hide technical details' : 'Show technical details'}
              </button>
              {showDetails && (
                <pre className="mt-2 p-3 text-xs bg-red-100/70 dark:bg-red-950/60 rounded-md overflow-x-auto text-red-900 dark:text-red-200 font-mono">
                  {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
                </pre>
              )}
            </div>
          ) : null}

          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {retryLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
