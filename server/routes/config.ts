import { Router } from 'express';
import { requireAuth } from '../middleware/auth.ts';
import { getPublicConfig, saveConfig, resetConfig } from '../store/index.ts';
import type { PublicSalonConfig } from '../store/index.ts';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    res.json(await getPublicConfig());
  } catch (error) {
    next(error);
  }
});

router.put('/', requireAuth, async (req, res, next) => {
  try {
    const body = req.body as PublicSalonConfig;
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Invalid config body' });
      return;
    }
    const saved = await saveConfig(body);
    res.json(saved);
  } catch (error) {
    next(error);
  }
});

router.post('/reset', requireAuth, async (_req, res, next) => {
  try {
    const config = await resetConfig();
    res.json(config);
  } catch (error) {
    next(error);
  }
});

export default router;
