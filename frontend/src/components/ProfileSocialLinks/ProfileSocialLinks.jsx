import isSafeHttpUrl from "../../helpers/isSafeHttpUrl";

// REQ-057/REQ-058: renders a profile's optional external links. Renders
// nothing at all (not even an empty container) when none are set.
//
// REQ-063: a stored value is only ever rendered as a clickable link when it
// is an absolute http(s) URL (see isSafeHttpUrl) - anything else (e.g. a
// `javascript:`/`data:` value) is silently not rendered as a link, rather
// than being handed to <a href>.
function ProfileSocialLinks({ github, twitter, website }) {
  const safeWebsite = isSafeHttpUrl(website) && website;
  const safeGithub = isSafeHttpUrl(github) && github;
  const safeTwitter = isSafeHttpUrl(twitter) && twitter;

  if (!safeWebsite && !safeGithub && !safeTwitter) return null;

  return (
    <ul className="profile-social-links">
      {safeWebsite && (
        <li>
          <a href={safeWebsite}>Website</a>
        </li>
      )}
      {safeGithub && (
        <li>
          <a href={safeGithub}>GitHub</a>
        </li>
      )}
      {safeTwitter && (
        <li>
          <a href={safeTwitter}>Twitter</a>
        </li>
      )}
    </ul>
  );
}

export default ProfileSocialLinks;
