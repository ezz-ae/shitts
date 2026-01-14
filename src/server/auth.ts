import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';

export type UserSession = {
  uid: string;
  email?: string;
  role: 'user' | 'admin';
};

/**
 * Resolves the current user session from the cookie.
 * In a real production app, this would verify the Firebase Session Cookie.
 */
export async function getSession(): Promise<UserSession | null> {
  const sessionCookie = (await cookies()).get('__session')?.value;
  
  if (!sessionCookie) return null;

  try {
    // In production: await adminAuth.verifySessionCookie(sessionCookie, true);
    // For now, we'll assume the presence of a cookie means a valid (simulated) session.
    // We will build the full verification in PHASE 2.
    return {
      uid: 'user_123', // Simulated ID
      email: 'jane@example.com',
      role: 'user'
    };
  } catch (error) {
    return null;
  }
}

/**
 * Asserts that a session exists or throws an error.
 */
export async function requireSession(): Promise<UserSession> {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized: Session required');
  return session;
}
