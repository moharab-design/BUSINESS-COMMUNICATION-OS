/**
 * Business Communication OS - Primary Application Shell
 * Feature IDs: UI-001, UI-002, UI-007, UI-008
 */

import React, { useState } from 'react';
import { Sidebar, NavRoute } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  currentRoute: NavRoute;
  onNavigate: (route: NavRoute) => void;
  children: React.ReactNode;
  unreadCount?: number;
  tasksCount?: number;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentRoute,
  onNavigate,
  children,
  unreadCount,
  tasksCount,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div id="app-root-shell" className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        unreadCount={unreadCount}
        tasksCount={tasksCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopBar
          onToggleMobileSidebar={() => setMobileOpen(true)}
          onNavigate={onNavigate}
        />

        <main id="app-content-area" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
