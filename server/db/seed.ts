import type { PublicSalonConfig } from '../../src/config/defaults.ts';
import type { AppointmentBooking } from '../../src/types.ts';
import { DEFAULT_SALON_CONFIG } from '../../src/config/defaults.ts';
import { queryOne, withTransaction } from './connection.ts';
import type pg from 'pg';

export async function isDatabaseSeeded(): Promise<boolean> {
  const row = await queryOne<{ id: number }>('SELECT id FROM site_contact WHERE id = 1');
  return !!row;
}

export async function seedFromConfig(config: PublicSalonConfig) {
  await withTransaction(async (client) => {
    await clearConfigTables(client);

    await client.query(
      `INSERT INTO site_contact (id, phone, whatsapp, email, address, city, map_embed_url)
       VALUES (1, $1, $2, $3, $4, $5, $6)`,
      [
        config.contact.phone,
        config.contact.whatsapp,
        config.contact.email,
        config.contact.address,
        config.contact.city,
        config.contact.mapEmbedUrl,
      ],
    );

    await client.query(
      `INSERT INTO site_social (id, instagram, facebook, tiktok) VALUES (1, $1, $2, $3)`,
      [config.social.instagram, config.social.facebook, config.social.tiktok],
    );

    await client.query(`INSERT INTO site_navbar (id, banner_text) VALUES (1, $1)`, [
      config.navbar.bannerText,
    ]);

    await client.query(
      `INSERT INTO site_footer (id, description, slogan, tagline) VALUES (1, $1, $2, $3)`,
      [config.footer.description, config.footer.slogan, config.footer.tagline],
    );

    await client.query(`INSERT INTO site_hours_note (id, note) VALUES (1, $1)`, [config.hoursNote]);

    await client.query(
      `INSERT INTO hero_content (id, tagline, subtitle, motto, banner_text, card_title, card_subtitle, card_description)
       VALUES (1, $1, $2, $3, $4, $5, $6, $7)`,
      [
        config.hero.tagline,
        config.hero.subtitle,
        config.hero.motto,
        config.hero.bannerText,
        config.hero.cardTitle,
        config.hero.cardSubtitle,
        config.hero.cardDescription,
      ],
    );

    await client.query(`INSERT INTO about_content (id, title, subtitle) VALUES (1, $1, $2)`, [
      config.about.title,
      config.about.subtitle,
    ]);

    for (let i = 0; i < config.about.paragraphs.length; i++) {
      await client.query('INSERT INTO about_paragraphs (content, sort_order) VALUES ($1, $2)', [
        config.about.paragraphs[i],
        i,
      ]);
    }

    for (let i = 0; i < config.about.highlights.length; i++) {
      await client.query('INSERT INTO about_highlights (content, sort_order) VALUES ($1, $2)', [
        config.about.highlights[i],
        i,
      ]);
    }

    for (let i = 0; i < config.businessHours.length; i++) {
      const h = config.businessHours[i];
      await client.query(
        'INSERT INTO business_hours (days, hours, is_closed, sort_order) VALUES ($1, $2, $3, $4)',
        [h.days, h.hours, h.closed ?? false, i],
      );
    }

    for (let i = 0; i < config.timeSlots.length; i++) {
      await client.query('INSERT INTO time_slots (slot_time, sort_order) VALUES ($1, $2)', [
        config.timeSlots[i],
        i,
      ]);
    }

    for (let i = 0; i < config.corePromises.length; i++) {
      const p = config.corePromises[i];
      await client.query(
        'INSERT INTO core_promises (title, description, sort_order) VALUES ($1, $2, $3)',
        [p.title, p.description, i],
      );
    }

    for (let i = 0; i < config.testimonials.length; i++) {
      const t = config.testimonials[i];
      await client.query(
        'INSERT INTO testimonials (id, name, text, rating, service, sort_order) VALUES ($1, $2, $3, $4, $5, $6)',
        [t.id, t.name, t.text, t.rating, t.service ?? null, i],
      );
    }

    await client.query(
      `INSERT INTO site_promotion (id, enabled, message, link_url, link_label) VALUES (1, $1, $2, $3, $4)`,
      [
        config.promotion.enabled,
        config.promotion.message,
        config.promotion.linkUrl ?? '',
        config.promotion.linkLabel ?? '',
      ],
    );

    await client.query(
      `INSERT INTO site_google_reviews (id, enabled, average_rating, total_reviews, reviews_url, embed_url)
       VALUES (1, $1, $2, $3, $4, $5)`,
      [
        config.googleReviews.enabled,
        config.googleReviews.averageRating,
        config.googleReviews.totalReviews,
        config.googleReviews.reviewsUrl,
        config.googleReviews.embedUrl ?? '',
      ],
    );

    for (let i = 0; i < config.googleReviews.snippets.length; i++) {
      const s = config.googleReviews.snippets[i];
      await client.query(
        `INSERT INTO google_review_snippets (id, author, text, rating, relative_time, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [s.id, s.author, s.text, s.rating, s.relativeTime ?? null, i],
      );
    }

    for (let i = 0; i < config.faq.length; i++) {
      const item = config.faq[i];
      await client.query(
        `INSERT INTO faq_items (id, question, answer, category, sort_order) VALUES ($1, $2, $3, $4, $5)`,
        [item.id, item.question, item.answer, item.category ?? null, i],
      );
    }

    for (let i = 0; i < config.gallery.length; i++) {
      const img = config.gallery[i];
      await client.query(
        `INSERT INTO gallery_images (id, title, category, image_url, sort_order) VALUES ($1, $2, $3, $4, $5)`,
        [img.id, img.title, img.category, img.imageUrl, i],
      );
    }

    for (let i = 0; i < config.packages.length; i++) {
      const pkg = config.packages[i];
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

    await client.query(
      `INSERT INTO site_chat (id, enabled, provider, whatsapp_label, tawk_property_id, tawk_widget_id)
       VALUES (1, $1, $2, $3, $4, $5)`,
      [
        config.chat.enabled,
        config.chat.provider,
        config.chat.whatsappLabel,
        config.chat.tawkPropertyId,
        config.chat.tawkWidgetId,
      ],
    );

    await client.query(
      `INSERT INTO site_gift_voucher_config (id, enabled, title, subtitle, validity_months)
       VALUES (1, $1, $2, $3, $4)`,
      [
        config.giftVouchers.enabled,
        config.giftVouchers.title,
        config.giftVouchers.subtitle,
        config.giftVouchers.validityMonths,
      ],
    );

    for (let i = 0; i < config.giftVouchers.amountsPKR.length; i++) {
      await client.query(
        `INSERT INTO gift_voucher_amounts (amount_pkr, sort_order) VALUES ($1, $2)`,
        [config.giftVouchers.amountsPKR[i], i],
      );
    }

    for (let i = 0; i < config.giftVouchers.terms.length; i++) {
      await client.query(
        `INSERT INTO gift_voucher_terms (content, sort_order) VALUES ($1, $2)`,
        [config.giftVouchers.terms[i], i],
      );
    }

    for (let catIdx = 0; catIdx < config.services.length; catIdx++) {
      const cat = config.services[catIdx];
      await client.query(
        'INSERT INTO service_categories (id, name, description, icon, sort_order) VALUES ($1, $2, $3, $4, $5)',
        [cat.id, cat.name, cat.description, cat.icon, catIdx],
      );

      for (let svcIdx = 0; svcIdx < cat.services.length; svcIdx++) {
        const svc = cat.services[svcIdx];
        await client.query(
          `INSERT INTO services (id, category_id, name, estimated_duration, price_pkr, description, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            svc.id,
            cat.id,
            svc.name,
            svc.estimatedDuration,
            svc.pricePKR,
            svc.description ?? null,
            svcIdx,
          ],
        );
      }
    }
  });
}

