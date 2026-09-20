const crypto = require('crypto');
const { cert, getApps, initializeApp } = require('firebase-admin/app');
const { FieldValue, getFirestore } = require('firebase-admin/firestore');

function getDb() {
  if (!getApps().length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (!privateKey || !projectId || !clientEmail) {
      throw new Error('Firebase Admin environment variables are not configured.');
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n')
      })
    });
  }

  return getFirestore();
}

function getCookie(req, name) {
  const cookies = req.headers.cookie || '';
  const match = cookies.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function getCreatorId(req, res) {
  let creatorId = getCookie(req, 'date_creator');

  if (!creatorId || !/^[a-f0-9-]{36}$/.test(creatorId)) {
    creatorId = crypto.randomUUID();
    res.setHeader(
      'Set-Cookie',
      `date_creator=${encodeURIComponent(creatorId)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`
    );
  }

  return creatorId;
}

function sendJson(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json').json(payload);
}

function methodNotAllowed(res, methods) {
  res.setHeader('Allow', methods.join(', '));
  sendJson(res, 405, { error: 'Method not allowed.' });
}

function publicLink(data) {
  return {
    slug: data.slug,
    name: data.name || '',
    question: data.question,
    yesText: data.yesText,
    noText: data.noText,
    finalText: data.finalText,
    finalButtonText: data.finalButtonText,
    dialCode: data.dialCode,
    phone: data.phone
  };
}

function ownedLink(data, includePrivate = false) {
  const result = publicLink(data);
  result.createdAt = data.createdAt?.toDate?.()?.toISOString?.() || null;
  result.updatedAt = data.updatedAt?.toDate?.()?.toISOString?.() || null;
  if (includePrivate) result.ownerId = data.ownerId;
  return result;
}

module.exports = {
  FieldValue,
  getCreatorId,
  getDb,
  methodNotAllowed,
  ownedLink,
  publicLink,
  sendJson
};
