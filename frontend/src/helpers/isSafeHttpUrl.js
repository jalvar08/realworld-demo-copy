// REQ-063: a stored profile link is only ever rendered as a clickable link
// when it is an absolute http(s) URL. This blocks `javascript:`/`data:`/
// relative-path values (and anything else) from being handed to an <a href>,
// which would otherwise let a profile owner run script in a visitor's
// session when clicked (React 18 does not sanitize `javascript:` hrefs on
// its own - it only logs a dev-mode warning).
const HTTP_URL_PATTERN = /^https?:\/\//i;

function isSafeHttpUrl(value) {
  if (typeof value !== "string") return false;

  return HTTP_URL_PATTERN.test(value.trim());
}

export default isSafeHttpUrl;
