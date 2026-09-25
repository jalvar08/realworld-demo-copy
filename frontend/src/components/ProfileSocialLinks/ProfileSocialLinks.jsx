// REQ-057/REQ-058: renders a profile's optional external links. Renders
// nothing at all (not even an empty container) when none are set.
function ProfileSocialLinks({ github, twitter, website }) {
  if (!website && !github && !twitter) return null;

  return (
    <ul className="profile-social-links">
      {website && (
        <li>
          <a href={website}>Website</a>
        </li>
      )}
      {github && (
        <li>
          <a href={github}>GitHub</a>
        </li>
      )}
      {twitter && (
        <li>
          <a href={twitter}>Twitter</a>
        </li>
      )}
    </ul>
  );
}

export default ProfileSocialLinks;
