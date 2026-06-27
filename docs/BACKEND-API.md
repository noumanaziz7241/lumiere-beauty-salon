# Backend API

Base URL: `/api` (proxied to Express in dev).

## Config

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/config` | — | Full public salon config (includes promotion, FAQ, gallery, packages, Google reviews) |
| PUT | `/config` | Admin | Replace all config tables from JSON body |
| POST | `/config/reset` | Admin | Reset config to defaults |

## Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/login` | — | `{ password }` → session cookie |
| POST | `/auth/logout` | — | Clear session |
| GET | `/auth/me` | — | `{ authenticated: boolean }` |
| PUT | `/auth/password` | Admin | Change admin password |

## Bookings

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/bookings/availability?date=` | — | Booked time slots for a date |
| GET | `/bookings/returning-client?phone=` | — | Whether phone qualifies for repeat discount |
| POST | `/bookings` | — | Create booking; triggers email if SMTP configured |
| GET | `/bookings?daysBack=20` | Admin | List bookings (default last 20 days) |
| PATCH | `/bookings/:id` | Admin | Update status; sends confirmation email on `confirmed` |

### Email side effects

When `SMTP_USER` and `SMTP_PASS` are set:

- **POST /bookings** — email to salon contact email + client (if email provided)
- **PATCH /bookings/:id** with `status: confirmed` — confirmation email to client

| POST | `/vouchers` | — | Create gift voucher request |
| GET | `/vouchers/verify?code=` | — | Check voucher status |
| GET | `/vouchers` | Admin | List voucher orders |
| PATCH | `/vouchers/:id` | Admin | Update status (`pending` → `active` → `redeemed`) |

## Upload

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/upload/gallery` | Admin | Multipart field `image` (max 5MB). Returns `{ url: "/uploads/gallery/..." }` |

Uploaded files are served at `/uploads/*` from the Express server. Save gallery URLs via **Save All** in admin after upload.
