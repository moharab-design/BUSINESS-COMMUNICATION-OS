/**
 * Business Communication OS - Unified Contacts & Stakeholders View
 * Feature IDs: SYS-002, UI-001, UI-016, INT-004, CNT-001, CNT-002, CNT-003, CNT-004, CNT-005, CNT-006, CNT-007, CNT-008
 * 
 * Provides:
 * - Live synchronization with Google People API (Google Contacts)
 * - Provider-agnostic domain entity translation
 * - Search by name, email, phone, company, and tags
 * - Quick contact composition trigger (opens email composer prefilled)
 * - Add new contact modal with validation
 * - Connection health status
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  Building, 
  Plus, 
  Tag, 
  Search, 
  RefreshCw, 
  Send, 
  Trash2,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../services/auth/AuthContext';
import { contactsService } from '../services/contacts/contactsService';
import { Contact } from '../types/domain';
import { EmailComposer } from '../components/mail/EmailComposer';

export const ContactsView: React.FC = () => {
  const { t } = useLanguage();
  const { hasWorkspaceToken, signInWithGoogle } = useAuth();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [fromGoogle, setFromGoogle] = useState(false);

  // Add Contact Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  // Direct Email Composition
  const [composerRecipient, setComposerRecipient] = useState<string | null>(null);

  const loadContacts = async (query?: string) => {
    setIsLoading(true);
    try {
      const res = await contactsService.listContacts(query);
      setContacts(res.contacts);
      setFromGoogle(res.fromGoogle);
    } catch (err) {
      console.error('Failed to load contacts', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts(searchQuery);
  }, [hasWorkspaceToken]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadContacts(searchQuery);
  };

  const handleSyncGoogle = async () => {
    setIsSyncing(true);
    try {
      if (!hasWorkspaceToken) {
        await signInWithGoogle();
      }
      await loadContacts(searchQuery);
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;

    try {
      await contactsService.createContact({
        firstName,
        lastName,
        email,
        phone,
        company,
        title,
        notes,
      });

      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setTitle('');
      setNotes('');
      setShowAddModal(false);

      await loadContacts(searchQuery);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create contact');
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to remove this contact?')) return;
    try {
      await contactsService.deleteContact(id);
      await loadContacts(searchQuery);
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div id="view-contacts" className="space-y-6">
      <PageHeader
        id="contacts-header"
        title={t.contactsTitle}
        description="Unified contact directory synchronizing enterprise stakeholders, partners, and clients with Google People API integration."
        action={
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSyncGoogle}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Contacts'}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.contactsNewContact}</span>
            </button>
          </div>
        }
      />

      {/* Search & Provider Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute inset-y-0 start-3 my-auto text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts by name, email, or company..."
            className="w-full h-9 ps-9 pe-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900 outline-hidden"
          />
        </form>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
            fromGoogle 
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
              : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${fromGoogle ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
            {fromGoogle ? 'Google Contacts Connected' : 'Local Directory Store'}
          </span>
        </div>
      </div>

      {/* Contact Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400" />
          <p className="text-xs text-neutral-500">Loading contacts directory...</p>
        </div>
      ) : contacts.length === 0 ? (
        <EmptyState
          icon={Users}
          title={t.contactsNoContacts}
          description={t.contactsNoContactsDesc}
          actionLabel={t.contactsNewContact}
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-3 relative group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center font-bold text-sm shrink-0">
                    {c.firstName.charAt(0)}{c.lastName?.charAt(0) || ''}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      {c.firstName} {c.lastName}
                    </h3>
                    {c.title && (
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate flex items-center gap-1">
                        <Briefcase className="w-3 h-3 shrink-0" />
                        <span>{c.title}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Fast Action Buttons */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {c.email && (
                    <button
                      onClick={() => setComposerRecipient(c.email)}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer"
                      title={`Send email to ${c.firstName}`}
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteContact(c.id)}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-red-500 cursor-pointer"
                    title="Remove Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300 pt-1">
                {c.company && (
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{c.company}</span>
                  </div>
                )}
                {c.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate font-mono text-[11px]">{c.email}</span>
                  </div>
                )}
                {c.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate font-mono text-[11px]">{c.phone}</span>
                  </div>
                )}
              </div>

              {c.tags && c.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  {c.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[10px] font-medium rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              {t.contactsNewContact}
            </h3>
            <form onSubmit={handleCreateContact} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg shadow-xs cursor-pointer"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Composer triggered directly from Contact card */}
      <EmailComposer
        isOpen={!!composerRecipient}
        onClose={() => setComposerRecipient(null)}
        initialRecipient={composerRecipient || ''}
      />
    </div>
  );
};
