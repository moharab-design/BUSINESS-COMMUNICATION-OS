/**
 * Business Communication OS - Mail Service Layer
 * Feature IDs: ACC-006, ACC-007, ACC-014, ACC-020, INT-002, MAIL-001 - MAIL-030, OFF-001, OFF-002, OFF-009, OFF-010
 * 
 * Provides unified, provider-agnostic access to mail data with:
 * - Real Gmail synchronization when authenticated
 * - Seamless fallback to domain cache / initial mock data when disconnected
 * - Optimistic updates with server error rollbacks
 * - Bulk actions (read/unread, archive, delete, star)
 * - Safe pagination and query filtering
 */

import { Message, Conversation, ConnectedAccount, AccountStatus } from '../../types/domain';
import { GmailProviderAdapter } from '../../adapters/GmailProviderAdapter';
import { INITIAL_MESSAGES, INITIAL_CONVERSATIONS, INITIAL_CONNECTED_ACCOUNTS } from '../../persistence/repositories';
import { getCachedAccessToken } from '../auth/firebaseAuth';
import { logger } from '../logger';

const log = logger.child('MailService');

export interface MailFilterOptions {
  folder: 'INBOX' | 'SENT' | 'DRAFTS' | 'STARRED' | 'SPAM' | 'TRASH' | 'ARCHIVE';
  query?: string;
  sender?: string;
  recipient?: string;
  subject?: string;
  dateRange?: { start?: string; end?: string };
  limit?: number;
  cursor?: string;
}

export class MailService {
  private static instance: MailService;
  private gmailAdapter: GmailProviderAdapter;
  private connectedAccounts: ConnectedAccount[] = [...INITIAL_CONNECTED_ACCOUNTS];
  private localMessages: Message[] = [...INITIAL_MESSAGES];
  private isSyncing = false;
  private syncError: string | null = null;
  private lastSyncedAt: string = new Date().toISOString();

  private constructor() {
    this.gmailAdapter = new GmailProviderAdapter(this.getDefaultAccount());
  }

  static getInstance(): MailService {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    return MailService.instance;
  }

  getDefaultAccount(): ConnectedAccount {
    const active = this.connectedAccounts.find(a => a.status === 'ACTIVE');
    return active || this.connectedAccounts[0];
  }

  getConnectedAccounts(): ConnectedAccount[] {
    return this.connectedAccounts;
  }

  updateAccountStatus(id: string, status: AccountStatus, errorMessage?: string): void {
    this.connectedAccounts = this.connectedAccounts.map(acc => {
      if (acc.id === id) {
        return {
          ...acc,
          status,
          errorMessage,
          updatedAt: new Date().toISOString(),
        };
      }
      return acc;
    });
  }

  getConnectionHealth(): {
    status: AccountStatus;
    lastSyncedAt: string;
    error: string | null;
    isLiveConnected: boolean;
  } {
    const hasToken = !!getCachedAccessToken();
    const adapterHealth = this.gmailAdapter.getHealth();
    return {
      status: hasToken ? adapterHealth.status : 'DISCONNECTED',
      lastSyncedAt: this.lastSyncedAt,
      error: this.syncError || adapterHealth.error || null,
      isLiveConnected: hasToken,
    };
  }

