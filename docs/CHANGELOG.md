# Changelog

## 2026-06-27

### Admin password bootstrap fix (Railway)
- `ensureAdminUser()` runs on every startup — creates missing `admin_users` row from `ADMIN_PASSWORD`
- `ADMIN_PASSWORD_RESET=true` one-time sync when password was seeded before env was set
- Docs: DEPLOYMENT.md admin + Vercel troubleshooting

### Production deploy — Railway healthcheck fix
- Moved `tsx` to production dependencies (fixes `npm start` on Railway)
- Server listens on `0.0.0.0` before DB init so `/api/health` responds during startup
- Auto-enable PostgreSQL SSL for Railway/Neon/Supabase URLs
- Docs updated: DEPLOYMENT.md, CHANGELOG.md

### Production deploy — Vercel fix & Railway support
- Added `VITE_API_URL` for split deploy (Vercel frontend + Railway/Render API)
- Production connection error no longer shows local `npm run db:up` hints
- `COOKIE_SAME_SITE=none` for cross-origin admin sessions on split deploy
- Added `vercel.json`, `railway.toml`, and expanded `docs/DEPLOYMENT.md` (URL change, full-stack Railway)
- Docs updated: DEPLOYMENT.md, CHANGELOG.md

### Gallery — user composites & admin upload fix
- Replaced `ba-makeup.jpg` and `ba-hair.jpg` with user-provided before/after composites
- Fixed gallery startup migration resetting admin add/remove edits on server restart (one-time `gallery_defaults_v2` migration)
- Gallery admin panel shows unsaved-changes reminder until Save All is clicked
- Docs updated: CHANGELOG.md, ADMIN-PORTAL.md

### Gallery — fixed before/after composites
- Rebuilt `ba-makeup.jpg` with same kaboompics model, both front-facing (lipstick application → finished glam); avoids mirror/profile angle mismatch
- Rebuilt `ba-hair.jpg` with same cottonbro salon client: natural hair before service → finished blow-dry (same left profile)
- Removed temporary `c_*.jpg` candidate files from `public/images/gallery/`
- Docs updated: CHANGELOG.md

### Gallery — style refresh category & true before/after
- New `style-refresh` gallery category; moved colour transformation and glossy waves images there
- Rebuilt before/after composites using same-person Pexels series (makeup + cottonbro salon hair)
- Gallery filter bar, admin category picker, and DB migration updated
- Docs updated: FRONTEND.md, CHANGELOG.md

### Cursor agents, rules, and skills
- Added `AGENTS.md` playbook and `docs/CURSOR-AGENTS.md` full guide
- Project rules: `portfolio-quality`, `api-security`, `react-frontend`, `database-migrations`
- Project skills: `lumiere-security-review`, `lumiere-deploy`, `lumiere-e2e-tests`, `lumiere-gallery-images`, `lumiere-roadmap-feature`
- Docs updated: CURSOR-AGENTS.md, README.md, CHANGELOG.md

### Gallery photos & README admin password
- Replaced broken remote Unsplash URLs with 12 curated local images in `public/images/gallery/` (800×1000, 4:5 crop)
- Re-curated all gallery photos via Pexels — ladies-only bridal, hair, makeup, salon, and facial images only
- Startup migration upgrades databases still using legacy `images.unsplash.com` gallery URLs
- README quick-start table now shows admin login URL with default password `lumiere2024`
- Docs updated: FRONTEND.md, CHANGELOG.md

### Experience features (PWA, chat, visit duration, gift vouchers, accessibility)
- PWA manifest + service worker for Add to Home Screen on phones
- Admin-configurable live chat: WhatsApp FAB (default) or Tawk.to
- Estimated visit duration when 2+ services selected in catalog and booking
- Gift voucher purchase flow with admin activation and code verification
- Accessibility toolbar: larger text and high contrast modes (saved in browser)
- Docs updated: BACKEND-API.md, FRONTEND.md, ADMIN-PORTAL.md, DATABASE.md, CHANGELOG.md

### Marketing features batch (email, gallery, packages, Google reviews, FAQ, promotions)
- Automatic email notifications via Gmail SMTP when bookings are created (salon + client) and when admin confirms (client)
- Admin-managed promotion banner, FAQ, bridal/party packages, photo gallery, and Google reviews section
- Gallery image upload (`POST /api/upload/gallery`) with static serving at `/uploads`
- Bridal packages page with “Book this package” pre-filling services in the booking form
- New admin tabs: Marketing, Packages, Gallery, FAQ
- Vite dev proxy for `/uploads`; SMTP env vars in `.env.example`
- Docs updated: BACKEND-API.md, FRONTEND.md, DATABASE.md, ADMIN-PORTAL.md, ARCHITECTURE.md

### Repeat client discount & admin booking window
- 10% discount for returning clients (prior confirmed booking on same phone)
- Admin bookings list defaults to last 20 days by preferred date

### WhatsApp booking (free wa.me flow)
- Book Online and Book via WhatsApp both save via API; in-page QR/message panel for salon and client
