import { DEFAULT_GALLERY } from '../../src/config/marketingDefaults.ts';
import { queryOne, withTransaction } from './connection.ts';

/** Replace legacy remote gallery URLs with bundled local assets. */
export async function ensureGalleryDefaultsMigrated() {
  const legacy = await queryOne<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM gallery_images
     WHERE image_url LIKE 'https://images.unsplash.com/%'`,
  );
  if (!legacy || legacy.count === '0') return;

  await withTransaction(async (client) => {
    await client.query('DELETE FROM gallery_images');
    for (let i = 0; i < DEFAULT_GALLERY.length; i++) {
      const img = DEFAULT_GALLERY[i];
      await client.query(
        `INSERT INTO gallery_images (id, title, category, image_url, sort_order) VALUES ($1, $2, $3, $4, $5)`,
        [img.id, img.title, img.category, img.imageUrl, i],
      );
    }
  });
}
