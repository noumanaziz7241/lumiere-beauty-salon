import { DEFAULT_SALON_CONFIG } from '../../src/config/defaults.ts';
import { queryOne, withTransaction } from './connection.ts';

/** Insert marketing tables for databases created before v1.1 features. */
export async function ensureExtendedConfigSeeded() {
  const promo = await queryOne<{ id: number }>('SELECT id FROM site_promotion WHERE id = 1');
  if (promo) return;

  const config = DEFAULT_SALON_CONFIG;
  const { promotion, googleReviews, faq, packages, gallery } = config;

  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO site_promotion (id, enabled, message, link_url, link_label) VALUES (1, $1, $2, $3, $4)`,
      [promotion.enabled, promotion.message, promotion.linkUrl ?? '', promotion.linkLabel ?? ''],
    );

    await client.query(
      `INSERT INTO site_google_reviews (id, enabled, average_rating, total_reviews, reviews_url, embed_url)
       VALUES (1, $1, $2, $3, $4, $5)`,
      [
        googleReviews.enabled,
        googleReviews.averageRating,
        googleReviews.totalReviews,
        googleReviews.reviewsUrl,
        googleReviews.embedUrl ?? '',
      ],
    );

    for (let i = 0; i < googleReviews.snippets.length; i++) {
      const s = googleReviews.snippets[i];
      await client.query(
        `INSERT INTO google_review_snippets (id, author, text, rating, relative_time, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [s.id, s.author, s.text, s.rating, s.relativeTime ?? null, i],
      );
    }

    for (let i = 0; i < faq.length; i++) {
      const item = faq[i];
      await client.query(
        `INSERT INTO faq_items (id, question, answer, category, sort_order) VALUES ($1, $2, $3, $4, $5)`,
        [item.id, item.question, item.answer, item.category ?? null, i],
      );
    }

    for (let i = 0; i < gallery.length; i++) {
      const img = gallery[i];
      await client.query(
        `INSERT INTO gallery_images (id, title, category, image_url, sort_order) VALUES ($1, $2, $3, $4, $5)`,
        [img.id, img.title, img.category, img.imageUrl, i],
      );
    }

    for (let i = 0; i < packages.length; i++) {
      const pkg = packages[i];
      await client.query(
        `INSERT INTO bridal_packages (id, name, description, badge, highlight, sort_order) VALUES ($1, $2, $3, $4, $5, $6)`,
        [pkg.id, pkg.name, pkg.description, pkg.badge, pkg.highlight ?? null, i],
      );
      for (let j = 0; j < pkg.serviceIds.length; j++) {
        await client.query(
          `INSERT INTO bridal_package_services (package_id, service_id, sort_order) VALUES ($1, $2, $3)`,
          [pkg.id, pkg.serviceIds[j], j],
        );
      }
    }
  });
}
