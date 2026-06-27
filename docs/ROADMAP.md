# Lumière Beauty Salon — Future Improvements Roadmap

This document lists planned enhancements for later implementation. Items are grouped by area and roughly ordered by impact. Use it as a backlog when you are ready to extend the site.

**Last updated:** 2026-06-27

---

## Already built (reference)

The site currently includes:

- Public marketing site with hero, about, services, testimonials, contact
- Multi-service booking with slot availability and server-side pricing
- 10% repeat-client discount (prior confirmed booking on same phone)
- WhatsApp booking flow (free `wa.me` — pre-filled messages, not Business API)
- Automatic email on booking + confirmation (Gmail SMTP)
- Admin CMS: contact, content, services, reviews, hours, bookings
- Promotion banner, FAQ, bridal/party packages, photo gallery, Google reviews
- Gift voucher purchase + admin activation + code verification
- PWA (Add to Home Screen), accessibility toggles, live chat (WhatsApp or Tawk.to)
- Estimated visit duration when multiple services are selected
- Admin bookings list: last 20 days by default (data retained in DB)

---

## 1. Booking & revenue (highest impact)

| # | Improvement | Why it matters | Effort |
|---|-------------|----------------|--------|
| 1.1 | **Apply gift voucher at checkout** | Vouchers exist but are not yet deducted from booking totals — clients should enter `LUM-XXXX` in the booking form | Medium |
| 1.2 | **Online payments** | JazzCash / EasyPaisa / bank transfer QR for deposits or full payment (Pakistan-friendly) | Large |
| 1.3 | **Block closed days** | Admin marks holidays / closed days → those dates disabled in the booking calendar | Small |
| 1.4 | **Booking reminders** | Auto email or SMS 24 hours before appointment (“See you tomorrow at 2:30 PM”) | Medium |
| 1.5 | **`.ics` calendar file** | “Add to Google Calendar” download on confirmation — reduces no-shows | Small |
| 1.6 | **Stylist / artist choice** | Optional “Preferred stylist” field or dropdown (e.g. Sarah for makeup) | Medium |
| 1.7 | **Waitlist** | When a slot is full, let clients join a waitlist and notify if someone cancels | Large |

---

## 2. Client experience

| # | Improvement | Why it matters | Effort |
|---|-------------|----------------|--------|
| 2.1 | **Urdu + English toggle** | Important for local Lahore clients; save language preference in browser | Large |
| 2.2 | **“My bookings” lookup** | Enter phone number → view pending / confirmed appointments (no account login) | Medium |
| 2.3 | **Post-visit review prompt** | After admin marks visit complete, send email/WhatsApp link to leave a Google review | Medium |
| 2.4 | **Before/after gallery slider** | Drag comparison slider on gallery items — strong for bridal and hair transformations | Medium |
| 2.5 | **Instagram feed section** | Show latest posts (admin embed URL or username config) | Small |
| 2.6 | **Loyalty tiers** | e.g. 3 visits → 15% off, 5 visits → 20% (extends current 10% repeat discount) | Medium |
| 2.7 | **Referral program** | “Refer a friend” code or link for both to get a discount | Large |

---

## 3. Admin & operations

| # | Improvement | Why it matters | Effort |
|---|-------------|----------------|--------|
| 3.1 | **Dashboard stats** | This week’s bookings, revenue (PKR), top services, pending count at a glance | Medium |
| 3.2 | **Export bookings CSV** | Download bookings for accounting or WhatsApp follow-ups | Small |
| 3.3 | **Staff logins / roles** | Reception can confirm bookings; only owner edits prices and settings | Large |
| 3.4 | **CAPTCHA on forms** | Reduce spam on booking and gift voucher forms (e.g. hCaptcha, Turnstile) | Small |
| 3.5 | **Audit log** | Record who changed prices, confirmed bookings, activated vouchers | Medium |
| 3.6 | **Gallery drag-and-drop reorder** | Reorder images visually instead of manual sort fields | Medium |
| 3.7 | **Bulk actions on bookings** | Confirm or cancel multiple bookings at once | Small |
| 3.8 | **Automated voucher expiry emails** | Notify purchaser/recipient before a gift voucher expires | Medium |

