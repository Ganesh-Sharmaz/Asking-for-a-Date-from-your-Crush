const { getCreatorId, sendJson } = require('./_firebase');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const creatorId = getCreatorId(req, res);
    return sendJson(res, 200, { ok: true, creatorIdAssigned: Boolean(creatorId) });
  } catch (error) {
    return sendJson(res, 500, { error: 'Unable to initialize your creator session.' });
  }
};
