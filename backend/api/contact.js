// POST /api/contact — receives a project enquiry from the SI Labbz site.
//
// Email delivery is OPTIONAL: set RESEND_API_KEY in your Vercel env to have
// submissions emailed to silabbz1@gmail.com. With no key set, the endpoint
// still validates and returns { ok:true } (and logs the lead), so the site
// works the moment it's deployed.

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Vercel parses JSON bodies automatically, but guard for strings too.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const phone = String(body.phone || '').trim();
  const company = String(body.company || '').trim();
  const details = String(body.details || '').trim();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !emailOk || !details) {
    return res.status(400).json({
      ok: false,
      error: 'Please provide a valid name, email, and project details.',
    });
  }

  let delivered = false;

  if (process.env.RESEND_API_KEY) {
    try {
      const to = process.env.CONTACT_TO || 'silabbz1@gmail.com';
      const from = process.env.CONTACT_FROM || 'SI Labbz <onboarding@resend.dev>';
      const html =
        `<h2 style="font-family:sans-serif">New Project Inquiry — SI Labbz</h2>` +
        `<table style="font-family:sans-serif;font-size:14px;line-height:1.6">` +
        `<tr><td><b>Name</b></td><td>${esc(name)}</td></tr>` +
        `<tr><td><b>Email</b></td><td>${esc(email)}</td></tr>` +
        `<tr><td><b>Phone</b></td><td>${esc(phone || '—')}</td></tr>` +
        `<tr><td><b>Company</b></td><td>${esc(company || '—')}</td></tr>` +
        `</table>` +
        `<p style="font-family:sans-serif;font-size:14px"><b>Project details:</b><br>${esc(details).replace(/\n/g, '<br>')}</p>`;

      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `New inquiry from ${name}`,
          html,
        }),
      });

      delivered = r.ok;
      if (!r.ok) console.error('Resend error:', r.status, await r.text());
    } catch (err) {
      console.error('Email send failed:', err);
    }
  } else {
    console.log('Contact inquiry (set RESEND_API_KEY to enable email):', {
      name, email, phone, company, details,
    });
  }

  return res.status(200).json({ ok: true, delivered });
};
