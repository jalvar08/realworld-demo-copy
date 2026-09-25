import articleToMarkdown from "./articleToMarkdown";

// REQ-059, REQ-060, AC-100, AC-101, AC-102, AC-103

describe("articleToMarkdown", () => {
  test.each([
    [
      "title and body only",
      { title: "Hello World", body: "Some body text." },
      "# Hello World\n\nSome body text.\n",
    ],
    [
      "title, description, and body",
      {
        title: "Hello World",
        description: "A short summary.",
        body: "Some body text.",
      },
      "# Hello World\n\nA short summary.\n\nSome body text.\n",
    ],
    [
      "empty description is omitted",
      { title: "Hello World", description: "", body: "Some body text." },
      "# Hello World\n\nSome body text.\n",
    ],
    [
      "missing title still renders a heading",
      { body: "Some body text." },
      "# \n\nSome body text.\n",
    ],
  ])("content format: %s", (_label, article, expectedContent) => {
    const { content } = articleToMarkdown(article);

    expect(content).toBe(expectedContent);
  });

  test.each([
    ["typical-slug", "typical-slug.md"],
    ["how-to-train-your-dragon-5f3a", "how-to-train-your-dragon-5f3a.md"],
  ])("filename from slug %s", (slug, expectedFilename) => {
    const { filename } = articleToMarkdown({ title: "t", body: "b", slug });

    expect(filename).toBe(expectedFilename);
  });

  test.each([
    ["missing slug", undefined],
    ["empty slug", ""],
    ["non-string slug", 42],
  ])("falls back to a default filename when slug is %s", (_label, slug) => {
    const { filename } = articleToMarkdown({ title: "t", body: "b", slug });

    expect(filename).toBe("untitled-article.md");
  });

  test("preserves special characters in the body verbatim", () => {
    const body =
      "Line one\n\n```js\nconst x = { a: 1 } && \"quo'te\" < 2 > & *bold* _em_\n```\n\n> a quote & <tag> 100%";

    const { content } = articleToMarkdown({ title: "Special", body });

    expect(content).toBe(`# Special\n\n${body}\n`);
  });
});
