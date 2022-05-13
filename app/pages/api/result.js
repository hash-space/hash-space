const {
  oauth2Client,
  getCallbackUrl,
  findBestResult,
  formatData,
} = require('./shared');
const url = require('url');

export default async function handler(req, res) {
  let result;
  try {
    const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
    const tokenRes = await oauth2Client.getToken({
      code: qs.get('code'),
      redirect_uri: getCallbackUrl(req),
    });
    oauth2Client.credentials = tokenRes.tokens;

    result = await findBestResult();
  } catch (e) {
    res.status(200).json({
      result: `failed to get data`,
    });
    return;
  }

  if (!result) {
    res.redirect('/?error=error2');
    return;
  }

  res.redirect('/?steps=' + formatData(result.bucket).totalStepsToday);
}
