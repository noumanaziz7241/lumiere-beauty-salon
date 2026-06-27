# Cursor Agents — Lumière Beauty Salon

This repo includes project-specific **rules**, **skills**, and recommended **agent workflows** for building and polishing the portfolio.

## Quick start

| Goal | What to use |
|------|-------------|
| Implement a roadmap item | `@lumiere-roadmap-feature` skill + **Plan mode** for large items |
| Security check before publish | `@lumiere-security-review` skill or **Security Review** subagent |
| Code quality before PR | **Bugbot** subagent |
| Deploy to production | `@lumiere-deploy` skill |
| Add E2E tests | `@lumiere-e2e-tests` skill |
| Fix gallery photos | `@lumiere-gallery-images` skill + **Browser** |
| Explore unfamiliar code | **Explore** subagent |

## Project skills (`.cursor/skills/`)

Invoke with `@skill-name` in chat:

| Skill | Use when |
|-------|----------|
| `lumiere-security-review` | Reviewing auth, uploads, bookings, vouchers before portfolio publish |
| `lumiere-deploy` | Deploying to Railway/Render/VPS with PostgreSQL |
| `lumiere-e2e-tests` | Adding Playwright tests for booking + admin flows |
| `lumiere-gallery-images` | Curating ladies-only salon photos for the gallery |
| `lumiere-roadmap-feature` | Implementing items from `docs/ROADMAP.md` |

## Always-on rules (`.cursor/rules/`)

| Rule | Scope |
|------|-------|
| `update-documentation.mdc` | Keep `docs/` in sync on every feature change |
| `portfolio-quality.mdc` | Portfolio standards (tests, demo, README, no secrets) |
| `api-security.mdc` | `server/**/*.ts` — auth, validation, rate limits |
| `react-frontend.mdc` | `src/**/*.tsx` — Tailwind, context, API client patterns |
| `database-migrations.mdc` | `server/db/**` — schema, seed, migrations |

## Recommended agent workflow

```
Plan (large features) → Explore (map code) → Agent (implement)
  → npm run lint → Bugbot → Security Review → update docs/CHANGELOG.md
```

## Built-in Cursor subagents

| Subagent | When |
|----------|------|
| **Explore** | Finding routes, repos, components across the monorepo |
| **Shell** | CI/CD, Docker, `pg_dump`, GitHub Actions |
| **Bugbot** | Pre-PR logic and quality review |
| **Security Review** | Pre-publish security audit |
| **CI Investigator** | Debugging failed GitHub Actions checks |
| **Best-of-N runner** | Trying multiple UI/layout options in isolation |

## Portfolio priority backlog

See `docs/ROADMAP.md`. Recommended order for portfolio impact:

1. Live demo + README screenshots
2. SEO meta + `LocalBusiness` schema + sitemap
3. Admin dashboard stats + export bookings CSV
4. Playwright E2E (booking + admin login)
5. Gift voucher at checkout
6. Rate limiting on public POST routes

Full guide: [docs/CURSOR-AGENTS.md](docs/CURSOR-AGENTS.md)
