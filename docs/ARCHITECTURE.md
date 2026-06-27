# Architecture

## Stack

- **Frontend:** React 19 + Vite + Tailwind, port 3000
- **Backend:** Express + tsx, port 3001
- **Database:** PostgreSQL

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_PASSWORD` | Yes | Admin login |
| `SESSION_SECRET` | Yes | Cookie signing |
| `CORS_ORIGIN` | Dev | Frontend origin |
| `APP_URL` | Optional | Used in links |
| `SMTP_HOST` | Optional | Default `smtp.gmail.com` |
| `SMTP_PORT` | Optional | Default `587` |
| `SMTP_USER` | Optional | Gmail address |
| `SMTP_PASS` | Optional | Gmail app password |
| `SMTP_FROM` | Optional | From header |

Email is skipped gracefully when SMTP is not configured.

## Static uploads

Gallery files: `uploads/gallery/` on disk, served at `/uploads/gallery/*`.
