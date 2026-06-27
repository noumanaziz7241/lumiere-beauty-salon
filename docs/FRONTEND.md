# Frontend

Single-page marketing site at `/` with admin at `/admin`.

## Public sections (HomePage)

| Section | Component | Anchor |
|---------|-----------|--------|
| Promotion banner | `PromotionBanner` | (fixed under navbar) |
| Hero | `Hero` | `#hero` |
| Packages | `PackagesSection` | `#packages` |
| Services | `ServiceCatalog` | `#services` |
| Gallery | `GallerySection` | `#gallery` |
| Testimonials | `Testimonials` | `#testimonials` |
| Google reviews | `GoogleReviewsSection` | `#google-reviews` |
| FAQ | `FAQSection` | `#faq` |
| Gift vouchers | `GiftVouchersSection` | `#gift-vouchers` |
| Booking | `BookingForm` | `#appointment` |
| Contact | `ContactSection` | `#contact` |

## Package booking flow

`PackagesSection` calls `onBookPackage(services)` → HomePage sets selected services and scrolls to `#appointment`.

## Config

All content loads via `SalonConfigContext` → `GET /api/config`. New fields: `promotion`, `faq`, `gallery`, `bridalPackages`, `googleReviews`.

## API client

`src/api/client.ts` — includes `uploadGalleryImage(file)` for admin gallery uploads.

## Dev proxy

Vite proxies `/api` and `/uploads` to `http://localhost:3001`.
