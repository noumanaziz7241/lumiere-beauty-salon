# Deployment

## Local development

```bash
npm install
cp .env.example .env   # set DATABASE_URL, optional SMTP
npm run db:up
npm run dev            # web :3000, API :3001
```

Admin: http://localhost:3000/admin

## Production

```bash
npm run build
npm start              # serves API; serve dist/ via reverse proxy or static middleware
```

Ensure `uploads/gallery/` is writable and persisted. Set production SMTP and `SESSION_SECRET`.

## Gmail SMTP

1. Enable 2FA on Google account
2. Create App Password at https://myaccount.google.com/apppasswords
3. Set `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` in `.env`
