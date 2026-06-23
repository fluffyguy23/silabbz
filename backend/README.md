# SI Labbz — Backend API

Zero-dependency **Vercel serverless functions**. No build step.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/contact` | Receives a project enquiry (name, email, phone, company, details). Validates and optionally emails it. |
| `GET`  | `/api/health`  | Health/uptime check. |

### `POST /api/contact`

Request body (JSON):

```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "phone": "+1 555 000 0000",
  "company": "Acme Inc.",
  "details": "We need a POS + mobile app."
}
```

Response: `{ "ok": true, "delivered": true|false }` (200), or `{ "ok": false, "error": "..." }` (400/405).

## Environment variables (set in Vercel → Project → Settings → Environment Variables)

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `RESEND_API_KEY` | optional | — | Enables email delivery via [Resend](https://resend.com). Without it, enquiries are validated + logged and the API still returns `ok`. |
| `CONTACT_TO` | optional | `silabbz1@gmail.com` | Where enquiries are emailed. |
| `CONTACT_FROM` | optional | `SI Labbz <onboarding@resend.dev>` | Use a verified domain sender once your domain is set up in Resend. |
| `ALLOWED_ORIGIN` | optional | `*` | Lock CORS to your site, e.g. `https://silabbz.com`. |

> Email is optional by design so the site works the instant it deploys. Add `RESEND_API_KEY` later to start receiving emails — no code change needed.

## Local dev

```bash
cd backend
npm i -g vercel    # if not installed
vercel dev         # serves /api locally
```

## Deploy (separate Vercel project)

Deploy this folder as its **own** Vercel project with **Root Directory = `backend`**.
Suggested domain: `api.silabbz.com`. See the root `README.md` for the full walkthrough.
