/**
 * Business Communication OS - Sidebar Navigation Component
 * Feature IDs: UI-002, UI-005, UI-006, UI-007, UI-008
 */

import React from 'react';
import { 
  Home, 
  Mail, 
  Calendar, 
  Users, 
  CheckSquare, 
  Clock, 
  Sparkles, 
  Settings, 
  MessageCircle, 
  Zap, 
  Briefcase, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export type NavRoute = 
  | 'home' 
  | 'mail' 
  | 'calendar' 
  | 'contacts' 
  | 'tasks' 
  | 'scheduled' 
  | 'ai' 
  | 'settings';

interface SidebarProps {
  currentRoute: NavRoute;
  onNavigate: (route: NavRoute) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  unreadCount?: number;
  tasksCount?: number;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavItem {
  id: NavRoute;
  labelKey: string;
  icon: LucideIcon;
  badge?: number;
}

interface FutureNavItem {
  id: string;
  labelKey: string;
  icon: LucideIcon;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  unreadCount = 1,
  tasksCount = 3,
  mobileOpen = false,
  onMobileClose,
}) => {
  const { t, isRTL } = useLanguage();

  const primaryItems: NavItem[] = [
    { id: 'home', labelKey: t.navHome, icon: Home },
    { id: 'mail', labelKey: t.navMail, icon: Mail, badge: unreadCount },
    { id: 'calendar', labelKey: t.navCalendar, icon: Calendar },
    { id: 'contacts', labelKey: t.navContacts, icon: Users },
    { id: 'tasks', labelKey: t.navTasks, icon: CheckSquare, badge: tasksCount },
    { id: 'scheduled', labelKey: t.navScheduled, icon: Clock },
    { id: 'ai', labelKey: t.navAI, icon: Sparkles },
    { id: 'settings', labelKey: t.navSettings, icon: Settings },
  ];

  const futureItems: FutureNavItem[] = [
    { id: 'whatsapp', labelKey: t.navWhatsApp, icon: MessageCircle },
    { id: 'automation', labelKey: t.navAutomation, icon: Zap },
    { id: 'crm', labelKey: t.navCRM, icon: Briefcase },
    { id: 'analytics', labelKey: t.navAnalytics, icon: BarChart3 },
  ];

  const handleItemClick = (route: NavRoute) => {
    onNavigate(route);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const collapseIcon = isRTL 
    ? (isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)
    : (isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          onClick={onMobileClose}
          className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        className={`
          fixed lg:static top-0 bottom-0 z-50
          ${isRTL ? 'right-0 border-l' : 'left-0 border-r'}
          flex flex-col
          bg-white dark:bg-neutral-900 
          border-neutral-200 dark:border-neutral-800
          transition-all duration-200 ease-in-out
          ${mobileOpen ? 'translate-x-0 w-64' : `${isCollapsed ? 'lg:w-18' : 'lg:w-64'} ${isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        `}
      >
        {/* Brand / Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-900 font-bold text-sm shrink-0">
                OS
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-100 truncate block">
                  {t.appName}
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                  Phase 1A
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="mx-auto">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-900 font-bold text-sm">
                OS
              </div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Toggle sidebar"
            aria-label="Toggle sidebar"
          >
            {collapseIcon}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* Primary Navigation */}
          <div className="space-y-1">
            {primaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  title={isCollapsed ? item.labelKey : undefined}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
                    ${isActive 
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs' 
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }
                    ${isCollapsed ? 'justify-center px-2' : ''}
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-start">
                      {item.labelKey}
                    </span>
                  )}
                  {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className={`
                      text-xs px-1.5 py-0.5 rounded-full font-mono font-semibold
                      ${isActive 
                        ? 'bg-neutral-700 text-neutral-100 dark:bg-neutral-300 dark:text-neutral-900' 
                        : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Future Modules Section (Clearly Marked) */}
          <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800">
            {!isCollapsed && (
              <div className="px-3 mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  {t.futureModuleBadge}
                </span>
                <span className="text-[10px] text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                  Upcoming
                </span>
              </div>
            )}
            <div className="space-y-1">
              {futureItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    title={t.futureModuleNotice}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-60
                      ${isCollapsed ? 'justify-center px-2' : ''}
                    `}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate flex-1 text-start">
                        {item.labelKey}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 shrink-0 text-xs text-neutral-400 dark:text-neutral-500">
            <div className="flex items-center justify-between">
              <span>Status: Active</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
