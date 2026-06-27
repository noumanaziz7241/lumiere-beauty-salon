import { randomBytes } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

const SESSION_COOKIE = 'lumiere_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

const sessions = new Map<string, { createdAt: number }>();

export function createSession(): string {
  const id = randomBytes(32).toString('hex');
  sessions.set(id, { createdAt: Date.now() });
  return id;
}

export function destroySession(sessionId: string) {
  sessions.delete(sessionId);
}

export function isValidSession(sessionId: string | undefined): boolean {
  if (!sessionId) return false;
  const session = sessions.get(sessionId);
  if (!session) return false;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(sessionId);
    return false;
  }
  return true;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies?.[SESSION_COOKIE];
  if (!isValidSession(sessionId)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

function cookieSameSite(): 'lax' | 'none' {
  if (process.env.COOKIE_SAME_SITE === 'none') return 'none';
  return 'lax';
}

export function setSessionCookie(res: Response, sessionId: string) {
  const sameSite = cookieSameSite();
  res.cookie(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite,
    secure: sameSite === 'none' || process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_MS,
    path: '/',
  });
}

export function clearSessionCookie(res: Response) {
  const sameSite = cookieSameSite();
  res.clearCookie(SESSION_COOKIE, {
    path: '/',
    sameSite,
    secure: sameSite === 'none' || process.env.NODE_ENV === 'production',
  });
}

export { SESSION_COOKIE };
