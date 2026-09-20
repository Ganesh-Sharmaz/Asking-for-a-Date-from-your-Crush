const crypto = require('crypto');
const { getDb, getCreatorId, sendJson, FieldValue } = require('./_firebase');

const allowedEvents = new Set(['page_view', 'yes_click', 'whatsapp_click']);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).setHeader('Allow', 'POST').json({ error: 'Method not allowed.' });
  const { slug, event } = req.body || {};
  if (!/^d-[a-z0-9]+$/.test(String(slug || '')) || !allowedEvents.has(event)) return sendJson(res, 400, { error: 'Invalid analytics event.' });
  try {
    const visitorId = getCreatorId(req, res);
    const now = new Date();
    const day = now.toISOString().slice(0, 10);
    await getDb().collection('analyticsEvents').doc(crypto.randomUUID()).set({ slug, event, day, visitorHash: crypto.createHash('sha256').update(visitorId).digest('hex'), createdAt: FieldValue.serverTimestamp() });
    return sendJson(res, 204, {});
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { error: 'Analytics unavailable.' });
  }
};
