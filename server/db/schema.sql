-- Lumière Beauty Salon — PostgreSQL Schema
-- Version: 1.0.0

-- ─── Schema version tracking ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS schema_migrations (
  version     TEXT PRIMARY KEY,
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Authentication ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_users (
  id            INTEGER PRIMARY KEY CHECK (id = 1),
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Site identity & contact ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_contact (
  id             INTEGER PRIMARY KEY CHECK (id = 1),
  phone          TEXT NOT NULL,
  whatsapp       TEXT NOT NULL,
  email          TEXT NOT NULL,
  address        TEXT NOT NULL,
  city           TEXT NOT NULL,
  map_embed_url  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS site_social (
  id         INTEGER PRIMARY KEY CHECK (id = 1),
  instagram  TEXT NOT NULL DEFAULT '',
  facebook   TEXT NOT NULL DEFAULT '',
  tiktok     TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS site_navbar (
  id           INTEGER PRIMARY KEY CHECK (id = 1),
  banner_text  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS site_footer (
  id           INTEGER PRIMARY KEY CHECK (id = 1),
  description  TEXT NOT NULL,
  slogan       TEXT NOT NULL,
  tagline      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS site_hours_note (
  id    INTEGER PRIMARY KEY CHECK (id = 1),
  note  TEXT NOT NULL
);

-- ─── Marketing content ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS hero_content (
  id               INTEGER PRIMARY KEY CHECK (id = 1),
  tagline          TEXT NOT NULL,
  subtitle         TEXT NOT NULL,
  motto            TEXT NOT NULL,
  banner_text      TEXT NOT NULL,
  card_title       TEXT NOT NULL,
  card_subtitle    TEXT NOT NULL,
  card_description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS about_content (
  id        INTEGER PRIMARY KEY CHECK (id = 1),
  title     TEXT NOT NULL,
  subtitle  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS about_paragraphs (
  id          SERIAL PRIMARY KEY,
  content     TEXT    NOT NULL,
  sort_order  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS about_highlights (
  id          SERIAL PRIMARY KEY,
  content     TEXT    NOT NULL,
  sort_order  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS business_hours (
  id          SERIAL PRIMARY KEY,
  days        TEXT    NOT NULL,
  hours       TEXT    NOT NULL,
  is_closed   BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS time_slots (
  id          SERIAL PRIMARY KEY,
  slot_time   TEXT    NOT NULL UNIQUE,
  sort_order  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS core_promises (
  id          SERIAL PRIMARY KEY,
  title       TEXT    NOT NULL,
  description TEXT    NOT NULL,
  sort_order  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS testimonials (
  id          TEXT    PRIMARY KEY,
  name        TEXT    NOT NULL,
  text        TEXT    NOT NULL,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  service     TEXT,
  sort_order  INTEGER NOT NULL
);

-- ─── Service catalog ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS service_categories (
  id          TEXT    PRIMARY KEY,
  name        TEXT    NOT NULL,
  description TEXT    NOT NULL,
  icon        TEXT    NOT NULL,
  sort_order  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id                 TEXT    PRIMARY KEY,
  category_id        TEXT    NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  name               TEXT    NOT NULL,
  estimated_duration TEXT    NOT NULL,
  price_pkr          INTEGER NOT NULL CHECK (price_pkr >= 0),
  description        TEXT,
  sort_order         INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);

-- ─── Appointments ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS bookings (
  id              TEXT        PRIMARY KEY,
  customer_name   TEXT        NOT NULL,
  customer_phone  TEXT        NOT NULL,
  customer_email  TEXT        NOT NULL DEFAULT '',
  preferred_date  TEXT        NOT NULL,
  preferred_time  TEXT        NOT NULL,
  total_price     INTEGER     NOT NULL CHECK (total_price >= 0),
  status          TEXT        NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_date        ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status      ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date_time   ON bookings(preferred_date, preferred_time);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at  ON bookings(created_at);

CREATE TABLE IF NOT EXISTS booking_services (
  booking_id         TEXT    NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  service_id         TEXT    NOT NULL,
  service_name       TEXT    NOT NULL,
  estimated_duration TEXT    NOT NULL,
  price_pkr          INTEGER NOT NULL,
  description        TEXT,
  PRIMARY KEY (booking_id, service_id)
);

CREATE INDEX IF NOT EXISTS idx_booking_services_booking ON booking_services(booking_id);
