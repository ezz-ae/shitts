import { requireSession, UserSession } from './auth';

/**
 * Guard: Ensures the current user has a specific role.
 */
export async function assertRole(role: 'user' | 'admin'): Promise<UserSession> {
  const session = await requireSession();
  if (session.role !== role && session.role !== 'admin') {
    throw new Error(`Forbidden: Required role ${role}`);
  }
  return session;
}

/**
 * Guard: Ensures the current user is an admin.
 */
export async function assertAdmin(): Promise<UserSession> {
  return assertRole('admin');
}

/**
 * Guard: Ensures the current user is the owner of a specific resource.
 */
export async function assertOwner(ownerId: string): Promise<UserSession> {
  const session = await requireSession();
  if (session.uid !== ownerId && session.role !== 'admin') {
    throw new Error('Forbidden: You do not own this resource');
  }
  return session;
}
