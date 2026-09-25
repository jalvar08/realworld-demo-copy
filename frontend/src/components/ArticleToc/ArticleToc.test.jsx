import { render, screen } from "@testing-library/react";
import { createRequire } from "node:module";
import ArticleToc from "./ArticleToc";

// Loaded via Node's own `require` (which resolves this package's "require"
// condition, i.e. its CJS build) rather than a static `import` of
// "markdown-to-jsx" package's default "import" condition, its ESM build,
// which fails to render under Vitest's jsdom SSR transform — an interop
// quirk of this dependency/test-runner combination, unrelated to this
// feature. The real app (built by Vite for the browser) is unaffected and
// keeps importing "markdown-to-jsx" normally, per the ticket's constraint
// not to change how the body itself is rendered.
const Markdown = createRequire(import.meta.url)("markdown-to-jsx");

// REQ-056 / AC-094: no headings means no table-of-contents element at all.
it("renders nothing when the body has no headings", () => {
  const { container } = render(
    <ArticleToc body="Just a paragraph, no headings here." />,
  );

  expect(container).toBeEmptyDOMElement();
});

it("renders nothing when the body is empty", () => {
  const { container } = render(<ArticleToc body="" />);

  expect(container).toBeEmptyDOMElement();
});

// REQ-056 / AC-095: each rendered link's href="#id" must match the id
// markdown-to-jsx itself puts on the corresponding rendered heading, since
// that's what makes clicking the link actually scroll to the heading.
it("renders links whose href matches the ids markdown-to-jsx assigns the rendered headings", () => {
  const body = [
    "# First Section",
    "",
    "Some intro text.",
    "",
    "## Second Section",
    "",
    "More text.",
  ].join("\n");

  render(
    <div>
      <ArticleToc body={body} />
      <Markdown options={{ forceBlock: true }}>{body}</Markdown>
    </div>,
  );

  // Only the two headings from the rendered Markdown body — excludes the
  // TOC's own "Table of Contents" <h6> label, which is also a heading.
  const headings = [
    ...screen.getAllByRole("heading", { level: 1 }),
    ...screen.getAllByRole("heading", { level: 2 }),
  ];
  expect(headings).toHaveLength(2);

  const links = screen.getAllByRole("link");
  expect(links).toHaveLength(2);

  links.forEach((link, index) => {
    const targetId = link.getAttribute("href").slice(1);
    expect(link).toHaveTextContent(headings[index].textContent);
    expect(headings[index]).toHaveAttribute("id", targetId);
  });
});
