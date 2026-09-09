/**
 * Business Communication OS - Persistence & Repositories Foundation
 * Feature IDs: SYS-001, SYS-002, SYS-003, SYS-004, SYS-005, SYS-006, SYS-019
 * 
 * Generic repository interfaces and client-side data store.
 * Supports synchronization with server endpoints and Firestore backend.
 */

import { 
  User, 
  ConnectedAccount, 
  Message, 
  Conversation, 
  CalendarEvent, 
  Task, 
  Schedule, 
  Contact, 
  Notification 
} from '../types/domain';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  updateProfile(id: string, patch: Partial<User>): Promise<User>;
}

export interface IMessageRepository {
  listMessages(userId: string, folder?: string): Promise<Message[]>;
  getMessage(id: string): Promise<Message | null>;
  listConversations(userId: string): Promise<Conversation[]>;
  saveMessage(message: Message): Promise<Message>;
  markRead(id: string, isRead: boolean): Promise<void>;
}

export interface ICalendarRepository {
  listEvents(userId: string, range?: { start: string; end: string }): Promise<CalendarEvent[]>;
  saveEvent(event: CalendarEvent): Promise<CalendarEvent>;
  deleteEvent(id: string): Promise<void>;
}

export interface ITaskRepository {
  listTasks(userId: string): Promise<Task[]>;
  saveTask(task: Task): Promise<Task>;
  updateTaskStatus(id: string, status: Task['status']): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}

export interface IScheduleRepository {
  listSchedules(userId: string): Promise<Schedule[]>;
  saveSchedule(schedule: Schedule): Promise<Schedule>;
  cancelSchedule(id: string): Promise<void>;
}

export interface IContactRepository {
  listContacts(userId: string): Promise<Contact[]>;
  saveContact(contact: Contact): Promise<Contact>;
  deleteContact(id: string): Promise<void>;
}

