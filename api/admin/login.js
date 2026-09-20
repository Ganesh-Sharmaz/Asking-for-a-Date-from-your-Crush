const { createSession, setSessionCookie } = require('../_admin');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).setHeader('Allow', 'POST').json({ error: 'Method not allowed.' });
  const { username, password } = req.body || {};
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return res.status(503).json({ error: 'Admin environment variables are not configured.' });
  }
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect username or password.' });
  }
  setSessionCookie(res, createSession(username));
  return res.status(200).json({ authenticated: true });
};
