const { getDb } = require('../../_firebase');
const { ownedLink, sendJson } = require('../../_firebase');
const { requireAdmin } = require('../../_admin');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).setHeader('Allow', 'GET').json({ error: 'Method not allowed.' });
  if (!requireAdmin(req, res)) return;
  try {
    const snapshot = await getDb().collection('dateLinks').get();
    const links = snapshot.docs.map((doc) => ownedLink(doc.data(), true)).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return sendJson(res, 200, { links, total: links.length });
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { error: 'Unable to load saved links.' });
  }
};
