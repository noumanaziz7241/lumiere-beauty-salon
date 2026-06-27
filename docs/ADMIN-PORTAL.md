# Admin Portal

Route: `/admin` — password from `ADMIN_PASSWORD` (default `lumiere2024`).

## Tabs

| Tab | Purpose |
|-----|---------|
| Contact | Phone, email, WhatsApp, address, map, social |
| Content | Hero, about, footer, core promises |
| **Marketing** | Promotion banner + Google reviews (rating, count, URL, snippets) |
| **Packages** | Bridal & party packages with linked service IDs |
| **Gallery** | Upload images + captions/categories |
| **FAQ** | Questions, answers, categories |
| **Vouchers** | Gift voucher orders (mark paid / active / redeemed) |
| Services | Service catalog |
| Reviews | On-site testimonials |
| Hours | Business hours |
| Bookings | Confirm/cancel; list last 20 days by default |
| Settings | Admin password, reset defaults |

## Workflows

### Promotion banner
Marketing tab → enable, set headline/message/link → **Save All**.

### Gallery
Gallery tab → upload image (immediate file save) → add caption → **Save All** to persist in DB.

### Google reviews
Marketing tab → enter rating, review count, Google Maps reviews URL, optional embed URL, manual review snippets. No Google Places API required.

### Email notifications
Set SMTP in `.env` (see `.env.example`). Client must provide email on booking form for client emails.
