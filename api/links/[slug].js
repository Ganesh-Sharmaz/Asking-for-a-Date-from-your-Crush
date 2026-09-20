const {
  FieldValue,
  getCreatorId,
  getDb,
  methodNotAllowed,
  ownedLink,
  publicLink,
  sendJson
} = require('../_firebase');

const editableFields = ['name', 'question', 'yesText', 'noText', 'finalText', 'finalButtonText', 'dialCode', 'phone'];

function getSlug(req) {
  return String(req.query?.slug || '').toLowerCase();
}

function cleanUpdate(body) {
  const input = body && typeof body === 'object' ? body : {};
  const result = {};
  for (const field of editableFields) {
    if (typeof input[field] === 'string') result[field] = input[field].trim().slice(0, field === 'question' || field === 'finalText' ? 180 : 60);
  }

  if (result.dialCode && result.dialCode.startsWith('+')) result.dialCode = result.dialCode.slice(1);
  if (result.phone && !/^\d{6,15}$/.test(result.phone)) throw new Error('WhatsApp number must contain digits only and be 6–15 digits long.');
  if (result.dialCode && !/^\d{1,4}$/.test(result.dialCode)) throw new Error('Country dial code must contain digits only.');
  if (result.phone && !/^\d{6,15}$/.test(result.phone)) throw new Error('Enter a valid phone number.');
  if (result.dialCode) result.dialCode = `+${result.dialCode}`;
  if (!Object.keys(result).length) throw new Error('Add at least one field to update.');
  return result;
}

module.exports = async function handler(req, res) {
  const slug = getSlug(req);
  if (!/^d-[a-z0-9]+$/.test(slug)) return sendJson(res, 400, { error: 'Invalid link.' });

  try {
    const db = getDb();
    const ref = db.collection('dateLinks').doc(slug);
    const snapshot = await ref.get();
    if (!snapshot.exists) return sendJson(res, 404, { error: 'This date link does not exist.' });
    const data = snapshot.data();

    if (req.method === 'GET') return sendJson(res, 200, { link: publicLink(data) });

    const creatorId = getCreatorId(req, res);
    if (data.ownerId !== creatorId) return sendJson(res, 403, { error: 'Only the creator can change this link.' });

    if (req.method === 'PATCH') {
      let update;
      try {
        update = cleanUpdate(req.body);
      } catch (error) {
        return sendJson(res, 400, { error: error.message });
      }
      await ref.update({ ...update, updatedAt: FieldValue.serverTimestamp() });
      return sendJson(res, 200, { link: { ...publicLink(data), ...update, slug } });
    }

    if (req.method === 'DELETE') {
      await ref.delete();
      return sendJson(res, 200, { deleted: true });
    }

    return methodNotAllowed(res, ['GET', 'PATCH', 'DELETE']);
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { error: 'Unable to load this date link.' });
  }
};
