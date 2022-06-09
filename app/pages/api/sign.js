const { signSteps } = require('../../src/api/shared');
export default async function handler(req, res) {
  if (req.query.secret !== process.env.FAUCET_SECRET) {
    throw new Error('upps');
  }
  let privateKey = process.env.PRIV_KEY_BACKEND;
  const payload = await signSteps(
    req.query.steps,
    req.query.lastTimeSync,
    privateKey
  );
  res.redirect(
    `${req.headers.host.indexOf('localhost') !== -1 ? 'http' : 'https'}://${
      req.headers.host
    }/?steps=${payload}`
  );
}