  /**
   * Fetch messages matching filter
   */
  async listMessages(options: MailFilterOptions): Promise<{
    messages: Message[];
    nextCursor?: string;
    fromProvider: boolean;
  }> {
    const token = getCachedAccessToken();

    // Construct server query if field-specific filters are provided
    const queryParts: string[] = [];
    if (options.query) queryParts.push(options.query);
    if (options.sender) queryParts.push(`from:${options.sender}`);
    if (options.recipient) queryParts.push(`to:${options.recipient}`);
    if (options.subject) queryParts.push(`subject:${options.subject}`);
    if (options.dateRange?.start) queryParts.push(`after:${options.dateRange.start}`);
    if (options.dateRange?.end) queryParts.push(`before:${options.dateRange.end}`);

    const effectiveQuery = queryParts.join(' ');

    if (token) {
      try {
        log.info('Fetching live messages from Gmail', { folder: options.folder, query: effectiveQuery });
        const result = await this.gmailAdapter.fetchMessages({
          folder: options.folder,
          query: effectiveQuery,
          limit: options.limit || 25,
          cursor: options.cursor,
        });

        this.syncError = null;
        this.lastSyncedAt = new Date().toISOString();

        // Update local memory cache without overriding user-created unsent drafts
        if (!options.cursor && result.messages.length > 0) {
          const fetchedIds = new Set(result.messages.map(m => m.id));
          this.localMessages = [
            ...result.messages,
            ...this.localMessages.filter(m => !fetchedIds.has(m.id)),
          ];
        }

        return {
          messages: result.messages,
          nextCursor: result.nextCursor,
          fromProvider: true,
        };
      } catch (err) {
        log.warn('Failed to fetch from Gmail directly, falling back to cached store', err);
        this.syncError = err instanceof Error ? err.message : 'Sync failed';
      }
    }

    // Fallback / disconnected client-side store filter
    let filtered = [...this.localMessages];

    // Filter by folder
    if (options.folder === 'INBOX') {
      filtered = filtered.filter(m => m.labels.includes('INBOX') && !m.labels.includes('TRASH') && !m.labels.includes('SPAM'));
    } else if (options.folder === 'STARRED') {
      filtered = filtered.filter(m => m.isFlagged);
    } else if (options.folder === 'SENT') {
      filtered = filtered.filter(m => m.labels.includes('SENT'));
    } else if (options.folder === 'DRAFTS') {
      filtered = filtered.filter(m => m.labels.includes('DRAFT'));
    } else if (options.folder === 'TRASH') {
      filtered = filtered.filter(m => m.labels.includes('TRASH'));
    } else if (options.folder === 'SPAM') {
      filtered = filtered.filter(m => m.labels.includes('SPAM'));
    } else if (options.folder === 'ARCHIVE') {
      filtered = filtered.filter(m => !m.labels.includes('INBOX') && !m.labels.includes('TRASH'));
    }

    // Free text & field search
    if (effectiveQuery.trim()) {
      const q = effectiveQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.subject.toLowerCase().includes(q) ||
        m.bodyText.toLowerCase().includes(q) ||
        m.from.name.toLowerCase().includes(q) ||
        (m.from.email && m.from.email.toLowerCase().includes(q))
      );
    }

