/**
 * Business Communication OS - Firebase Client & Google Auth Module
 * Features: ACC-001, ACC-002, ACC-007, INT-002, INT-004, SEC-001, SEC-002
 * 
 * Manages Firebase App, Auth with Google Workspace scopes:
 * - https://www.googleapis.com/auth/gmail.modify
 * - https://www.googleapis.com/auth/contacts
 * 
 * Strict Security Rules:
 * - OAuth access token is cached ONLY IN MEMORY.
 * - No tokens or secrets in localStorage or sessionStorage.
 * - Cleared on logout.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User as FirebaseUser,
  signOut as fbSignOut
} from 'firebase/auth';
import firebaseConfig from '../../firebaseConfig';
import { logger } from '../logger';

const log = logger.child('FirebaseAuth');

// Initialize or reuse Firebase app
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Auth Provider with required Workspace scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/gmail.modify');
googleProvider.addScope('https://www.googleapis.com/auth/contacts');

// Memory-only access token cache
let cachedAccessToken: string | null = null;
let isSigningIn = false;

/**
 * Get current in-memory OAuth access token.
 */
export const getCachedAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Set or clear in-memory access token (used during auth restore or token refresh).
 */
export const setCachedAccessToken = (token: string | null): void => {
  cachedAccessToken = token;
};

/**
 * Interactive Google Sign-In popup with Workspace scopes.
 */
export const signInWithGoogleWorkspace = async (): Promise<{
  firebaseUser: FirebaseUser;
  accessToken: string;
}> => {
  try {
    isSigningIn = true;
    log.info('Initiating Google Workspace sign-in popup');
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (!credential?.accessToken) {
      throw new Error('No OAuth access token returned from Google authentication provider.');
    }

    cachedAccessToken = credential.accessToken;
    log.info('Google Workspace sign-in successful', { uid: result.user.uid, email: result.user.email });
    return {
      firebaseUser: result.user,
      accessToken: cachedAccessToken,
    };
  } catch (error) {
    log.error('Google Workspace sign-in failed', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Initialize auth listener to monitor state and clear tokens on logout.
 */
export const initAuthListener = (
  onAuthSuccess?: (user: FirebaseUser, token: string | null) => void,
  onAuthFailure?: () => void
): (() => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (cachedAccessToken) {
        onAuthSuccess?.(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // User is recognized by Firebase, but access token needs interactive refresh if expired
        onAuthSuccess?.(user, null);
      }
    } else {
      cachedAccessToken = null;
      onAuthFailure?.();
    }
  });
};

/**
 * Sign out and clear in-memory tokens.
 */
export const signOutFirebase = async (): Promise<void> => {
  cachedAccessToken = null;
  await fbSignOut(auth);
  log.info('Firebase auth session terminated and memory token cleared');
};
