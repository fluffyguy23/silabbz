# SI Labbz — Website

Marketing site for **SI Labbz**, split into two independent, Vercel-ready projects.

```
silabbz-website/
├── frontend/        # Static site (HTML + CSS + vanilla JS) — premium dark theme
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── vercel.json  # clean URLs + security headers
└── backend/         # Vercel serverless API (zero dependencies)
    ├── api/
    │   ├── contact.js   # POST /api/contact
    │   └── health.js    # GET  /api/health
    ├── package.json
    └── README.md
```

The frontend works **standalone** — if the backend isn't reachable, the contact form
gracefully falls back to opening WhatsApp with the details pre-filled. Wire up the
backend (below) to receive enquiries by email instead.

---

## Run locally

**Frontend** (static):

```bash
cd frontend
python3 -m http.server 8099    # → http://localhost:8099
```

**Backend** (serverless):

```bash
cd backend
npm i -g vercel
vercel dev                     # serves /api/* locally
```

---

## Deploy to Vercel (recommended: two projects, one repo)

Deploy `frontend/` and `backend/` as **two separate Vercel projects** from this same repo.

### 1. Frontend → `silabbz.com`
1. Vercel → **Add New… → Project** → import this Git repo.
2. **Root Directory:** `frontend`  ·  **Framework Preset:** *Other*  ·  no build command.
3. Deploy, then **Settings → Domains** → add `silabbz.com` and `www.silabbz.com`.
4. Point your domain's DNS at Vercel:
   - `A` record `@` → `76.76.21.21`
   - `CNAME` `www` → `cname.vercel-dns.com`
   (Vercel shows the exact records to use under the domain settings.)

### 2. Backend → `api.silabbz.com`
1. Vercel → **Add New… → Project** → import the **same** repo again.
2. **Root Directory:** `backend`.
3. **Settings → Environment Variables** (all optional — see `backend/README.md`):
   - `RESEND_API_KEY` — enables emailing enquiries to `silabbz1@gmail.com`
   - `CONTACT_TO`, `CONTACT_FROM`, `ALLOWED_ORIGIN` (`https://silabbz.com`)
4. Deploy, then add the domain `api.silabbz.com` (CNAME → `cname.vercel-dns.com`).

### 3. Connect them
In `frontend/script.js`, set:

```js
const API_BASE = 'https://api.silabbz.com';
```

Commit & redeploy the frontend. Done — the form now posts to your backend.

> **Single-project alternative:** if you'd rather deploy one project, leave
> `API_BASE = ''`, move `backend/api/` to the repo root as `api/`, and set the
> project root to `frontend` with the API alongside. The two-project layout above
> keeps frontend and backend cleanly separated and is the recommended setup.

---

## Customising

- **Theme / colors:** CSS variables in `:root` at the top of `frontend/styles.css`.
- **Contact details:** WhatsApp `+92 317 4494381` and email `silabbz1@gmail.com`
  live in `frontend/index.html`, `frontend/script.js` (`WHATSAPP_NUMBER`, `CONTACT_EMAIL`),
  and `backend/api/contact.js`.
- **SEO:** update the placeholder `https://silabbz.com/` URLs in `index.html` once live.
