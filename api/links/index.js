const crypto = require('crypto');
const {
  FieldValue,
  getCreatorId,
  getDb,
  methodNotAllowed,
  ownedLink,
  sendJson
} = require('../_firebase');

const MAX_LINKS = 2;
const defaults = {
  question: 'Will you go on a date with me?',
  yesText: 'Yes!!!',
  noText: 'No',
  finalText: 'Yayyyyyyyy!!! Finally',
  finalButtonText: "Let's Fix a date",
  dialCode: '+91'
};

function clean(value, fallback, maxLength) {
  const text = typeof value === 'string' ? value.trim() : '';
  return (text || fallback).slice(0, maxLength);
}

function validate(body) {
  const input = body && typeof body === 'object' ? body : {};
  const name = clean(input.name, '', 50);
  const question = clean(input.question, defaults.question, 180);
  const yesText = clean(input.yesText, defaults.yesText, 40);
  const noText = clean(input.noText, defaults.noText, 40);
  const finalText = clean(input.finalText, defaults.finalText, 180);
  const finalButtonText = clean(input.finalButtonText, defaults.finalButtonText, 50);
  const dialCode = clean(input.dialCode, defaults.dialCode, 5).replace(/\s/g, '');
  const phone = clean(input.phone, '', 15).replace(/\D/g, '');

  if (!/^\+?\d{1,4}$/.test(dialCode)) throw new Error('Enter a valid country dial code, such as +91.');
  if (!/^\d{6,15}$/.test(phone)) throw new Error('Enter a valid phone number using digits only.');

  return { name, question, yesText, noText, finalText, finalButtonText, dialCode, phone };
}

async function createUniqueLink(db, ownerId, data) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = `d-${crypto.randomBytes(5).toString('hex')}`;
    const ref = db.collection('dateLinks').doc(slug);
    try {
      await ref.create({
        ...data,
        slug,
        ownerId,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
      return slug;
    } catch (error) {
      if (error.code !== 6 && error.code !== 'already-exists') throw error;
    }
  }
  throw new Error('Could not create a unique link. Please try again.');
}

module.exports = async function handler(req, res) {
  try {
    const ownerId = getCreatorId(req, res);
    const db = getDb();
    const collection = db.collection('dateLinks');

    if (req.method === 'GET') {
      const snapshot = await collection.where('ownerId', '==', ownerId).get();
      const links = snapshot.docs
        .map((doc) => ownedLink(doc.data()))
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      return sendJson(res, 200, { links, limit: MAX_LINKS, canCreate: links.length < MAX_LINKS });
    }

    if (req.method === 'POST') {
      const snapshot = await collection.where('ownerId', '==', ownerId).get();
      if (snapshot.size >= MAX_LINKS) {
        return sendJson(res, 403, { error: 'You have reached the free limit of 2 links.' });
      }

      let data;
      try {
        data = validate(req.body);
      } catch (error) {
        return sendJson(res, 400, { error: error.message });
      }

      const slug = await createUniqueLink(db, ownerId, data);
      return sendJson(res, 201, {
        link: { ...data, slug },
        url: `/${slug}`,
        remaining: MAX_LINKS - snapshot.size - 1
      });
    }

    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { error: 'The link service is not configured yet. Add Firebase Admin variables in Vercel.' });
  }
};
