const { getDb, sendJson } = require('../_firebase');
const { requireAdmin } = require('../_admin');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).setHeader('Allow', 'GET').json({ error: 'Method not allowed.' });
  if (!requireAdmin(req, res)) return;
  try {
    const snapshot = await getDb().collection('analyticsEvents').get();
    const byEvent = { page_view: 0, yes_click: 0, whatsapp_click: 0 };
    const byDay = {};
    const bySlug = {};
    for (const doc of snapshot.docs) {
      const event = doc.data();
      if (byEvent[event.event] !== undefined) byEvent[event.event] += 1;
      const day = event.day || 'unknown';
      byDay[day] = (byDay[day] || 0) + 1;
      if (event.slug) {
        if (!bySlug[event.slug]) bySlug[event.slug] = { pageViews: 0, yesClicks: 0, whatsappClicks: 0 };
        if (event.event === 'page_view') bySlug[event.slug].pageViews += 1;
        if (event.event === 'yes_click') bySlug[event.slug].yesClicks += 1;
        if (event.event === 'whatsapp_click') bySlug[event.slug].whatsappClicks += 1;
      }
    }
    return sendJson(res, 200, { totalEvents: snapshot.size, byEvent, byDay, bySlug });
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { error: 'Unable to load analytics.' });
  }
};
