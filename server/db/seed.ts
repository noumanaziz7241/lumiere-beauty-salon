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
