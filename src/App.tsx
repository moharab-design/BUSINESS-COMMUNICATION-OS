/**
 * Business Communication OS - Root Application Component
 * Feature IDs: UI-001, UI-002, UI-003, UI-004, UI-005, UI-006, UI-007, UI-008, ACC-001, ACC-002, ACC-003, ACC-018
 */

import React, { useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './theme/ThemeContext';
import { AuthProvider, useAuth } from './services/auth/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { NavRoute } from './components/layout/Sidebar';
import { LoginView } from './views/LoginView';
import { HomeView } from './views/HomeView';
import { MailView } from './views/MailView';
import { CalendarView } from './views/CalendarView';
import { ContactsView } from './views/ContactsView';
import { TasksView } from './views/TasksView';
import { ScheduledView } from './views/ScheduledView';
import { AIView } from './views/AIView';
import { SettingsView } from './views/SettingsView';
import { INITIAL_MESSAGES, INITIAL_TASKS } from './persistence/repositories';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('home');

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-base mb-4 animate-pulse">
          OS
        </div>
        <p className="text-xs text-neutral-500 font-medium">
          Restoring Business Communication OS session...
        </p>
      </div>
    );
  }

  // Unauthenticated users see clean Google SSO Login View (ACC-002, ACC-003, SEC-001)
  if (!isAuthenticated) {
    return <LoginView />;
  }

  const unreadMailCount = INITIAL_MESSAGES.filter(m => !m.isRead).length;
  const pendingTasksCount = INITIAL_TASKS.filter(t => t.status !== 'COMPLETED').length;

  return (
    <AppShell
      currentRoute={currentRoute}
      onNavigate={setCurrentRoute}
      unreadCount={unreadMailCount}
      tasksCount={pendingTasksCount}
    >
      {currentRoute === 'home' && <HomeView onNavigate={setCurrentRoute} />}
      {currentRoute === 'mail' && <MailView />}
      {currentRoute === 'calendar' && <CalendarView />}
      {currentRoute === 'contacts' && <ContactsView />}
      {currentRoute === 'tasks' && <TasksView />}
      {currentRoute === 'scheduled' && <ScheduledView />}
      {currentRoute === 'ai' && <AIView />}
      {currentRoute === 'settings' && <SettingsView />}
    </AppShell>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainAppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
