/**
 * Business Communication OS - Contacts Service Layer
 * Feature IDs: INT-004, CNT-001, CNT-002, CNT-003, CNT-004, CNT-005, CNT-006, CNT-007, CNT-008
 * 
 * Provides unified, provider-agnostic access to Contacts with:
 * - Live Google People API synchronization when connected
 * - Local repository persistence when offline or disconnected
 * - Contact creation, editing, and deletion
 * - Field mapping for emails, phone numbers, companies, and job titles
 */

import { Contact } from '../../types/domain';
import { GoogleContactsAdapter } from '../../adapters/GoogleContactsAdapter';
import { INITIAL_CONTACTS } from '../../persistence/repositories';
import { getCachedAccessToken } from '../auth/firebaseAuth';
import { logger } from '../logger';

const log = logger.child('ContactsService');

export class ContactsService {
  private static instance: ContactsService;
  private contactsAdapter: GoogleContactsAdapter;
  private localContacts: Contact[] = [...INITIAL_CONTACTS];
  private isSyncing = false;
  private syncError: string | null = null;
  private lastSyncedAt: string = new Date().toISOString();

  private constructor() {
    this.contactsAdapter = new GoogleContactsAdapter();
  }

  static getInstance(): ContactsService {
    if (!ContactsService.instance) {
      ContactsService.instance = new ContactsService();
    }
    return ContactsService.instance;
  }

  async listContacts(query?: string): Promise<{ contacts: Contact[]; fromGoogle: boolean }> {
    const token = getCachedAccessToken();

    if (token) {
      try {
        log.info('Fetching live contacts from Google People API', { query });
        const googleContacts = await this.contactsAdapter.fetchContacts({ query, limit: 100 });
        this.lastSyncedAt = new Date().toISOString();
        this.syncError = null;

        if (googleContacts.length > 0) {
          const fetchedIds = new Set(googleContacts.map(c => c.id));
          this.localContacts = [
            ...googleContacts,
            ...this.localContacts.filter(c => !fetchedIds.has(c.id)),
          ];
          return { contacts: googleContacts, fromGoogle: true };
        }
      } catch (err) {
        log.warn('Google People API failed, falling back to local store', err);
        this.syncError = err instanceof Error ? err.message : 'Contacts sync error';
      }
    }

    // Local filter
    let results = [...this.localContacts];
    if (query && query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company && c.company.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q))
      );
    }

    return { contacts: results, fromGoogle: false };
  }

  async createContact(contactData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    title?: string;
    notes?: string;
  }): Promise<Contact> {
    const token = getCachedAccessToken();
    if (token) {
      try {
        const created = await this.contactsAdapter.createContact(contactData);
        this.localContacts = [created, ...this.localContacts];
        return created;
      } catch (err) {
        log.warn('Failed to create in Google Contacts directly', err);
      }
    }

    const newLocal: Contact = {
      id: `cnt-${Date.now()}`,
      userId: 'usr-default',
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email,
      phone: contactData.phone,
      company: contactData.company,
      title: contactData.title,
      notes: contactData.notes,
      tags: ['Manual', 'Directory'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.localContacts = [newLocal, ...this.localContacts];
    return newLocal;
  }

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    const current = this.localContacts.find(c => c.id === id);
    if (!current) throw new Error('Contact not found');

    const updated: Contact = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.localContacts = this.localContacts.map(c => c.id === id ? updated : c);

    const token = getCachedAccessToken();
    if (token && id.startsWith('c')) {
      try {
        await this.contactsAdapter.updateContact(`people/${id}`, updates, '*');
      } catch (err) {
        log.warn('Failed to update Google Contact directly', err);
      }
    }

    return updated;
  }

  async deleteContact(id: string): Promise<void> {
    this.localContacts = this.localContacts.filter(c => c.id !== id);

    const token = getCachedAccessToken();
    if (token && id.startsWith('c')) {
      try {
        await this.contactsAdapter.deleteContact(`people/${id}`);
      } catch (err) {
        log.warn('Failed to delete Google Contact directly', err);
      }
    }
  }

  getHealth() {
    return {
      lastSyncedAt: this.lastSyncedAt,
      syncError: this.syncError,
      isLive: !!getCachedAccessToken(),
    };
  }
}

export const contactsService = ContactsService.getInstance();
