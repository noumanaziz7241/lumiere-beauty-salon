import { Router } from 'express';
import multer from 'multer';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { requireAuth } from '../middleware/auth.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = join(__dirname, '../../uploads/gallery');

if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 60);
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      cb(new Error('Only image files (jpg, png, webp, gif) are allowed'));
      return;
    }
    cb(null, true);
  },
});

const router = Router();

router.post('/gallery', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No image uploaded' });
    return;
  }

  const url = `/uploads/gallery/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

export default router;
