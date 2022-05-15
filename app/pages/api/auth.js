// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { oauth2Client, getCallbackUrl } = require('../../src/api/shared');

const scopes = ['https://www.googleapis.com/auth/fitness.activity.read'];

export default function handler(req, res) {
  const authorizeUrl = oauth2Client.generateAuthUrl({
    scope: scopes.join(' '),
    redirect_uri: getCallbackUrl(req),
  });
  res.redirect(authorizeUrl);
}
