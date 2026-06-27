import type { PublicSalonConfig } from '../../../src/config/defaults.ts';
import type { ServiceCategory, ServiceSubcategory, Service } from '../../../src/types.ts';
import { queryOne, queryAll } from '../connection.ts';
import { seedFromConfig, seedDefaultConfig } from '../seed.ts';

export async function loadPublicConfig(): Promise<PublicSalonConfig> {
  const contact = await queryOne<{
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    city: string;
    map_embed_url: string;
  }>('SELECT * FROM site_contact WHERE id = 1');

  const social = await queryOne<{ instagram: string; facebook: string; tiktok: string }>(
    'SELECT * FROM site_social WHERE id = 1',
  );

  const navbar = await queryOne<{ banner_text: string }>(
    'SELECT banner_text FROM site_navbar WHERE id = 1',
  );

  const footer = await queryOne<{ description: string; slogan: string; tagline: string }>(
    'SELECT * FROM site_footer WHERE id = 1',
  );

  const hoursNote = await queryOne<{ note: string }>('SELECT note FROM site_hours_note WHERE id = 1');

  const hero = await queryOne<{
    tagline: string;
    subtitle: string;
    motto: string;
    banner_text: string;
    card_title: string;
    card_subtitle: string;
    card_description: string;
  }>('SELECT * FROM hero_content WHERE id = 1');

  const about = await queryOne<{ title: string; subtitle: string }>(
    'SELECT * FROM about_content WHERE id = 1',
  );

  if (!contact || !social || !navbar || !footer || !hoursNote || !hero || !about) {
    throw new Error('Salon configuration is not seeded in the database');
  }

  const paragraphs = (
    await queryAll<{ content: string }>('SELECT content FROM about_paragraphs ORDER BY sort_order')
  ).map((r) => r.content);

  const highlights = (
    await queryAll<{ content: string }>('SELECT content FROM about_highlights ORDER BY sort_order')
  ).map((r) => r.content);

  const businessHours = (
    await queryAll<{ days: string; hours: string; is_closed: boolean }>(
      'SELECT days, hours, is_closed FROM business_hours ORDER BY sort_order',
    )
  ).map((r) => ({
    days: r.days,
    hours: r.hours,
    closed: r.is_closed,
  }));

  const timeSlots = (
    await queryAll<{ slot_time: string }>('SELECT slot_time FROM time_slots ORDER BY sort_order')
  ).map((r) => r.slot_time);

  const corePromises = await queryAll<{ title: string; description: string }>(
    'SELECT title, description FROM core_promises ORDER BY sort_order',
  );

  const testimonials = (
    await queryAll<{
      id: string;
      name: string;
      text: string;
      rating: number;
      service: string | null;
    }>('SELECT id, name, text, rating, service FROM testimonials ORDER BY sort_order')
  ).map((t) => ({
    id: t.id,
    name: t.name,
    text: t.text,
    rating: t.rating,
    service: t.service ?? undefined,
  }));

  const categories = await queryAll<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>('SELECT id, name, description, icon FROM service_categories ORDER BY sort_order');

  const serviceRows = await queryAll<{
    id: string;
    category_id: string;
    name: string;
    estimated_duration: string;
    price_pkr: number;
    description: string | null;
  }>(`SELECT id, category_id, name, estimated_duration, price_pkr, description FROM services ORDER BY sort_order`);

  const services: ServiceCategory[] = categories.map((cat) => ({
    id: cat.id,
    name: cat.name as ServiceSubcategory,
    description: cat.description,
    icon: cat.icon,
    services: serviceRows
      .filter((s) => s.category_id === cat.id)
      .map((s) => ({
        id: s.id,
        name: s.name,
        estimatedDuration: s.estimated_duration,
        pricePKR: s.price_pkr,
        description: s.description ?? undefined,
      })),
  }));

  const promotionRow = await queryOne<{
    enabled: boolean;
    message: string;
    link_url: string;
    link_label: string;
  }>('SELECT enabled, message, link_url, link_label FROM site_promotion WHERE id = 1');

  const googleRow = await queryOne<{
    enabled: boolean;
    average_rating: string;
    total_reviews: number;
    reviews_url: string;
    embed_url: string;
  }>('SELECT * FROM site_google_reviews WHERE id = 1');

  const googleSnippets = (
    await queryAll<{
      id: string;
      author: string;
      text: string;
      rating: number;
      relative_time: string | null;
    }>('SELECT id, author, text, rating, relative_time FROM google_review_snippets ORDER BY sort_order')
  ).map((s) => ({
    id: s.id,
    author: s.author,
    text: s.text,
    rating: s.rating,
    relativeTime: s.relative_time ?? undefined,
  }));

  const faq = (
    await queryAll<{
      id: string;
      question: string;
      answer: string;
      category: string | null;
    }>('SELECT id, question, answer, category FROM faq_items ORDER BY sort_order')
  ).map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category ?? undefined,
  }));

  const gallery = (
    await queryAll<{
      id: string;
      title: string;
      category: string;
      image_url: string;
    }>('SELECT id, title, category, image_url FROM gallery_images ORDER BY sort_order')
  ).map((g) => ({
    id: g.id,
    title: g.title,
    category: g.category as import('../../../src/config/marketingDefaults.ts').GalleryImage['category'],
    imageUrl: g.image_url,
  }));

  const packageRows = await queryAll<{
    id: string;
    name: string;
    description: string;
    badge: string;
    highlight: string | null;
  }>('SELECT id, name, description, badge, highlight FROM bridal_packages ORDER BY sort_order');

  const packageServiceRows = await queryAll<{
    package_id: string;
    service_id: string;
    sort_order: number;
  }>('SELECT package_id, service_id, sort_order FROM bridal_package_services ORDER BY sort_order');

  const packages = packageRows.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    badge: p.badge as import('../../../src/config/marketingDefaults.ts').BridalPackage['badge'],
    highlight: p.highlight ?? undefined,
    serviceIds: packageServiceRows.filter((ps) => ps.package_id === p.id).map((ps) => ps.service_id),
  }));

  const chatRow = await queryOne<{
    enabled: boolean;
    provider: string;
    whatsapp_label: string;
    tawk_property_id: string;
    tawk_widget_id: string;
  }>('SELECT * FROM site_chat WHERE id = 1');

  const giftRow = await queryOne<{
    enabled: boolean;
    title: string;
    subtitle: string;
    validity_months: number;
  }>('SELECT * FROM site_gift_voucher_config WHERE id = 1');

  const giftAmounts = (
    await queryAll<{ amount_pkr: number }>(
      'SELECT amount_pkr FROM gift_voucher_amounts ORDER BY sort_order',
    )
  ).map((r) => r.amount_pkr);

  const giftTerms = (
    await queryAll<{ content: string }>('SELECT content FROM gift_voucher_terms ORDER BY sort_order')
  ).map((r) => r.content);

  return {
    contact: {
      phone: contact.phone,
      whatsapp: contact.whatsapp,
      email: contact.email,
      address: contact.address,
      city: contact.city,
      mapEmbedUrl: contact.map_embed_url,
    },
    social: {
      instagram: social.instagram,
      facebook: social.facebook,
      tiktok: social.tiktok,
    },
    businessHours,
    hoursNote: hoursNote.note,
    hero: {
      tagline: hero.tagline,
      subtitle: hero.subtitle,
      motto: hero.motto,
      bannerText: hero.banner_text,
      cardTitle: hero.card_title,
      cardSubtitle: hero.card_subtitle,
      cardDescription: hero.card_description,
    },
    about: {
      title: about.title,
      subtitle: about.subtitle,
      paragraphs,
      highlights,
    },
    footer: {
      description: footer.description,
      slogan: footer.slogan,
      tagline: footer.tagline,
    },
    navbar: {
      bannerText: navbar.banner_text,
    },
    corePromises,
    testimonials,
    services,
    timeSlots,
    promotion: promotionRow
      ? {
          enabled: promotionRow.enabled,
          message: promotionRow.message,
          linkUrl: promotionRow.link_url || undefined,
          linkLabel: promotionRow.link_label || undefined,
        }
      : { enabled: false, message: '' },
    googleReviews: googleRow
      ? {
          enabled: googleRow.enabled,
          averageRating: Number(googleRow.average_rating),
          totalReviews: googleRow.total_reviews,
          reviewsUrl: googleRow.reviews_url,
          embedUrl: googleRow.embed_url || undefined,
          snippets: googleSnippets,
        }
      : {
          enabled: false,
          averageRating: 5,
          totalReviews: 0,
          reviewsUrl: '',
          snippets: [],
        },
    faq,
    packages,
    gallery,
    chat: chatRow
      ? {
          enabled: chatRow.enabled,
          provider: chatRow.provider as 'whatsapp' | 'tawk',
          whatsappLabel: chatRow.whatsapp_label,
          tawkPropertyId: chatRow.tawk_property_id,
          tawkWidgetId: chatRow.tawk_widget_id,
        }
      : {
          enabled: true,
          provider: 'whatsapp',
          whatsappLabel: 'Book on WhatsApp',
          tawkPropertyId: '',
          tawkWidgetId: '',
        },
    giftVouchers: giftRow
      ? {
          enabled: giftRow.enabled,
          title: giftRow.title,
          subtitle: giftRow.subtitle,
          validityMonths: giftRow.validity_months,
          amountsPKR: giftAmounts,
          terms: giftTerms,
        }
      : {
          enabled: false,
          title: 'Gift Vouchers',
          subtitle: '',
          validityMonths: 12,
          amountsPKR: [],
          terms: [],
        },
  };
}

export async function savePublicConfig(config: PublicSalonConfig): Promise<PublicSalonConfig> {
  await seedFromConfig(config);
  return loadPublicConfig();
}

export async function resetPublicConfig(): Promise<PublicSalonConfig> {
  await seedDefaultConfig();
  return loadPublicConfig();
}

export async function findServiceById(
  serviceId: string,
): Promise<{ service: Service; categoryId: string } | null> {
  const row = await queryOne<{
    id: string;
    category_id: string;
    name: string;
    estimated_duration: string;
    price_pkr: number;
    description: string | null;
  }>('SELECT id, category_id, name, estimated_duration, price_pkr, description FROM services WHERE id = $1', [
    serviceId,
  ]);

  if (!row) return null;

  return {
    categoryId: row.category_id,
    service: {
      id: row.id,
      name: row.name,
      estimatedDuration: row.estimated_duration,
      pricePKR: row.price_pkr,
      description: row.description ?? undefined,
    },
  };
}
