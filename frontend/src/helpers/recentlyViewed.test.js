import { getRecentlyViewed, recordView } from "./recentlyViewed";

const STORAGE_KEY = "conduit:recentlyViewedArticles";

const article = (slug, title, authorUsername) => ({
  slug,
  title,
  author: authorUsername ? { username: authorUsername } : undefined,
});

beforeEach(() => {
  localStorage.clear();
});

// REQ-061, REQ-062, AC-104, AC-105

it("returns an empty list when nothing has been recorded", () => {
  expect(getRecentlyViewed()).toEqual([]);
});

it("records a view so it appears first in the list", () => {
  recordView(article("hello-world", "Hello World", "jake"));

  expect(getRecentlyViewed()).toEqual([
    { slug: "hello-world", title: "Hello World", authorUsername: "jake" },
  ]);
});

it("moves a re-viewed article to the top instead of duplicating it", () => {
  recordView(article("first", "First"));
  recordView(article("second", "Second"));
  recordView(article("first", "First"));

  const slugs = getRecentlyViewed().map((entry) => entry.slug);

  expect(slugs).toEqual(["first", "second"]);
});

it("caps the list at 5 entries, keeping the most recent", () => {
  for (let i = 1; i <= 6; i++) {
    recordView(article(`article-${i}`, `Article ${i}`));
  }

  const slugs = getRecentlyViewed().map((entry) => entry.slug);

  expect(slugs).toHaveLength(5);
  expect(slugs).toEqual([
    "article-6",
    "article-5",
    "article-4",
    "article-3",
    "article-2",
  ]);
});

it("treats corrupt stored JSON as an empty list and does not throw", () => {
  localStorage.setItem(STORAGE_KEY, "{not valid json");

  expect(() => getRecentlyViewed()).not.toThrow();
  expect(getRecentlyViewed()).toEqual([]);
});

it("treats a non-array stored value as an empty list", () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: "an array" }));

  expect(getRecentlyViewed()).toEqual([]);
});

it("does not throw when localStorage is unavailable", () => {
  const originalGetItem = Storage.prototype.getItem;
  const originalSetItem = Storage.prototype.setItem;

  Storage.prototype.getItem = () => {
    throw new Error("localStorage disabled");
  };
  Storage.prototype.setItem = () => {
    throw new Error("localStorage disabled");
  };

  try {
    expect(() => recordView(article("a", "A"))).not.toThrow();
    expect(() => getRecentlyViewed()).not.toThrow();
    expect(getRecentlyViewed()).toEqual([]);
  } finally {
    Storage.prototype.getItem = originalGetItem;
    Storage.prototype.setItem = originalSetItem;
  }
});

it("does not record a view for an article missing a slug or title", () => {
  recordView({ title: "No slug" });
  recordView({ slug: "no-title" });

  expect(getRecentlyViewed()).toEqual([]);
});