---

## 4. Marketing & discovery (SEO)

| # | Improvement | Why it matters | Effort |
|---|-------------|----------------|--------|
| 4.1 | **SEO meta tags** | Unique title and description per section; Open Graph for WhatsApp/Instagram previews | Small |
| 4.2 | **`LocalBusiness` schema** | Structured data for Google (address, hours, rating, ladies-only) | Small |
| 4.3 | **Sitemap + robots.txt** | Help search engines index the public site | Small |
| 4.4 | **Beauty tips blog** | Admin-written posts — helps SEO (“bridal makeup Lahore”, etc.) | Large |
| 4.5 | **Google Maps “Directions” CTA** | One-tap directions from hero and contact on mobile | Small |
| 4.6 | **Seasonal landing sections** | Eid, wedding season, summer skincare — admin-managed blocks | Medium |

---

## 5. Technical & reliability

| # | Improvement | Why it matters | Effort |
|---|-------------|----------------|--------|
| 5.1 | **Automated DB backups** | Daily `pg_dump` cron — protects bookings and config | Small |
| 5.2 | **Image compression on upload** | Resize/compress gallery uploads for faster mobile loading | Medium |
| 5.3 | **Rate limiting** | Protect `/api/bookings` and `/api/vouchers` from abuse | Small |
| 5.4 | **Production deploy runbook** | VPS + nginx + SSL + env checklist in `docs/DEPLOYMENT.md` | Medium |
| 5.5 | **Health monitoring** | Uptime check on `/api/health`; optional error alerting | Small |
| 5.6 | **E2E tests** | Playwright tests for booking flow and admin login | Large |

---

## Recommended implementation order

When you are ready to work through the backlog, this order balances impact and effort:

### Phase A — Quick wins (1–2 days each)

1. **1.3** Block closed days in admin  
2. **1.5** `.ics` calendar download on confirmation  
3. **3.2** Export bookings CSV  
4. **4.1–4.3** SEO meta, schema, sitemap  
5. **4.5** Google Maps directions CTA  

### Phase B — Complete existing flows (≈1 week)

1. **1.1** Gift voucher redemption at checkout  
2. **2.2** “My bookings” phone lookup  
3. **3.1** Admin dashboard stats  
4. **2.5** Instagram feed section  

### Phase C — Growth features (1–2 weeks each)

1. **1.2** Online payments (JazzCash / EasyPaisa)  
2. **2.1** Urdu + English  
3. **1.4** Booking reminders (email + optional SMS)  
4. **3.3** Staff roles  

### Phase D — Polish & scale

1. **2.4** Before/after gallery slider  
2. **2.6** Loyalty tiers  
3. **4.4** Blog / beauty tips  
4. **5.1–5.3** Backups, image compression, rate limiting  

---

## Notes for later

- **WhatsApp:** Automatic salon→client WhatsApp still requires a paid Business API. Free `wa.me` pre-filled messages remain the recommended approach unless budget allows API integration.
- **SMS (Pakistan):** Providers like Twilio, local gateways, or Jazz/EasyPaisa APIs — evaluate cost per message before building reminders.
- **Payments:** Confirm JazzCash/EasyPaisa merchant account requirements before implementing checkout.
- **Gift vouchers:** Current flow is offline payment → admin marks **Active**. Online payment would activate vouchers automatically.

---

## Tracking progress

When an item is done, move it to `docs/CHANGELOG.md` with the date and mark it complete here:

```
- [ ] 1.1 Apply gift voucher at checkout
- [ ] 1.2 Online payments
...
```

Or replace checkboxes with ✅ and link to the changelog entry.
