const crypto = require('crypto');

const SESSION_COOKIE = 'date_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function readCookie(req, name) {
  const cookies = req.headers.cookie || '';
  const match = cookies.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function secret() {
  if (!process.env.ADMIN_SESSION_SECRET) throw new Error('ADMIN_SESSION_SECRET is not configured.');
  return process.env.ADMIN_SESSION_SECRET;
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}

function createSession(username) {
  const payload = Buffer.from(JSON.stringify({ username, exp: Date.now() + SESSION_TTL_SECONDS * 1000 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function getSession(req) {
  const token = readCookie(req, SESSION_COOKIE);
  if (!token) return null;
  const [payload, signature] = token.split('.');
  const expected = payload ? Buffer.from(sign(payload)) : Buffer.alloc(0);
  const provided = signature ? Buffer.from(signature) : Buffer.alloc(0);
  if (!payload || !signature || provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

function setSessionCookie(res, value, maxAge = SESSION_TTL_SECONDS) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`);
}

function clearSession(res) {
  setSessionCookie(res, '', 0);
}

function requireAdmin(req, res) {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ error: 'Admin authentication required.' });
    return null;
  }
  return session;
}

module.exports = { clearSession, createSession, getSession, requireAdmin, setSessionCookie };
