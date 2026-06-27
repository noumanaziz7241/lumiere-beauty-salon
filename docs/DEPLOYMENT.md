# Deployment

## Why Vercel shows "Unable to connect"

This app is **not** a static site. It needs:

1. **Node.js** — Express API (`npm start`)
2. **PostgreSQL** — bookings, config, vouchers

Deploying only the Vite `dist/` folder to Vercel serves HTML/JS but **no `/api` routes**, so the site cannot load salon config.

**Recommended:** deploy the **full stack** to [Railway](https://railway.app) or [Render](https://render.com) (see below).  
**Alternative:** Vercel for frontend + Railway for API (split deploy).

---

## Option A — Full stack on Railway (recommended)

One URL, no CORS issues, admin cookies work out of the box.

### Steps

1. Push this repo to GitHub.
2. [Railway](https://railway.app) → **New Project** → **Deploy from GitHub** → select the repo.
3. Add **PostgreSQL** plugin to the project; Railway sets `DATABASE_URL` automatically.
4. In the web service **Variables**, set:

   | Variable | Value |
   |----------|-------|
   | `NODE_ENV` | `production` |
   | `DATABASE_SSL` | `true` |
   | `CORS_ORIGIN` | `https://YOUR-RAILWAY-URL.up.railway.app` (update after first deploy) |
   | `ADMIN_PASSWORD` | strong secret (not `lumiere2024`) |
   | `SESSION_SECRET` | long random string |
   | `APP_URL` | same as `CORS_ORIGIN` |

5. Deploy. Railway uses `railway.toml`: `npm run build` then `npm start`.
6. Open `https://YOUR-URL.up.railway.app/api/health` — should return `{"status":"ok",...}`.
7. Visit the root URL — public site and `/admin` should work.

### Custom domain (change public URL)

Railway → your service → **Settings** → **Networking** → **Custom Domain** → add e.g. `lumierebeauty.pk`.  
Update `CORS_ORIGIN` and `APP_URL` to match, then redeploy.

---

## Option B — Vercel frontend + Railway API (split)

Use when you want the marketing site on Vercel and the API elsewhere.

### 1. Deploy API on Railway

Same as Option A steps 1–6, but you only need the Railway URL for the API (e.g. `https://lumiere-api.up.railway.app`).

Set:

| Variable | Value |
|----------|-------|
| `CORS_ORIGIN` | `https://your-app.vercel.app` (exact Vercel URL) |
| `COOKIE_SAME_SITE` | `none` (required for cross-origin admin login) |
| `APP_URL` | same as `CORS_ORIGIN` |

### 2. Deploy frontend on Vercel

1. Import the GitHub repo in [Vercel](https://vercel.com).
2. **Environment variables** (Production):

   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://lumiere-api.up.railway.app` (no trailing slash) |

3. Build command: `npm run build` (default). Output: `dist`.
4. Redeploy after setting `VITE_API_URL`.

Admin sessions use cross-origin cookies (`COOKIE_SAME_SITE=none` on the API).

### Change Vercel URL

| Goal | How |
|------|-----|
| Rename `*.vercel.app` subdomain | Vercel → Project → **Settings** → **General** → **Project Name** (e.g. `lumiere-beauty-salon`) |
| Custom domain | **Settings** → **Domains** → add your domain |
| Point to a different Vercel project | Delete old project or disconnect repo; import repo again with the desired name |

After renaming or adding a domain, update Railway `CORS_ORIGIN` and `APP_URL` to the new frontend URL.

---

## Option C — Render

1. **New Web Service** from GitHub.
2. Build: `npm install && npm run build`
3. Start: `npm start`
4. Add **PostgreSQL** from Render dashboard; link `DATABASE_URL`.
5. Set env vars as in Option A.

---

## Local development

```bash
npm install
cp .env.example .env   # set DATABASE_URL, optional SMTP
npm run db:up
npm run dev            # web :3000, API :3001
```

Admin: http://localhost:3000/admin

## Production build (self-hosted / VPS)

```bash
npm run build
npm start              # serves dist/ + /api on PORT (default 3001)
```

Ensure `uploads/gallery/` is writable and persisted. Set production SMTP and `SESSION_SECRET`.

Use nginx/Caddy as reverse proxy with HTTPS; set `CORS_ORIGIN` to your public URL.

## Gmail SMTP

1. Enable 2FA on Google account
2. Create App Password at https://myaccount.google.com/apppasswords
3. Set `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` in env

## Environment reference

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DATABASE_SSL` | Cloud DB | `true` for Railway/Neon/Supabase |
| `ADMIN_PASSWORD` | Yes | Change from default in production |
| `SESSION_SECRET` | Yes | Long random string |
| `CORS_ORIGIN` | Prod | Exact public site URL (scheme + host) |
| `APP_URL` | Prod | Same as public site URL (emails, links) |
| `VITE_API_URL` | Split only | API base URL at **build** time (Vercel) |
| `COOKIE_SAME_SITE` | Split only | `none` when frontend and API differ |
| `PORT` | Optional | Default `3001`; Railway sets automatically |
