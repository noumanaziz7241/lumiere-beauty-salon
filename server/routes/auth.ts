import { Router } from 'express';
import { requireAuth, createSession, destroySession, isValidSession, setSessionCookie, clearSessionCookie, SESSION_COOKIE } from '../middleware/auth.ts';
import { verifyAdminPassword, updateAdminPassword } from '../store/index.ts';

const router = Router();

router.post('/login', (req, res) => {
  const { password } = req.body as { password?: string };
  if (!password || !verifyAdminPassword(password)) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }
  const sessionId = createSession();
  setSessionCookie(res, sessionId);
  res.json({ success: true });
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

router.put('/password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    res.status(400).json({ error: 'Current and new password (min 6 chars) required' });
    return;
  }
  if (!verifyAdminPassword(currentPassword)) {
    res.status(401).json({ error: 'Current password is incorrect' });
    return;
  }
  updateAdminPassword(newPassword);
  res.json({ success: true });
});

export default router;
