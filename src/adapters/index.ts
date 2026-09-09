/**
 * Business Communication OS - Integration Adapter Architecture
 * Feature ID: SYS-022
 * 
 * Defines provider-agnostic adapter interfaces.
 * Core domain objects never depend directly on vendor-specific payloads.
 * Vendor adapters translate foreign models into normalized domain models.
 */

import { 
  Message, 
  Conversation, 
  CalendarEvent, 
  Contact, 
  ProviderType, 
  ConnectedAccount 
} from '../types/domain';

export interface IIntegrationAdapter {
  readonly provider: ProviderType;
  readonly name: string;
  readonly supportedCapabilities: string[];

  initialize(account: ConnectedAccount): Promise<void>;
  testConnection(): Promise<boolean>;
  disconnect(): Promise<void>;
}

export interface IMailAdapter extends IIntegrationAdapter {
  fetchMessages(params?: { folder?: string; query?: string; limit?: number; cursor?: string }): Promise<{
    messages: Message[];
    nextCursor?: string;
  }>;
  fetchConversation(conversationId: string): Promise<Conversation>;
  sendMessage(draft: Partial<Message>): Promise<Message>;
  markAsRead(messageId: string, isRead: boolean): Promise<void>;
  flagMessage(messageId: string, isFlagged: boolean): Promise<void>;
  archiveMessage(messageId: string): Promise<void>;
}

export interface ICalendarAdapter extends IIntegrationAdapter {
  fetchEvents(params: { timeMin: string; timeMax: string }): Promise<CalendarEvent[]>;
  createEvent(event: Partial<CalendarEvent>): Promise<CalendarEvent>;
  updateEvent(eventId: string, patch: Partial<CalendarEvent>): Promise<CalendarEvent>;
  deleteEvent(eventId: string): Promise<void>;
}

export interface IContactAdapter extends IIntegrationAdapter {
  fetchContacts(params?: { limit?: number; query?: string }): Promise<Contact[]>;
  syncContacts(): Promise<Contact[]>;
}

/**
 * Gmail Adapter Implementation (Google Workspace Foundation)
 */
export class GmailAdapter implements IMailAdapter {
  readonly provider: ProviderType = 'GOOGLE';
  readonly name = 'Google Workspace (Gmail)';
  readonly supportedCapabilities = ['fetch_messages', 'send_message', 'threads', 'labels', 'attachments'];
  private account?: ConnectedAccount;

  async initialize(account: ConnectedAccount): Promise<void> {
    this.account = account;
  }

  async testConnection(): Promise<boolean> {
    return this.account?.status === 'ACTIVE';
  }

  async disconnect(): Promise<void> {
    if (this.account) {
      this.account.status = 'DISCONNECTED';
    }
  }

  async fetchMessages(params?: { folder?: string; query?: string; limit?: number }): Promise<{
    messages: Message[];
    nextCursor?: string;
  }> {
    // Normalizes external Gmail message format into universal Message model
    return {
      messages: [],
      nextCursor: undefined,
    };
  }

  async fetchConversation(conversationId: string): Promise<Conversation> {
    throw new Error('Not implemented directly on client. Calls server adapter proxy.');
  }

  async sendMessage(draft: Partial<Message>): Promise<Message> {
    throw new Error('Not implemented directly on client. Calls server adapter proxy.');
  }

  async markAsRead(messageId: string, isRead: boolean): Promise<void> {
    // Adapter calls server proxy
  }

  async flagMessage(messageId: string, isFlagged: boolean): Promise<void> {
    // Adapter calls server proxy
  }

  async archiveMessage(messageId: string): Promise<void> {
    // Adapter calls server proxy
  }
}

/**
 * Microsoft 365 Adapter Stub (Future Extension Point)
 */
export class Microsoft365AdapterStub implements IMailAdapter, ICalendarAdapter {
  readonly provider: ProviderType = 'MICROSOFT';
  readonly name = 'Microsoft 365 (Outlook / Graph)';
  readonly supportedCapabilities = ['fetch_messages', 'send_message', 'calendar_events'];

  async initialize(): Promise<void> {
    throw new Error('Microsoft 365 adapter planned for subsequent phase.');
  }
  async testConnection(): Promise<boolean> { return false; }
  async disconnect(): Promise<void> {}
  async fetchMessages(): Promise<{ messages: Message[] }> { return { messages: [] }; }
  async fetchConversation(): Promise<Conversation> { throw new Error('Future module'); }
  async sendMessage(): Promise<Message> { throw new Error('Future module'); }
  async markAsRead(): Promise<void> {}
  async flagMessage(): Promise<void> {}
  async archiveMessage(): Promise<void> {}
  async fetchEvents(): Promise<CalendarEvent[]> { return []; }
  async createEvent(): Promise<CalendarEvent> { throw new Error('Future module'); }
  async updateEvent(): Promise<CalendarEvent> { throw new Error('Future module'); }
  async deleteEvent(): Promise<void> {}
}

/**
 * WhatsApp Business Adapter Stub (Future Extension Point)
 */
export class WhatsAppBusinessAdapterStub implements IIntegrationAdapter {
  readonly provider: ProviderType = 'WHATSAPP_BUSINESS';
  readonly name = 'WhatsApp Business Cloud API';
  readonly supportedCapabilities = ['direct_messages', 'templates', 'media_attachments'];

  async initialize(): Promise<void> {
    throw new Error('WhatsApp Business adapter planned for subsequent phase.');
  }
  async testConnection(): Promise<boolean> { return false; }
  async disconnect(): Promise<void> {}
}

/**
 * Adapter Registry & Factory
 */
export class AdapterRegistry {
  private static adapters: Map<ProviderType, IIntegrationAdapter> = new Map();

  static register(adapter: IIntegrationAdapter): void {
    this.adapters.set(adapter.provider, adapter);
  }

  static get(provider: ProviderType): IIntegrationAdapter | undefined {
    return this.adapters.get(provider);
  }
}

export { GmailProviderAdapter } from './GmailProviderAdapter';
export { GoogleContactsAdapter } from './GoogleContactsAdapter';
import { GmailProviderAdapter } from './GmailProviderAdapter';
import { GoogleContactsAdapter } from './GoogleContactsAdapter';

// Register default foundation adapters
AdapterRegistry.register(new GmailProviderAdapter());
AdapterRegistry.register(new Microsoft365AdapterStub());
AdapterRegistry.register(new WhatsAppBusinessAdapterStub());

