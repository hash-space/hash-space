const { google } = require('googleapis');
const fitness = google.fitness('v1');

let keys = JSON.parse(process.env.CREDS).web;

/**
 * Create a new OAuth2 client with the configured keys.
 */
export const oauth2Client = new google.auth.OAuth2(
  keys.client_id,
  keys.client_secret
);

google.options({ auth: oauth2Client });

async function getDataSourceIds() {
  const dataSources = await fitness.users.dataSources.list({
    userId: 'me',
  });
  return dataSources.data.dataSource
    .filter(
      (item) =>
        item.dataType.name === 'com.google.step_count.delta' ||
        item.dataType.name === 'com.google.step_count.cumulative'
    )
    .map((item) => item.dataStreamId);
}

export function formatData(bucket) {
  const entries = bucket.map((a) => ({
    startTimeMillis: new Date(a.startTimeMillis * 1).toISOString(),
    endTimeMillis: new Date(a.endTimeMillis * 1).toISOString(),
    val: a.dataset?.[0].point?.[0]?.value?.[0]?.intVal || 0,
  }));
  return {
    entries,
    totalStepsToday: entries.reduce((acc, item) => acc + item.val, 0),
  };
}

async function getStepData(dataSourceId, startTimestamp) {
  const res = await fitness.users.dataset.aggregate({
    userId: 'me',
    requestBody: {
      aggregateBy: [
        {
          dataSourceId,
        },
      ],
      bucketByTime: {
        durationMillis: 3600000,
      },
      endTimeMillis: new Date().getTime(),
      startTimeMillis: startTimestamp * 1000,
    },
  });
  return res.data;
}

export async function findBestResult(startTimestamp) {
  const dataSourceIds = await getDataSourceIds();
  let todaysSteps = 0;
  let result;
  for (const id of dataSourceIds) {
    const res = await getStepData(id, startTimestamp);
    const resFormatted = formatData(res.bucket);
    if (resFormatted.totalStepsToday > todaysSteps) {
      result = res;
      todaysSteps = resFormatted.totalStepsToday;
    }
  }
  return result;
}

export function getCallbackUrl(req) {
  return req.headers.host.indexOf('localhost') !== -1
    ? `http://localhost:3000/api/result`
    : `https://steps-app.vercel.app/api/result`;
}
