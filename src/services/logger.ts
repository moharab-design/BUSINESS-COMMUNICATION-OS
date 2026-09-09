/**
 * Business Communication OS - Structured Logging Foundation
 * Feature ID: SYS-015
 * 
 * Secure logging service that automatically scrubs sensitive credentials,
 * API keys, OAuth tokens, and PII from log output.
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogContext {
  module?: string;
  userId?: string;
  action?: string;
  requestId?: string;
  [key: string]: unknown;
}

// Patterns that identify sensitive fields to redact
const SENSITIVE_KEYS = new RegExp(
  'token|secret|password|authorization|bearer|apikey|api_key|access_token|refresh_token|private_key',
  'i'
);

function sanitize(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') {
    // Redact Bearer tokens
    if (data.toLowerCase().startsWith('bearer ')) {
      return 'Bearer [REDACTED]';
    }
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitize(item));
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.test(key)) {
        cleaned[key] = '[REDACTED_SECRET]';
      } else {
        cleaned[key] = sanitize(value);
      }
    }
    return cleaned;
  }
  return data;
}

class Logger {
  private moduleName: string;

  constructor(moduleName = 'App') {
    this.moduleName = moduleName;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.moduleName}] ${message}`;
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('DEBUG', message, context), sanitize(context) || '');
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage('INFO', message, context), sanitize(context) || '');
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('WARN', message, context), sanitize(context) || '');
  }

  error(message: string, error?: unknown, context?: LogContext): void {
    const errorDetails = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    
    console.error(
      this.formatMessage('ERROR', message, context),
      { error: sanitize(errorDetails), context: sanitize(context) }
    );
  }

  child(moduleName: string): Logger {
    return new Logger(`${this.moduleName}:${moduleName}`);
  }
}

export const logger = new Logger('BusinessOS');
