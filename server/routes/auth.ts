import { Router } from 'express';
import {
  requireAuth,
  createSession,
  destroySession,
  isValidSession,
  setSessionCookie,
  clearSessionCookie,
  SESSION_COOKIE,
} from '../middleware/auth.ts';
import { verifyAdminPassword, updateAdminPassword } from '../store/index.ts';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { password } = req.body as { password?: string };
    if (!password || !(await verifyAdminPassword(password))) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }
    const sessionId = createSession();
    setSessionCookie(res, sessionId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res) => {
  const sessionId = req.cookies?.[SESSION_COOKIE];
  if (sessionId) destroySession(sessionId);
  clearSessionCookie(res);
  res.json({ success: true });
});

router.get('/me', (req, res) => {
  const sessionId = req.cookies?.[SESSION_COOKIE];
  res.json({ authenticated: isValidSession(sessionId) });
});

router.put('/password', requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      res.status(400).json({ error: 'Current and new password (min 6 chars) required' });
      return;
    }
    if (!(await verifyAdminPassword(currentPassword))) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }
    await updateAdminPassword(newPassword);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
