const {
  oauth2Client,
  getCallbackUrl,
  findBestResult,
  formatData,
} = require('../../src/api/shared');
const url = require('url');
const Cookies = require('cookies');

export default async function handler(req, res) {
  const cookies = new Cookies(req, res);
  const lastSync = cookies.get('lastSync');
  const lastSyncParsed = parseInt(lastSync);
  let result;
  try {
    if (isNaN(lastSyncParsed)) {
      throw new Error('not a number');
    }
    const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
    const tokenRes = await oauth2Client.getToken({
      code: qs.get('code'),
      redirect_uri: getCallbackUrl(req),
    });
    oauth2Client.credentials = tokenRes.tokens;

    result = await findBestResult(lastSyncParsed);
  } catch (e) {
    console.log(e);
    res.redirect('/?error=error1');
    return;
  }

  if (!result) {
    res.redirect('/?error=error2');
    return;
  }

  res.redirect('/?steps=' + formatData(result.bucket).totalStepsToday);
}
