# Database

PostgreSQL via `DATABASE_URL`. Schema in `server/db/schema.sql`.

## Marketing tables

| Table | Purpose |
|-------|---------|
| `site_promotion` | Single-row promotion banner |
| `site_google_reviews` | Rating, count, URLs |
| `google_review_snippets` | Manual review quotes |
| `faq_items` | FAQ entries |
| `gallery_images` | Gallery metadata (URL, caption, category) |
| `bridal_packages` | Package definitions |
| `bridal_package_services` | Package ↔ service ID links |

| `bridal_package_services` | Package ↔ service ID links |
| `site_chat` | Live chat widget settings |
| `site_gift_voucher_config` | Gift voucher page settings |
| `gift_voucher_amounts` | Preset PKR amounts |
| `gift_voucher_terms` | Terms bullet points |
| `gift_vouchers` | Purchased voucher records (not cleared on config save) |

## Migration

Existing databases auto-migrate via `server/db/migrateExtendedConfig.ts` and `migrateExperienceFeatures.ts` on startup.

## Seed

`server/db/seed.ts` — default FAQ, packages, gallery, promotion, Google reviews, chat, gift voucher config.

Config admin **Save All** replaces config tables (not bookings or gift voucher orders).