export async function seedDefaultConfig() {
  const { adminPassword: _, ...publicConfig } = DEFAULT_SALON_CONFIG;
  await seedFromConfig(publicConfig);
}

async function clearConfigTables(client: pg.PoolClient) {
  await client.query(`
    DELETE FROM gift_voucher_terms;
    DELETE FROM gift_voucher_amounts;
    DELETE FROM site_gift_voucher_config;
    DELETE FROM site_chat;
    DELETE FROM bridal_package_services;
    DELETE FROM bridal_packages;
    DELETE FROM gallery_images;
    DELETE FROM faq_items;
    DELETE FROM google_review_snippets;
    DELETE FROM site_google_reviews;
    DELETE FROM site_promotion;
    DELETE FROM services;
    DELETE FROM service_categories;
    DELETE FROM testimonials;
    DELETE FROM core_promises;
    DELETE FROM time_slots;
    DELETE FROM business_hours;
    DELETE FROM about_highlights;
    DELETE FROM about_paragraphs;
    DELETE FROM about_content;
    DELETE FROM hero_content;
    DELETE FROM site_hours_note;
    DELETE FROM site_footer;
    DELETE FROM site_navbar;
    DELETE FROM site_social;
    DELETE FROM site_contact;
  `);
}

export async function importBookingsFromJson(bookings: AppointmentBooking[]) {
  const existing = await queryOne<{ count: string }>('SELECT COUNT(*)::text AS count FROM bookings');
  if (existing && parseInt(existing.count, 10) > 0) return;

  await withTransaction(async (client) => {
    for (const b of bookings) {
      await client.query(
        `INSERT INTO bookings (id, customer_name, customer_phone, customer_email, preferred_date, preferred_time, total_price, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          b.id,
          b.customerName,
          b.customerPhone,
          b.customerEmail,
          b.preferredDate,
          b.preferredTime,
          b.totalPrice,
          b.status,
          b.notes ?? null,
        ],
      );

      for (const svc of b.selectedServices) {
        await client.query(
          `INSERT INTO booking_services (booking_id, service_id, service_name, estimated_duration, price_pkr, description)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            b.id,
            svc.id,
            svc.name,
            svc.estimatedDuration,
            svc.pricePKR,
            svc.description ?? null,
          ],
        );
      }
    }
  });
}
