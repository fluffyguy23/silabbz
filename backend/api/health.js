// GET /api/health — simple uptime/health check for the SI Labbz backend.
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.status(200).json({
    ok: true,
    service: 'silabbz-backend',
    time: new Date().toISOString(),
  });
};