// Initial realistic business seed data for preview & development
export const INITIAL_CONNECTED_ACCOUNTS: ConnectedAccount[] = [
  {
    id: 'acc-google-01',
    userId: 'usr-default',
    provider: 'GOOGLE',
    accountEmail: 'executive@enterprise.com',
    displayName: 'Google Workspace Primary',
    status: 'ACTIVE',
    scopes: ['https://mail.google.com/', 'https://www.googleapis.com/auth/calendar'],
    syncEnabled: true,
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc-msft-01',
    userId: 'usr-default',
    provider: 'MICROSOFT',
    accountEmail: 'corp.operations@msftcloud.com',
    displayName: 'Microsoft 365 Operations',
    status: 'DISCONNECTED',
    scopes: ['Mail.ReadWrite', 'Calendars.Read'],
    syncEnabled: false,
    errorMessage: 'Awaiting Phase 2 enterprise OAuth credentials.',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc-wa-01',
    userId: 'usr-default',
    provider: 'WHATSAPP_BUSINESS',
    accountEmail: '+966 50 000 1234',
    displayName: 'WhatsApp Business Support Line',
    status: 'DISCONNECTED',
    scopes: ['whatsapp_business_messaging'],
    syncEnabled: false,
    errorMessage: 'Awaiting Phase 2 Meta Cloud API webhook configuration.',
    createdAt: '2026-03-01T12:00:00Z',
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-001',
    externalId: 'gm-189f3a92bc',
    provider: 'GOOGLE',
    accountId: 'acc-google-01',
    conversationId: 'conv-001',
    subject: 'Q3 Enterprise Architecture Review & SLA Alignment',
    bodyText: 'Dear Leadership Team,\n\nFollowing our infrastructure audit, please find the updated service level objectives and architecture proposals for review before Thursday\'s executive committee meeting.\n\nBest regards,\nTariq Al-Mansoor\nPrincipal Systems Architect',
    snippet: 'Following our infrastructure audit, please find the updated service level objectives...',
    from: { name: 'Tariq Al-Mansoor', email: 'tariq.mansoor@techfirm.com' },
    to: [{ name: 'Executive Team', email: 'executive@enterprise.com' }],
    sentAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    receivedAt: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
    isRead: false,
    isFlagged: true,
    importance: 'HIGH',
    labels: ['INBOX', 'IMPORTANT', 'ARCHITECTURE'],
    attachments: [
      {
        id: 'att-001',
        messageId: 'msg-001',
        filename: 'Architecture_Blueprint_Q3.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 2450000,
        isInline: false,
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'msg-002',
    externalId: 'gm-189f328a11',
    provider: 'GOOGLE',
    accountId: 'acc-google-01',
    conversationId: 'conv-002',
    subject: 'Contract Renewal: Western Region Telecom Partnership',
    bodyText: 'Hi team, the draft addendum for the telecom distribution license is attached. Please review sections 4.2 and 5.1 regarding bilateral SLA commitments.\n\nRegards,\nLayla Al-Harbi',
    snippet: 'The draft addendum for the telecom distribution license is attached...',
    from: { name: 'Layla Al-Harbi', email: 'layla.harbi@westerntelecom.sa' },
    to: [{ name: 'Executive Team', email: 'executive@enterprise.com' }],
    sentAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    receivedAt: new Date(Date.now() - 1000 * 60 * 179).toISOString(),
    isRead: true,
    isFlagged: false,
    importance: 'NORMAL',
    labels: ['INBOX', 'CONTRACTS'],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    provider: 'GOOGLE',
    accountId: 'acc-google-01',
    externalThreadId: 'th-001',
    subject: 'Q3 Enterprise Architecture Review & SLA Alignment',
    snippet: 'Following our infrastructure audit, please find the updated service level objectives...',
    participants: [
      { name: 'Tariq Al-Mansoor', email: 'tariq.mansoor@techfirm.com' },
      { name: 'Executive Team', email: 'executive@enterprise.com' }
    ],
    messageCount: 3,
    unreadCount: 1,
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    labels: ['INBOX', 'IMPORTANT'],
    isFlagged: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'conv-002',
    provider: 'GOOGLE',
    accountId: 'acc-google-01',
    externalThreadId: 'th-002',
    subject: 'Contract Renewal: Western Region Telecom Partnership',
    snippet: 'The draft addendum for the telecom distribution license is attached...',
    participants: [
      { name: 'Layla Al-Harbi', email: 'layla.harbi@westerntelecom.sa' },
      { name: 'Executive Team', email: 'executive@enterprise.com' }
    ],
    messageCount: 2,
    unreadCount: 0,
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    labels: ['INBOX'],
    isFlagged: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-001',
    externalId: 'gcal-9821387',
    provider: 'GOOGLE',
    accountId: 'acc-google-01',
    title: 'Executive Committee: Architecture & Security Sign-off',
    description: 'Quarterly review of enterprise infrastructure roadmap and compliance.',
    location: 'Conference Room 4B / Google Meet',
    startTime: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 150).toISOString(),
    isAllDay: false,
    status: 'CONFIRMED',
    attendees: [
      { name: 'Executive Team', email: 'executive@enterprise.com', role: 'ORGANIZER' },
      { name: 'Tariq Al-Mansoor', email: 'tariq.mansoor@techfirm.com', role: 'ATTENDEE' },
      { name: 'Dr. Sarah Smith', email: 'sarah.smith@cloudgov.org', role: 'ATTENDEE' }
    ],
    organizer: { name: 'Executive Team', email: 'executive@enterprise.com' },
    conferenceUrl: 'https://meet.google.com/abc-defg-hij',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'evt-002',
    externalId: 'gcal-9821388',
    provider: 'GOOGLE',
    accountId: 'acc-google-01',
    title: 'Bilingual Localization & Arabic RTL Usability Review',
    description: 'Interface testing across RTL typography, contrast ratio, and layout mirroring.',
    location: 'Virtual Workshop',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 25).toISOString(),
    isAllDay: false,
    status: 'CONFIRMED',
    attendees: [
      { name: 'Mohamed Arab', email: 'moh.arab@westernksa.com', role: 'ORGANIZER' },
      { name: 'Design & QA Team', email: 'qa@enterprise.com', role: 'ATTENDEE' }
    ],
    organizer: { name: 'Mohamed Arab', email: 'moh.arab@westernksa.com' },
    conferenceUrl: 'https://meet.google.com/xyz-uvwx-rst',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-001',
    userId: 'usr-default',
    title: 'Review and sign Q3 Architecture SLA Proposal',
    description: 'Derived from email correspondence with Tariq Al-Mansoor regarding compute nodes.',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString().split('T')[0],
    sourceType: 'EMAIL',
    sourceId: 'msg-001',
    tags: ['Architecture', 'SLA', 'High Priority'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tsk-002',
    userId: 'usr-default',
    title: 'Validate Arabic font pairing and RTL mirror alignment',
    description: 'Ensure IBM Plex Sans and Cairo render with proper line heights and zero clipping.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0],
    sourceType: 'MANUAL',
    tags: ['Localization', 'Design'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tsk-003',
    userId: 'usr-default',
    title: 'Prepare follow-up agenda for Western Region Telecom',
    description: 'Generated by AI extraction from thread #conv-002.',
    status: 'TODO',
    priority: 'URGENT',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString().split('T')[0],
    sourceType: 'AI',
    sourceId: 'conv-002',
    tags: ['Contracts', 'Follow-up'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'sch-001',
    userId: 'usr-default',
    title: 'Deferred Follow-up: Telecom Partnership SLA Addendum',
    actionType: 'FOLLOW_UP',
    payload: { recipient: 'layla.harbi@westerntelecom.sa', template: 'contract_check_in' },
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    status: 'PENDING',
    recurrence: 'NONE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sch-002',
    userId: 'usr-default',
    title: 'Daily Operational Digest Notification',
    actionType: 'REMINDER',
    payload: { channel: 'in_app', summaryType: 'daily_briefing' },
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 14).toISOString(),
    status: 'PENDING',
    recurrence: 'DAILY',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'cnt-001',
    userId: 'usr-default',
    firstName: 'Tariq',
    lastName: 'Al-Mansoor',
    email: 'tariq.mansoor@techfirm.com',
    phone: '+966 54 111 2233',
    company: 'TechFirm Enterprise Solutions',
    title: 'Principal Systems Architect',
    tags: ['Architecture', 'Vendor', 'Key Stakeholder'],
    notes: 'Primary technical architect for cloud infrastructure consolidation.',
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cnt-002',
    userId: 'usr-default',
    firstName: 'Layla',
    lastName: 'Al-Harbi',
    email: 'layla.harbi@westerntelecom.sa',
    phone: '+966 50 999 8877',
    company: 'Western Telecom SA',
    title: 'VP of Commercial Alliances',
    tags: ['Client', 'Telecom', 'Partnership'],
    notes: 'Handles bilateral commercial negotiations and SLA compliance.',
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    createdAt: '2026-01-12T14:30:00Z',
    updatedAt: new Date().toISOString()
  }
];
