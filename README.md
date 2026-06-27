<div align="center">
  <img src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" alt="Beauty Salon Banner" width="100%"/>

  # Lumière Beauty Salon

  **A premium ladies-only salon website with booking and admin CMS**

  [![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## Overview

**Lumière Beauty Salon** is a full-stack web app for a ladies-only beauty salon. It includes a public marketing site, online appointment booking, and an admin portal to manage contact info, content, services, reviews, hours, and bookings.

The frontend and backend are **fully integrated** — the React app talks to the Express API for all live data (no localStorage for salon config or mock bookings).

**Technical documentation:** [docs/README.md](docs/README.md) — architecture, frontend, API, database schema, admin portal, deployment.

---

## Key Features

### Public site
- Hero, about, services catalog (search + categories), testimonials, contact section
- Multi-service booking with date/time selection and slot availability
- WhatsApp, phone, email, map, and social links (all editable in admin)
- Burgundy / rose / gold luxury theme

### Admin portal (`/admin`)
- Password-protected CMS
- Edit contact, hero, about, footer, core promises, services, reviews, hours
- View and manage appointments (confirm / cancel)
- Change admin password and reset content to defaults

### Backend API
- REST API on Express with **PostgreSQL** database (`pg`)
- Normalized schema: 18 tables for config, services, bookings, and admin
- Session-based admin auth (httpOnly cookies)
- Server-side price calculation and double-booking prevention
- Automatic migration from legacy JSON files on first run

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, React Router, Tailwind CSS v4, Lucide icons |
| Backend | Express 4, TypeScript (tsx), cookie-parser, cors |
| Database | **PostgreSQL** (`pg`) — connection via `DATABASE_URL` |
| Build | Vite 6 |

---

## Frontend ↔ Backend Integration

Yes — **all backend APIs are wired to the frontend** via `src/api/client.ts`. Vite proxies `/api` to the Express server in development.

| Frontend | API used | Purpose |
|----------|----------|---------|
| `SalonConfigContext` | `GET /api/config` | Load site content on startup |
| `SalonConfigContext` | `PUT /api/config` | Save admin dashboard changes |
| `SalonConfigContext` | `POST /api/config/reset` | Reset to defaults |
| `SalonConfigContext` | `POST /api/auth/login`, `logout`, `GET /api/auth/me` | Admin session |
| `BookingForm` | `POST /api/bookings` | Create appointments |
| `BookingForm` | `GET /api/bookings/availability` | Disable booked time slots |
| `AdminDashboard` | `GET /api/bookings`, `PATCH /api/bookings/:id` | Manage appointments |
| `AdminDashboard` | `PUT /api/auth/password` | Change admin password |

All public pages read config from the API through `useSalonConfig()` — services, contact, hours, testimonials, etc.

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | No | Health check |
| `GET` | `/api/config` | No | Public salon configuration |
| `PUT` | `/api/config` | Admin | Update configuration |
| `POST` | `/api/config/reset` | Admin | Reset config to defaults |
| `POST` | `/api/auth/login` | No | Admin login |
| `POST` | `/api/auth/logout` | No | Admin logout |
| `GET` | `/api/auth/me` | No | Check session status |
| `PUT` | `/api/auth/password` | Admin | Change admin password |
| `POST` | `/api/bookings` | No | Create booking |
| `GET` | `/api/bookings/availability?date=YYYY-MM-DD` | No | Available time slots |
| `GET` | `/api/bookings` | Admin | List bookings |
| `PATCH` | `/api/bookings/:id` | Admin | Update booking status |

---

## Local Development

### Prerequisites

- **Node.js 20+** and npm

```bash
node -v   # should be v20 or higher
```

### Setup

```bash
git clone https://github.com/noumanaziz7241/lumiere-beauty-salon.git
cd lumiere-beauty-salon
npm install
cp .env.example .env
```

### Environment variables

Edit `.env` in the project root:

```env
PORT=3001
CORS_ORIGIN=http://localhost:3000
ADMIN_PASSWORD=lumiere2024
SESSION_SECRET=change-me-in-production
```

| Variable | Description |
|----------|-------------|
| `PORT` | API server port (default `3001`) |
| `CORS_ORIGIN` | Frontend origin for CORS (default `http://localhost:3000`) |
| `ADMIN_PASSWORD` | Initial admin password (hashed on first run) |
| `SESSION_SECRET` | Reserved for future session hardening |
| `DATABASE_URL` | PostgreSQL connection string (required) |
| `DATABASE_SSL` | Set `true` for cloud Postgres (Railway, Neon, Supabase) |

**Full technical documentation:** [docs/README.md](docs/README.md)

### Run (recommended)

Start PostgreSQL, then frontend + API:

```bash
npm run db:up        # Docker Postgres on :5432 (first time)
cp .env.example .env
npm run dev:full
```

| URL | Service |
|-----|---------|
| [http://localhost:3000](http://localhost:3000) | Public site + admin UI |
| [http://localhost:3000/admin](http://localhost:3000/admin) | Admin login |
| [http://localhost:3001/api/health](http://localhost:3001/api/health) | API health check |

**Default admin password:** `lumiere2024` (override with `ADMIN_PASSWORD` in `.env` before first run)

### Run separately

```bash
# Terminal 1 — API
npm run server

# Terminal 2 — Frontend (proxies /api → :3001)
npm run dev
```

> **Note:** PostgreSQL must be running and `DATABASE_URL` set in `.env`. Use `npm run db:up` for local Docker Postgres. Running only `npm run dev` without the API will show a connection error.

---

## Project Structure

```
lumiere-beauty-salon/
├── server/                 # Express API
│   ├── index.ts            # App entry, routes, static serving in prod
│   ├── db/
│   │   ├── schema.sql      # Complete SQL schema (source of truth)
│   │   ├── connection.ts   # PostgreSQL pool + migrations
│   │   ├── seed.ts         # Seed & legacy JSON import
│   │   └── repositories/   # config, bookings, admin data access
│   ├── routes/             # auth, config, bookings
│   └── store/              # Store facade over repositories
├── docker-compose.yml      # Local PostgreSQL for development
├── docs/
│   └── DATABASE.md         # Schema reference & ER diagram
├── src/
│   ├── api/client.ts       # Frontend API client (all HTTP calls)
│   ├── context/            # SalonConfigContext (API-backed state)
│   ├── components/         # Public UI sections
│   ├── admin/              # Admin login + dashboard
│   ├── config/defaults.ts  # Default salon content + types
│   └── pages/HomePage.tsx
├── data/                   # Legacy JSON import only (gitignored)
└── dist/                   # Production frontend build
```

---

## Production

Build the frontend and run the unified server (serves `dist/` + API):

```bash
npm run build
npm start
```

Set `NODE_ENV=production` and configure `CORS_ORIGIN` to your production domain.

> **Important:** A static-only deploy (Vercel/Netlify with `dist` only) will **not** run the API or persist bookings. Use a Node host (Railway, Render, Fly.io, VPS, etc.) with `npm run build && npm start`, or deploy frontend and API separately with `CORS_ORIGIN` pointing to the frontend URL.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run db:up` | Start local PostgreSQL (Docker) |
| `npm run db:down` | Stop local PostgreSQL |
| `npm run dev` | Frontend only (port 3000) |
| `npm run server` | API only (port 3001) |
| `npm run dev:full` | Frontend + API together |
| `npm run build` | Build frontend to `dist/` |
| `npm start` | Production: API + static files |
| `npm run lint` | TypeScript check |
| `npm run preview` | Preview built frontend (no API) |

---

## Troubleshooting

### "Unable to connect" on the website

The API is not running, or PostgreSQL is not available. Run `npm run db:up`, then `npm run dev:full`.

### Admin login fails

- Default password is `lumiere2024`
- If you changed `ADMIN_PASSWORD` in `.env` **after** first run, delete `data/admin.json` and restart the server so it re-seeds from `.env`

### Tailwind / native binding errors

Upgrade to Node 20+ and reinstall:

```bash
nvm install 20 && nvm use 20
rm -rf node_modules package-lock.json
npm install
```

---

## License

MIT License.

---

<div align="center">
  <p>Crafted with care for the world of beauty.</p>
</div>
