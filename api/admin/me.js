const { requireAdmin } = require('../_admin');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).setHeader('Allow', 'GET').json({ error: 'Method not allowed.' });
  const session = requireAdmin(req, res);
  if (!session) return;
  return res.status(200).json({ authenticated: true, username: session.username, expiresAt: session.exp });
};
