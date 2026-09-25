const DEFAULT_FILENAME_BASE = "untitled-article";

/**
 * Builds the Markdown file content and filename for a downloadable copy of
 * an article (REQ-059, REQ-060).
 *
 * Content format:
 *   # <title>
 *
 *   <description>   (only when a non-empty description is present)
 *
 *   <body>
 *
 * Each present section is separated by a single blank line, and the file
 * always ends with a trailing newline. The body is included verbatim
 * (no re-formatting, no escaping) so any Markdown syntax it already
 * contains round-trips unchanged.
 *
 * Filename: "<slug>.md". When the article has no slug (missing, empty, or
 * not a string), the filename falls back to "untitled-article.md" rather
 * than throwing or producing an unusable name.
 */
function articleToMarkdown(article) {
  const { body, description, slug, title } = article || {};

  const sections = [`# ${title || ""}`];

  if (description) {
    sections.push(description);
  }

  if (body) {
    sections.push(body);
  }

  const content = `${sections.join("\n\n")}\n`;

  const filenameBase =
    typeof slug === "string" && slug.length > 0 ? slug : DEFAULT_FILENAME_BASE;
  const filename = `${filenameBase}.md`;

  return { content, filename };
}

export default articleToMarkdown;
