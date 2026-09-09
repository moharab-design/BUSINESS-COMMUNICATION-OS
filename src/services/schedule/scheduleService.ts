/**
 * Business Communication OS - Schedule Service
 * Feature IDs: COMP-022, SYS-006, SCH-001
 * 
 * Manages scheduled actions such as delayed email sending and follow-ups.
 * Per prompt specifications:
 * - Scheduled sending creates a pending schedule record (status: PENDING).
 * - Clearly marked as pending implementation / queued for server execution (PROMPT-011).
 * - No fake client-side timers.
 */

import { Schedule } from '../../types/domain';
import { INITIAL_SCHEDULES } from '../../persistence/repositories';
import { logger } from '../logger';

const log = logger.child('ScheduleService');

export class ScheduleService {
  private static instance: ScheduleService;
  private schedules: Schedule[] = [...INITIAL_SCHEDULES];

  static getInstance(): ScheduleService {
    if (!ScheduleService.instance) {
      ScheduleService.instance = new ScheduleService();
    }
    return ScheduleService.instance;
  }

  listSchedules(): Schedule[] {
    return [...this.schedules];
  }

  createScheduledEmail(params: {
    title: string;
    scheduledAt: string;
    draft: {
      to: Array<{ name: string; email?: string }>;
      cc?: Array<{ name: string; email?: string }>;
      bcc?: Array<{ name: string; email?: string }>;
      subject: string;
      bodyText: string;
      bodyHtml?: string;
      attachments?: Array<{ filename: string; sizeBytes: number }>;
    };
  }): Schedule {
    log.info('Creating scheduled email send record with PENDING status', { scheduledAt: params.scheduledAt });

    const newSchedule: Schedule = {
      id: `sch-${Date.now()}`,
      userId: 'usr-default',
      title: params.title || `Scheduled Email: ${params.draft.subject}`,
      actionType: 'EMAIL_SEND',
      payload: {
        ...params.draft,
        dispatchEngine: 'PROMPT-011-SERVER-WORKFLOW',
        note: 'Queued for server scheduler execution (Pending server runner completion).',
      },
      scheduledAt: params.scheduledAt,
      status: 'PENDING',
      recurrence: 'NONE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.schedules = [newSchedule, ...this.schedules];
    return newSchedule;
  }

  cancelSchedule(id: string): void {
    this.schedules = this.schedules.map(s =>
      s.id === id ? { ...s, status: 'CANCELLED', updatedAt: new Date().toISOString() } : s
    );
  }
}

export const scheduleService = ScheduleService.getInstance();