    return {
      messages: filtered,
      nextCursor: undefined,
      fromProvider: false,
    };
  }

  /**
   * Fetch complete conversation thread
   */
  async getConversation(threadId: string): Promise<Conversation | null> {
    const token = getCachedAccessToken();
    if (token) {
      try {
        return await this.gmailAdapter.fetchConversation(threadId);
      } catch (err) {
        log.warn('Could not fetch conversation from Gmail, resolving locally', err);
      }
    }

    // Local resolution
    const localThread = INITIAL_CONVERSATIONS.find(c => c.id === threadId || c.externalThreadId === threadId);
    if (localThread) return localThread;

    const threadMessages = this.localMessages.filter(m => m.conversationId === threadId);
    if (threadMessages.length > 0) {
      const latest = threadMessages[threadMessages.length - 1];
      return {
        id: threadId,
        provider: 'GOOGLE',
        accountId: latest.accountId,
        subject: latest.subject,
        snippet: latest.snippet,
        participants: threadMessages.map(m => m.from),
        messageCount: threadMessages.length,
        unreadCount: threadMessages.filter(m => !m.isRead).length,
        lastMessageAt: latest.sentAt,
        labels: Array.from(new Set(threadMessages.flatMap(m => m.labels))),
        isFlagged: threadMessages.some(m => m.isFlagged),
        createdAt: threadMessages[0].sentAt,
        updatedAt: latest.sentAt,
      };
    }

    return null;
  }

  /**
   * Mark read/unread with optimistic update
   */
  async markAsRead(messageId: string, isRead: boolean): Promise<void> {
    const prev = this.localMessages.find(m => m.id === messageId);
    // Optimistic
    this.localMessages = this.localMessages.map(m =>
      m.id === messageId ? { ...m, isRead } : m
    );

    const token = getCachedAccessToken();
    if (token) {
      try {
        await this.gmailAdapter.markAsRead(messageId, isRead);
      } catch (err) {
        // Rollback on failure
        if (prev) {
          this.localMessages = this.localMessages.map(m =>
            m.id === messageId ? prev : m
          );
        }
        throw err;
      }
    }
  }

  /**
   * Flag / Star message with optimistic update
   */
  async flagMessage(messageId: string, isFlagged: boolean): Promise<void> {
    const prev = this.localMessages.find(m => m.id === messageId);
    this.localMessages = this.localMessages.map(m =>
      m.id === messageId ? { ...m, isFlagged } : m
    );

    const token = getCachedAccessToken();
    if (token) {
      try {
        await this.gmailAdapter.flagMessage(messageId, isFlagged);
      } catch (err) {
        if (prev) {
          this.localMessages = this.localMessages.map(m =>
            m.id === messageId ? prev : m
          );
        }
        throw err;
      }
    }
  }

  /**
   * Archive message
   */
  async archiveMessage(messageId: string): Promise<void> {
    this.localMessages = this.localMessages.map(m => {
      if (m.id === messageId) {
        return {
          ...m,
          labels: m.labels.filter(l => l !== 'INBOX'),
        };
      }
      return m;
    });

    const token = getCachedAccessToken();
    if (token) {
      await this.gmailAdapter.archiveMessage(messageId);
    }
  }

  /**
   * Delete message / Move to Trash
   */
  async deleteMessage(messageId: string): Promise<void> {
    this.localMessages = this.localMessages.map(m => {
      if (m.id === messageId) {
        return {
          ...m,
          labels: [...m.labels.filter(l => l !== 'INBOX'), 'TRASH'],
        };
      }
      return m;
    });

    const token = getCachedAccessToken();
    if (token) {
      await this.gmailAdapter.deleteMessage(messageId);
    }
  }

  /**
   * Bulk actions (MAIL-026)
   */
  async executeBulkAction(
    action: 'MARK_READ' | 'MARK_UNREAD' | 'STAR' | 'UNSTAR' | 'ARCHIVE' | 'DELETE',
    ids: string[]
  ): Promise<void> {
    if (ids.length === 0) return;

    // Optimistic local update
    const idSet = new Set(ids);
    this.localMessages = this.localMessages.map(m => {
      if (!idSet.has(m.id)) return m;
      switch (action) {
        case 'MARK_READ':
          return { ...m, isRead: true };
        case 'MARK_UNREAD':
          return { ...m, isRead: false };
        case 'STAR':
          return { ...m, isFlagged: true };
        case 'UNSTAR':
          return { ...m, isFlagged: false };
        case 'ARCHIVE':
          return { ...m, labels: m.labels.filter(l => l !== 'INBOX') };
        case 'DELETE':
          return { ...m, labels: [...m.labels.filter(l => l !== 'INBOX'), 'TRASH'] };
        default:
          return m;
      }
    });

    const token = getCachedAccessToken();
    if (token) {
      let addLabels: string[] = [];
      let removeLabels: string[] = [];

      switch (action) {
        case 'MARK_READ':
          removeLabels = ['UNREAD'];
          break;
        case 'MARK_UNREAD':
          addLabels = ['UNREAD'];
          break;
        case 'STAR':
          addLabels = ['STARRED'];
          break;
        case 'UNSTAR':
          removeLabels = ['STARRED'];
          break;
        case 'ARCHIVE':
          removeLabels = ['INBOX'];
          break;
        case 'DELETE':
          addLabels = ['TRASH'];
          removeLabels = ['INBOX'];
          break;
      }

      await this.gmailAdapter.batchModify(ids, addLabels, removeLabels);
    }
  }

  /**
   * Send Email
   */
  async sendMessage(draft: Partial<Message>): Promise<Message> {
    const token = getCachedAccessToken();
    if (token) {
      const sent = await this.gmailAdapter.sendMessage(draft);
      this.localMessages = [sent, ...this.localMessages];
      return sent;
    }

    // Disconnected local simulation
    const sentMessage: Message = {
      id: `msg-${Date.now()}`,
      provider: 'GOOGLE',
      accountId: this.getDefaultAccount().id,
      conversationId: draft.conversationId || `conv-${Date.now()}`,
      subject: draft.subject || '(No Subject)',
      bodyText: draft.bodyText || '',
      bodyHtml: draft.bodyHtml,
      snippet: draft.bodyText?.slice(0, 80) || '',
      from: draft.from || { name: 'Current User', email: this.getDefaultAccount().accountEmail },
      to: draft.to || [],
      cc: draft.cc,
      bcc: draft.bcc,
      sentAt: new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      isRead: true,
      isFlagged: false,
      importance: 'NORMAL',
      labels: ['SENT'],
      attachments: draft.attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.localMessages = [sentMessage, ...this.localMessages];
    return sentMessage;
  }

  /**
   * Save / Autosave Draft (COMP-020, MAIL-004)
   */
  async saveDraft(draft: Partial<Message>): Promise<Message> {
    const token = getCachedAccessToken();
    if (token) {
      try {
        return await this.gmailAdapter.createDraft(draft);
      } catch (err) {
        log.warn('Could not save draft to Gmail, storing in local session cache', err);
      }
    }

    const draftMessage: Message = {
      id: draft.id || `draft-${Date.now()}`,
      provider: 'GOOGLE',
      accountId: this.getDefaultAccount().id,
      conversationId: draft.conversationId || `conv-draft-${Date.now()}`,
      subject: draft.subject || '(Draft No Subject)',
      bodyText: draft.bodyText || '',
      bodyHtml: draft.bodyHtml,
      snippet: draft.bodyText?.slice(0, 60) || '',
      from: draft.from || { name: 'Me', email: this.getDefaultAccount().accountEmail },
      to: draft.to || [],
      cc: draft.cc,
      bcc: draft.bcc,
      sentAt: new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      isRead: true,
      isFlagged: false,
      importance: 'NORMAL',
      labels: ['DRAFT'],
      attachments: draft.attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingIdx = this.localMessages.findIndex(m => m.id === draftMessage.id);
    if (existingIdx >= 0) {
      this.localMessages[existingIdx] = draftMessage;
    } else {
      this.localMessages = [draftMessage, ...this.localMessages];
    }

    return draftMessage;
  }

  /**
   * Retry failed sync / manual refresh
   */
  async syncMailbox(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;
    try {
      const token = getCachedAccessToken();
      if (!token) {
        throw new Error('Please sign in with Google Workspace to sync live Gmail.');
      }
      const syncResult = await this.gmailAdapter.incrementalSync();
      const newIds = new Set(syncResult.addedOrUpdated.map(m => m.id));
      const deletedIds = new Set(syncResult.deletedMessageIds);

      this.localMessages = [
        ...syncResult.addedOrUpdated,
        ...this.localMessages.filter(m => !newIds.has(m.id) && !deletedIds.has(m.id)),
      ];

      this.lastSyncedAt = new Date().toISOString();
      this.syncError = null;
      this.updateAccountStatus(this.getDefaultAccount().id, 'ACTIVE');
    } catch (err) {
      this.syncError = err instanceof Error ? err.message : 'Sync failed';
      this.updateAccountStatus(this.getDefaultAccount().id, 'ERROR', this.syncError);
      throw err;
    } finally {
      this.isSyncing = false;
    }
  }
}

export const mailService = MailService.getInstance();
