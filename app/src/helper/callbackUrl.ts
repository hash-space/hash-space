export function getCallbackUrl() {
  return location.href.indexOf('localhost') !== -1
    ? `http://localhost:3000`
    : `https://${location.host}`;
}
