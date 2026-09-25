// Matches an ATX heading line (one to six leading `#` characters), the same
// shape `markdown-to-jsx` itself recognizes: up to 3 leading spaces, then
// 1-6 `#`s, then the heading text, with any trailing `#`s/whitespace
// ignored. Setext headings (`Title` underlined with `===`/`---`) are not
// recognized (REQ-055) even though markdown-to-jsx renders them as real
// headings — see the REQ-055 boundary note for why.
const ATX_HEADING = /^ {0,3}(#{1,6})[ \t]*([^\n]*?)[ \t]*#*[ \t]*$/;

// A fenced code block delimiter, ``` or ~~~ (3 or more of either
// character). Used only to toggle "are we inside a fence" so a `#` line
// inside a code fence is never mistaken for a heading (REQ-055).
const FENCE = /^ {0,3}(`{3,}|~{3,})/;

// Reproduces markdown-to-jsx's own default `slugify` option (the function
// it uses to turn heading text into a heading's `id` attribute) exactly, so
// the ids this helper generates match the ids markdown-to-jsx puts on the
// rendered headings. Kept byte-for-byte identical to that implementation
// rather than referencing it directly, since it isn't exported by the
// package.
function slugify(text) {
  return text
    .replace(/[ÀÁÂÃÄÅàáâãäåæÆ]/g, "a")
    .replace(/[çÇ]/g, "c")
    .replace(/[ðÐ]/g, "d")
    .replace(/[ÈÉÊËéèêë]/g, "e")
    .replace(/[ÏïÎîÍíÌì]/g, "i")
    .replace(/[Ññ]/g, "n")
    .replace(/[øØœŒÕõÔôÓóÒò]/g, "o")
    .replace(/[ÜüÛûÚúÙù]/g, "u")
    .replace(/[ŸÿÝý]/g, "y")
    .replace(/[^a-z0-9- ]/gi, "")
    .replace(/ /gi, "-")
    .toLowerCase();
}

// Parses an article's Markdown `body` into the flat, ordered list of ATX
// headings it contains (REQ-055). Each entry is `{ depth, text, id }`:
// `depth` is 1-6, `text` is the heading's raw source text (unprocessed
// Markdown, matching what markdown-to-jsx slugifies), and `id` is the
// heading's id exactly as markdown-to-jsx would render it.
//
// Duplicate heading text is not de-duplicated: two headings with the same
// text produce two entries with the same `id`, matching markdown-to-jsx's
// own (also non-deduplicating) default behavior, so ids always line up
// with what's actually rendered.
export default function extractHeadings(body) {
  if (!body) return [];

  const headings = [];
  let fenceChar = null;

  body.split("\n").forEach((line) => {
    const fenceMatch = line.match(FENCE);

    if (fenceMatch) {
      const marker = fenceMatch[1][0];

      if (fenceChar === marker) {
        fenceChar = null;
      } else if (!fenceChar) {
        fenceChar = marker;
      }

      return;
    }

    if (fenceChar) return;

    const headingMatch = line.match(ATX_HEADING);
    if (!headingMatch) return;

    const text = headingMatch[2].trim();
    if (!text) return;

    headings.push({
      depth: headingMatch[1].length,
      text,
      id: slugify(text),
    });
  });

  return headings;
}
