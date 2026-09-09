/**
 * Business Communication OS - Google Contacts Adapter
 * Feature IDs: INT-004, CNT-001, CNT-002, CNT-003, CNT-004, CNT-005, CNT-006, CNT-007, CNT-008
 * 
 * Maps Google People API responses into universal Contact domain entities.
 * Supports read, search, create, update, and delete.
 */

import { Contact } from '../types/domain';
import { IContactAdapter } from './index';
import { getCachedAccessToken } from '../services/auth/firebaseAuth';
import { logger } from '../services/logger';

const log = logger.child('GoogleContactsAdapter');

export interface GooglePersonPayload {
  resourceName?: string;
  etag?: string;
  names?: Array<{
    displayName?: string;
    familyName?: string;
    givenName?: string;
  }>;
  emailAddresses?: Array<{
    value?: string;
    type?: string;
  }>;
  phoneNumbers?: Array<{
    value?: string;
    type?: string;
    canonicalForm?: string;
  }>;
  organizations?: Array<{
    name?: string;
    title?: string;
    department?: string;
  }>;
  photos?: Array<{
    url?: string;
  }>;
  userDefined?: Array<{
    key?: string;
    value?: string;
  }>;
}

export class GoogleContactsAdapter implements IContactAdapter {
  readonly provider = 'GOOGLE' as const;
  readonly name = 'Google People & Contacts';
  readonly supportedCapabilities = ['fetch_contacts', 'search_contacts', 'create_contact', 'update_contact', 'delete_contact'];

  private getAuthHeader(): string {
    const token = getCachedAccessToken();
    if (!token) {
      throw new Error('AUTH_TOKEN_MISSING: Google Workspace authorization required.');
    }
    return `Bearer ${token}`;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      Authorization: this.getAuthHeader(),
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const res = await fetch(`https://people.googleapis.com/v1/${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const err = await res.text().catch(() => '');
      log.error('Google People API error', { status: res.status, err });
      throw new Error(`PEOPLE_API_ERROR: HTTP ${res.status} - ${err}`);
    }

    if (res.status === 204) return {} as T;
    return await res.json() as T;
  }

  async initialize(): Promise<void> {}
  async testConnection(): Promise<boolean> {
    return !!getCachedAccessToken();
  }
  async disconnect(): Promise<void> {}

  async fetchContacts(params: { limit?: number; query?: string } = {}): Promise<Contact[]> {
    const limit = params.limit || 50;
    const personFields = 'names,emailAddresses,phoneNumbers,organizations,photos,userDefined';

    if (params.query && params.query.trim()) {
      const res = await this.request<{
        results?: Array<{ person: GooglePersonPayload }>;
      }>(`people:searchContacts?pageSize=${limit}&query=${encodeURIComponent(params.query)}&readMask=${personFields}`);

      if (!res.results) return [];
      return res.results.map(r => this.normalizeGooglePerson(r.person));
    }

    const res = await this.request<{
      connections?: GooglePersonPayload[];
      nextPageToken?: string;
      totalPeople?: number;
    }>(`people/me/connections?pageSize=${limit}&personFields=${personFields}&sortOrder=LAST_MODIFIED_DESCENDING`);

    if (!res.connections) return [];
    return res.connections.map(p => this.normalizeGooglePerson(p));
  }

  async syncContacts(): Promise<Contact[]> {
    return this.fetchContacts({ limit: 100 });
  }

  async createContact(contact: Partial<Contact>): Promise<Contact> {
    const payload: GooglePersonPayload = {
      names: [{
        givenName: contact.firstName || '',
        familyName: contact.lastName || '',
      }],
      emailAddresses: contact.email ? [{ value: contact.email, type: 'work' }] : [],
      phoneNumbers: contact.phone ? [{ value: contact.phone, type: 'work' }] : [],
      organizations: contact.company || contact.title ? [{
        name: contact.company || '',
        title: contact.title || '',
      }] : [],
    };

    const res = await this.request<GooglePersonPayload>('people:createContact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return this.normalizeGooglePerson(res);
  }

  async updateContact(resourceName: string, contact: Partial<Contact>, etag: string): Promise<Contact> {
    const payload: GooglePersonPayload = {
      etag,
      names: [{
        givenName: contact.firstName || '',
        familyName: contact.lastName || '',
      }],
      emailAddresses: contact.email ? [{ value: contact.email, type: 'work' }] : [],
      phoneNumbers: contact.phone ? [{ value: contact.phone, type: 'work' }] : [],
      organizations: contact.company || contact.title ? [{
        name: contact.company || '',
        title: contact.title || '',
      }] : [],
    };

    const res = await this.request<GooglePersonPayload>(`${resourceName}:updateContact?updatePersonFields=names,emailAddresses,phoneNumbers,organizations`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    return this.normalizeGooglePerson(res);
  }

  async deleteContact(resourceName: string): Promise<void> {
    await this.request(`${resourceName}:deleteContact`, {
      method: 'DELETE',
    });
  }

  private normalizeGooglePerson(p: GooglePersonPayload): Contact {
    const nameObj = p.names?.[0];
    const emailObj = p.emailAddresses?.[0];
    const phoneObj = p.phoneNumbers?.[0];
    const orgObj = p.organizations?.[0];
    const photoObj = p.photos?.[0];

    const givenName = nameObj?.givenName || '';
    const familyName = nameObj?.familyName || '';
    const displayName = nameObj?.displayName || `${givenName} ${familyName}`.trim() || 'Unnamed Contact';

    const id = p.resourceName ? p.resourceName.replace('people/', '') : `cnt-${Date.now()}`;

    return {
      id,
      userId: 'usr-default',
      firstName: givenName || displayName,
      lastName: familyName,
      email: emailObj?.value || '',
      phone: phoneObj?.canonicalForm || phoneObj?.value || '',
      company: orgObj?.name || '',
      title: orgObj?.title || '',
      avatarUrl: photoObj?.url,
      tags: ['Google Contacts', 'Directory'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
