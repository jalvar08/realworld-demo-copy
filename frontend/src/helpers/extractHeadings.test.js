import extractHeadings from "./extractHeadings";

// REQ-055 / AC-092, AC-093: parsing an article body into its ATX headings.
describe("extractHeadings", () => {
  test.each([
    ["an empty body", "", []],
    ["an undefined body", undefined, []],
    [
      "a body with no headings",
      "Just a paragraph.\n\nAnother paragraph with **bold** text.",
      [],
    ],
    [
      "a body with headings at every level",
      [
        "# One",
        "## Two",
        "### Three",
        "#### Four",
        "##### Five",
        "###### Six",
      ].join("\n"),
      [
        { depth: 1, text: "One", id: "one" },
        { depth: 2, text: "Two", id: "two" },
        { depth: 3, text: "Three", id: "three" },
        { depth: 4, text: "Four", id: "four" },
        { depth: 5, text: "Five", id: "five" },
        { depth: 6, text: "Six", id: "six" },
      ],
    ],
    [
      "a body with duplicate heading text (AC-093)",
      "# Intro\n\nSome text.\n\n# Intro",
      [
        { depth: 1, text: "Intro", id: "intro" },
        { depth: 1, text: "Intro", id: "intro" },
      ],
    ],
    [
      "a body with a heading-like line inside a fenced code block (AC-093)",
      [
        "# Real Heading",
        "",
        "```",
        "# Not a heading",
        "```",
        "",
        "More text.",
      ].join("\n"),
      [{ depth: 1, text: "Real Heading", id: "real-heading" }],
    ],
    [
      "a body with a heading-like line inside a tilde-fenced code block",
      ["~~~", "# Not a heading either", "~~~", "", "## Actual Heading"].join(
        "\n",
      ),
      [{ depth: 2, text: "Actual Heading", id: "actual-heading" }],
    ],
  ])("%s", (_description, body, expected) => {
    expect(extractHeadings(body)).toEqual(expected);
  });
});
