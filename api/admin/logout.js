const { clearSession } = require('../_admin');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).setHeader('Allow', 'POST').json({ error: 'Method not allowed.' });
  clearSession(res);
  return res.status(200).json({ authenticated: false });
};
