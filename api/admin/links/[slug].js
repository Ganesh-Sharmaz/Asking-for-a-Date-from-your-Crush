const { getDb, sendJson } = require('../../_firebase');
const { requireAdmin } = require('../../_admin');

module.exports = async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  const slug = String(req.query?.slug || '').toLowerCase();
  if (!/^d-[a-z0-9]+$/.test(slug)) return sendJson(res, 400, { error: 'Invalid link.' });
  try {
    const ref = getDb().collection('dateLinks').doc(slug);
    if (!(await ref.get()).exists) return sendJson(res, 404, { error: 'Link not found.' });
    if (req.method !== 'DELETE') return res.status(405).setHeader('Allow', 'DELETE').json({ error: 'Method not allowed.' });
    await ref.delete();
    return sendJson(res, 200, { deleted: true, slug });
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { error: 'Unable to remove this link.' });
  }
};
