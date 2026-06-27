import { Router } from 'express';
import { requireAuth } from '../middleware/auth.ts';
import { getPublicConfig, saveConfig, resetConfig } from '../store/index.ts';
import type { PublicSalonConfig } from '../store/index.ts';

const router = Router();

router.get('/', (_req, res) => {
  res.json(getPublicConfig());
});

router.put('/', requireAuth, (req, res) => {
  const body = req.body as PublicSalonConfig;
  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: 'Invalid config body' });
    return;
  }
  const saved = saveConfig(body);
  res.json(saved);
});

router.post('/reset', requireAuth, (_req, res) => {
  const config = resetConfig();
  res.json(config);
});

export default router;
