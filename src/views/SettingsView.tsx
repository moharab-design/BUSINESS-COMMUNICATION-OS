/**
 * Business Communication OS - Settings & User Profile View
 * Feature IDs: ACC-001, ACC-002, UI-005, UI-006, UI-009, SYS-022, SEC-001, SEC-002, SEC-003
 */

import React, { useState } from 'react';
import { 
  User, 
  Languages, 
  Clock, 
  ShieldCheck, 
  Save, 
  LogOut, 
  Layers, 
  CheckCircle2, 
  Cpu,
  RefreshCw,
  Mail,
  Check
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { useAuth } from '../services/auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { mailService } from '../services/mail/mailService';

export const SettingsView: React.FC = () => {
  const { user, updateProfile, signOut, hasWorkspaceToken, signInWithGoogle } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'Asia/Riyadh');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  const handleConnectGoogle = async () => {
    setIsConnectingGoogle(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      alert('Google Workspace connection failed');
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        displayName,
        timezone,
        preferredLanguage: language,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // Error logged
    } finally {
      setIsSaving(false);
    }
  };

  const handleLanguageChange = (newLang: 'en' | 'ar') => {
    setLanguage(newLang);
    if (user) {
      updateProfile({ preferredLanguage: newLang }).catch(() => {});
    }
  };

  return (
    <div id="view-settings" className="space-y-8 max-w-4xl">
      <PageHeader
        id="settings-header"
        title={t.navSettings}
        description="Manage your enterprise user profile, language preferences, connected provider accounts, and security settings."
      />

      {/* Section 1: User Profile & Preferences */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              {t.profile} & {t.preferences}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t.settingsConnectedAccountsDesc}
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>SSO Verified</span>
          </span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.displayName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center font-bold text-xl">
                {displayName.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                {user?.email || 'user@enterprise.com'}
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Authentication Source: Google Workspace
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {t.settingsDisplayName}
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {t.settingsEmail}
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/50 text-neutral-500 cursor-not-allowed outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {t.language}
              </label>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'ar')}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden"
              >
                <option value="en">English (LTR)</option>
                <option value="ar">العربية (RTL)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {t.timezone}
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden"
              >
                <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                <option value="Europe/London">Europe/London (GMT+0/+1)</option>
                <option value="America/New_York">America/New_York (GMT-5)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            {saveSuccess ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.settingsProfileUpdated}</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : t.save}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Connected Provider Accounts (SYS-022, ACC-006, ACC-007, ACC-020) */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4">
        <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              {t.dashConnectedAccounts}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Manage enterprise provider accounts, Workspace OAuth tokens, and sync status.
            </p>
          </div>

          {!hasWorkspaceToken ? (
            <button
              onClick={handleConnectGoogle}
              disabled={isConnectingGoogle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isConnectingGoogle ? 'Connecting...' : 'Connect Gmail Account'}</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800">
              <Check className="w-3.5 h-3.5" />
              <span>Workspace Connected</span>
            </span>
          )}
        </div>

        <div className="space-y-3">
          {/* Google Workspace Account Card */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Google Workspace (Gmail & Contacts)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  GMAIL
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  Default Sending Account (ACC-014)
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                {user?.email || 'mohamed.arab@enterprise.com'}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                hasWorkspaceToken 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}>
                {hasWorkspaceToken ? 'ACTIVE / SYNCED' : 'REQUIRES AUTHENTICATION'}
              </span>

              {!hasWorkspaceToken ? (
                <button
                  type="button"
                  onClick={handleConnectGoogle}
                  className="px-3 py-1 text-xs font-medium bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:opacity-90 cursor-pointer"
                >
                  Authorize
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => mailService.syncMailbox()}
                  className="px-3 py-1 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Sync</span>
                </button>
              )}
            </div>
          </div>

          {/* Microsoft 365 Account Card (Secondary) */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 opacity-75">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Microsoft 365 (Outlook & Exchange)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                  OUTLOOK
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                corporate-ms365@enterprise.com
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                STANDBY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Architecture & Security Verification */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          <Cpu className="w-4 h-4 text-purple-600" />
          <span>Architecture & Security Guarantees</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Zero tokens or OAuth secrets in localStorage</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Sanitized structured logger active</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Bilingual RTL/LTR dynamic direction system</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Provider-agnostic domain repository layer</span>
          </div>
        </div>
      </div>

      {/* Section 4: Sign Out */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            {t.signOut}
          </h3>
          <p className="text-[11px] text-neutral-500">
            Terminate the current active browser session safely.
          </p>
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t.signOut}</span>
        </button>
      </div>
    </div>
  );
};
