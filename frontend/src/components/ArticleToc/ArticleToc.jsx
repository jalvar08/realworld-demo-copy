import extractHeadings from "../../helpers/extractHeadings";

// Renders a linked table of contents for an article's Markdown `body`
// (REQ-055, REQ-056). Headings are re-parsed from `body` on every render,
// so the list always reflects the body currently being displayed (US-032).
// Renders nothing at all when the body has no headings.
function ArticleToc({ body }) {
  const headings = extractHeadings(body);

  if (headings.length === 0) return null;

  return (
    <nav className="article-toc" aria-label="Table of contents">
      <h6>Table of Contents</h6>
      <ul>
        {headings.map(({ depth, text, id }, index) => (
          <li key={`${id}-${index}`} className={`article-toc-level-${depth}`}>
            <a href={`#${id}`}>{text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default ArticleToc;
