import { DEFAULT_GALLERY } from '../../src/config/marketingDefaults.ts';
import { query, queryOne, withTransaction } from './connection.ts';

const GALLERY_MIGRATION_VERSION = 'gallery_defaults_v2';

/** One-time upgrade: legacy Unsplash URLs or missing style-refresh layout. Never re-runs after v2 is recorded. */
export async function ensureGalleryDefaultsMigrated() {
  const applied = await queryOne<{ version: string }>(
    'SELECT version FROM schema_migrations WHERE version = $1',
    [GALLERY_MIGRATION_VERSION],
  );
  if (applied) return;

  const legacy = await queryOne<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM gallery_images
     WHERE image_url LIKE 'https://images.unsplash.com/%'`,
  );
  const hasStyleRefresh = await queryOne<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM gallery_images WHERE category = 'style-refresh'`,
  );
  const hasComposites = await queryOne<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM gallery_images
     WHERE image_url IN ('/images/gallery/ba-hair.jpg', '/images/gallery/ba-makeup.jpg')`,
  );

  const needsReseed =
    (legacy && legacy.count !== '0') ||
    (hasStyleRefresh && hasStyleRefresh.count === '0') ||
    (hasComposites && hasComposites.count !== '2');

  if (needsReseed) {
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

  await query('INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING', [
    GALLERY_MIGRATION_VERSION,
  ]);
}
