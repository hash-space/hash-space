// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { oauth2Client, getCallbackUrl } = require('../../src/api/shared');
const Cookies = require('cookies');
const url = require('url');

const scopes = ['https://www.googleapis.com/auth/fitness.activity.read'];

export default function handler(req, res) {
  const cookies = new Cookies(req, res);
  const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
  const authorizeUrl = oauth2Client.generateAuthUrl({
    scope: scopes.join(' '),
    redirect_uri: getCallbackUrl(req),
  });
  cookies.set('lastSync', qs.get('lastSync'), {
    httpOnly: true,
  });
  cookies.set('redirectUrl', qs.get('redirectUrl'), {
    httpOnly: true,
  });
  res.redirect(authorizeUrl);
}
