// AC-087: renders the article's optional cover image when set; renders
// nothing (no <img> element, no placeholder) when it isn't. A broken/
// unreachable URL is left to the browser's normal broken-image handling
// rather than being caught or hidden here.
function ArticleCoverImage({ alt, image }) {
  if (!image) return null;

  return <img alt={alt || "Article cover"} className="article-cover-image" src={image} />;
}

export default ArticleCoverImage;
