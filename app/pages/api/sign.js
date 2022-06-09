const { signSteps } = require('../../src/api/shared');
export default async function handler(req, res) {
  let privateKey = process.env.PRIV_KEY_BACKEND;
  const payload = await signSteps(
    req.query.steps,
    req.query.lastTimeSync,
    privateKey
  );

  res.status(200).json(payload);
}
