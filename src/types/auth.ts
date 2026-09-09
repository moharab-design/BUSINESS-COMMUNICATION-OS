/**
 * Business Communication OS - Authentication & Security Types
 * Feature IDs: ACC-001, ACC-002, ACC-003, ACC-018, SEC-001, SEC-002, SEC-003
 */

import { User } from './domain';

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UpdateProfileInput {
  displayName?: string;
  preferredLanguage?: 'en' | 'ar';
  timezone?: string;
  profileImage?: string;
}
