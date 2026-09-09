/**
 * Business Communication OS - Authentication & Sign-In View
 * Feature IDs: ACC-002, ACC-003, SEC-001, SEC-002, SEC-003, UI-005, UI-006, UI-007, UI-008
 */

import React, { useState } from 'react';
import { useAuth } from '../services/auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { 
  ShieldCheck, 
  Languages, 
  Sun, 
  Moon, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Lock 
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { signInWithGoogle, error } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsSigningIn(false);
    }
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 p-4 sm:p-6 lg:p-8">
      {/* Top utility bar */}
      <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-900 font-bold text-sm">
            OS
          </div>
          <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
            {t.appName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="max-w-md w-full mx-auto my-12">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6 text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-sans">
              {t.loginTitle}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {t.loginSubtitle}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Sign in button */}
          <div className="space-y-4">
            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="w-full h-11 flex items-center justify-center gap-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 font-medium text-sm transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSigningIn ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{t.signInWithGoogle}</span>
                  <ArrowIcon className="w-4 h-4 opacity-70" />
                </>
              )}
            </button>
          </div>

          {/* Capabilities breakdown */}
          <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
            <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-2">
              {t.loginFeaturesTitle}
            </span>

            <div className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{t.loginFeature1}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{t.loginFeature2}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{t.loginFeature3}</span>
            </div>
          </div>

          {/* Security note */}
          <div className="mt-6 p-3 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/60 flex items-start gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
            <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-neutral-400" />
            <span>{t.loginSecurityNotice}</span>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-neutral-400 dark:text-neutral-500 max-w-md mx-auto">
        <span>Business Communication OS • Phase 1A Foundation</span>
      </div>
    </div>
  );
};
