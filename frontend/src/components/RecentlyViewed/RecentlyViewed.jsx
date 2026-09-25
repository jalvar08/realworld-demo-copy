import { Link } from "react-router-dom";
import { getRecentlyViewed } from "../../helpers/recentlyViewed";

// REQ-061, REQ-062, US-035: a small "recently viewed" block shown alongside
// Popular Tags, sourced from the visitor's local recently-viewed list.
// Renders nothing when that list is empty.
function RecentlyViewed() {
  const articles = getRecentlyViewed();

  if (articles.length === 0) return null;

  return (
    <div className="sidebar recently-viewed">
      <h6>Recently Viewed</h6>
      <ul>
        {articles.map(({ slug, title, authorUsername }) => (
          <li key={slug}>
            <Link to={`/article/${slug}`}>{title}</Link>
            {authorUsername && ` — ${authorUsername}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentlyViewed;
