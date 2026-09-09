/**
 * Business Communication OS - Core Domain Entities
 * Feature IDs: SYS-001, SYS-002, SYS-003, SYS-004, SYS-005, SYS-006, SYS-019, SYS-022
 * 
 * Provider-Agnostic Core Domain Models
 * Designed to cleanly abstract Gmail, Microsoft 365, WhatsApp Business, and custom IMAP/SMTP providers.
 */

export type ProviderType = 'GOOGLE' | 'MICROSOFT' | 'IMAP' | 'WHATSAPP_BUSINESS' | 'OTHER';

export type AccountStatus = 'ACTIVE' | 'DISCONNECTED' | 'SYNCING' | 'ERROR' | 'NEEDS_REAUTH';

export type MessageImportance = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskSourceType = 'MANUAL' | 'EMAIL' | 'WHATSAPP' | 'CALENDAR' | 'AI';

export type ScheduleActionType = 
  | 'EMAIL_SEND' 
  | 'REMINDER' 
  | 'TASK' 
  | 'FOLLOW_UP' 
  | 'WHATSAPP_SEND' 
  | 'WORKFLOW';

export type ScheduleStatus = 'PENDING' | 'EXECUTED' | 'CANCELLED' | 'FAILED';
export type ScheduleRecurrence = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

/**
 * Synchronization Metadata
 * Decouples external provider sync state from core business records
 */
export interface SyncMetadata {
  providerExternalId: string;
  lastSyncedAt: string;
  syncState: 'IN_SYNC' | 'PENDING' | 'CONFLICT' | 'ERROR';
  syncCursor?: string;
  checksum?: string;
}

/**
 * User Profile & Preferences Entity (SYS-001, ACC-001, UI-009)
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  profileImage?: string;
  preferredLanguage: 'en' | 'ar';
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Connected Provider Account (SEC-001, SYS-022)
 * Strictly stores provider identity without exposing secrets client-side.
 */
export interface ConnectedAccount {
  id: string;
  userId: string;
  provider: ProviderType;
  accountEmail: string;
  displayName?: string;
  status: AccountStatus;
  scopes: string[];
  syncEnabled: boolean;
  lastSyncedAt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Participant in Conversations & Messages
 */
export interface Participant {
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  role?: 'FROM' | 'TO' | 'CC' | 'BCC' | 'ORGANIZER' | 'ATTENDEE';
}

/**
 * Attachment Metadata (SYS-019)
 */
export interface Attachment {
  id: string;
  messageId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  url?: string;
  isInline: boolean;
  contentId?: string;
  createdAt: string;
}

/**
 * Unified Message Entity (SYS-003)
 * Provider-agnostic representation of emails, WhatsApp messages, and internal notes.
 */
export interface Message {
  id: string;
  externalId?: string;
  provider: ProviderType;
  accountId: string;
  conversationId: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
  snippet: string;
  from: Participant;
  to: Participant[];
  cc?: Participant[];
  bcc?: Participant[];
  sentAt: string;
  receivedAt: string;
  isRead: boolean;
  isFlagged: boolean;
  importance: MessageImportance;
  labels: string[];
  attachments: Attachment[];
  syncMetadata?: SyncMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * Conversation / Thread Entity (SYS-003)
 */
export interface Conversation {
  id: string;
  provider: ProviderType;
  accountId: string;
  externalThreadId?: string;
  subject: string;
  snippet: string;
  participants: Participant[];
  messageCount: number;
  unreadCount: number;
  lastMessageAt: string;
  labels: string[];
  isFlagged: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Unified Contact Entity (SYS-002)
 */
export interface Contact {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  avatarUrl?: string;
  tags: string[];
  notes?: string;
  lastInteractionAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Company / Organization Entity
 */
export interface Company {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Unified Calendar Event Entity (SYS-005)
 */
export interface CalendarEvent {
  id: string;
  externalId?: string;
  provider: ProviderType;
  accountId: string;
  title: string;
  description?: string;
  location?: string;
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
  isAllDay: boolean;
  status: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
  attendees: Participant[];
  organizer: Participant;
  recurrenceRule?: string;
  conferenceUrl?: string;
  syncMetadata?: SyncMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * Unified Task Entity (SYS-004)
 */
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  completedAt?: string;
  sourceType: TaskSourceType;
  sourceId?: string;
  sourceUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Unified Scheduled Action Entity (SYS-006)
 */
export interface Schedule {
  id: string;
  userId: string;
  title: string;
  actionType: ScheduleActionType;
  payload: Record<string, unknown>;
  scheduledAt: string;
  executedAt?: string;
  status: ScheduleStatus;
  recurrence: ScheduleRecurrence;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * In-App Notification Entity
 */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAt: string;
}
