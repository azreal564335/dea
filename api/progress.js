// Vercel Serverless Function: /api/progress
// Syncs family learning progress to Vercel KV / Upstash Redis via REST API.
// Required env vars on Vercel: KV_REST_API_URL, KV_REST_API_TOKEN

function hashPin(pin) {
  let h = 2166136261;
  const str = String(pin || '');
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

async function redisFetch(path, options = {}) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  return res.json();
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return res.status(501).json({
      ok: false,
      error: 'REDIS_NOT_CONFIGURED',
      message: '尚未在 Vercel 連接 Redis / Upstash KV，請先改用「匯出進度代碼」或設定 KV 環境變數。'
    });
  }

  try {
    if (req.method === 'GET') {
      const code = String(req.query.code || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
      const pin = String(req.query.pin || '').trim();
      if (!code || code.length < 3 || !pin) {
        return res.status(400).json({ ok: false, error: 'INVALID_PARAMS' });
      }
      const key = `dea:family:${code}`;
      const resp = await redisFetch(`/get/${encodeURIComponent(key)}`);
      if (!resp || !resp.result) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND' });
      }
      const record = JSON.parse(resp.result);
      if (record.pinHash !== hashPin(pin)) {
        return res.status(403).json({ ok: false, error: 'WRONG_PIN' });
      }
      return res.status(200).json({ ok: true, data: record.data, updatedAt: record.updatedAt });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const code = String(body.code || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
      const pin = String(body.pin || '').trim();
      const data = body.data;
      if (!code || code.length < 3 || !pin || !data || !data.profiles) {
        return res.status(400).json({ ok: false, error: 'INVALID_PAYLOAD' });
      }
      const key = `dea:family:${code}`;
      const existing = await redisFetch(`/get/${encodeURIComponent(key)}`);
      if (existing && existing.result) {
        const prev = JSON.parse(existing.result);
        if (prev.pinHash !== hashPin(pin)) {
          return res.status(403).json({ ok: false, error: 'WRONG_PIN' });
        }
      }
      const payload = JSON.stringify({
        pinHash: hashPin(pin),
        updatedAt: new Date().toISOString(),
        data
      });
      await redisFetch(`/set/${encodeURIComponent(key)}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return res.status(200).json({ ok: true, updatedAt: new Date().toISOString() });
    }

    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'SERVER_ERROR', message: err.message });
  }
};
