/**
 * Business Communication OS - API Envelope & Contract Types
 * Feature IDs: SYS-012, SYS-016
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorPayload;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
  };
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
