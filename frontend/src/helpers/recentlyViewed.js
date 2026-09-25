// Recently-viewed articles: per-browser localStorage list (REQ-061, REQ-062).
//
// Available to anonymous and logged-in visitors alike, keyed only by the
// browser's storage — not tied to any account. Capped at MAX_ENTRIES,
// most-recent-first, with re-views moving an existing entry to the top
// instead of duplicating it. Both functions are defensive about
// localStorage being unavailable or containing corrupt data: neither ever
// throws, and a failure is treated the same as an empty list.

const STORAGE_KEY = "conduit:recentlyViewedArticles";
const MAX_ENTRIES = 5;

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordView(article) {
  const { slug, title, author } = article || {};
  if (!slug || !title) return;

  try {
    const withoutThisSlug = getRecentlyViewed().filter(
      (entry) => entry.slug !== slug,
    );

    const entry = {
      slug,
      title,
      authorUsername: author?.username,
    };

    const updated = [entry, ...withoutThisSlug].slice(0, MAX_ENTRIES);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable (private browsing, quota exceeded, disabled)
    // — recording a view is a best-effort side effect, never a failure.
  }
}
