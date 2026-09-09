/**
 * Business Communication OS - Top Toolbar Component
 * Feature IDs: UI-001, UI-002, UI-003, UI-004, UI-005, UI-006, UI-007, UI-008, ACC-002
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  Languages, 
  LogOut, 
  User as UserIcon, 
  Settings, 
  Check, 
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../services/auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../theme/ThemeContext';
import { NavRoute } from './Sidebar';

interface TopBarProps {
  onToggleMobileSidebar: () => void;
  onNavigate: (route: NavRoute) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleMobileSidebar,
  onNavigate,
}) => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="app-topbar"
      className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xs px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shrink-0"
    >
      {/* Left items: Mobile toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute inset-y-0 start-3 my-auto text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full h-9 ps-9 pe-4 bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-all outline-hidden"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Language selector dropdown */}
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setLangMenuOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Switch Language"
          >
            <Languages className="w-4 h-4 text-neutral-500" />
            <span className="hidden sm:inline uppercase font-mono">{language}</span>
          </button>

          {langMenuOpen && (
            <div className="absolute end-0 mt-2 w-44 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg py-1 z-50 text-sm animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => { setLanguage('en'); setLangMenuOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2 text-start hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 cursor-pointer"
              >
                <span>English (LTR)</span>
                {language === 'en' && <Check className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />}
              </button>
              <button
                onClick={() => { setLanguage('ar'); setLangMenuOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2 text-start hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 cursor-pointer"
              >
                <span>العربية (RTL)</span>
                {language === 'ar' && <Check className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />}
              </button>
            </div>
          )}
        </div>

        {/* Theme toggle button */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title={isDark ? t.lightMode : t.darkMode}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
        </button>

        {/* User profile menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(prev => !prev)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-neutral-200 dark:hover:ring-neutral-700 transition-all cursor-pointer"
            aria-label="User menu"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.displayName}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </button>

          {userMenuOpen && (
            <div className="absolute end-0 mt-2 w-64 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {user?.email || 'user@domain.com'}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Google SSO Active</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-start cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{t.profile} & {t.preferences}</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('settings');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-start cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{t.navSettings}</span>
                </button>
              </div>

              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-start cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.signOut}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
