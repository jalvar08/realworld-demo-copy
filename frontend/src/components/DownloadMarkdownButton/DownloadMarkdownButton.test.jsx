import { fireEvent, render, screen } from "@testing-library/react";
import DownloadMarkdownButton from "./DownloadMarkdownButton";

// REQ-059, REQ-060, AC-100, AC-101, AC-102, AC-103

const article = {
  title: "Test Article",
  description: "A description.",
  body: "Some body text.",
  slug: "test-article",
};

describe("DownloadMarkdownButton", () => {
  let createObjectURL;
  let revokeObjectURL;
  let clickSpy;

  beforeEach(() => {
    createObjectURL = vi.fn(() => "blob:mock-url");
    revokeObjectURL = vi.fn();
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;

    clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    clickSpy.mockRestore();
    vi.restoreAllMocks();
  });

  test("clicking the button creates a download anchor and revokes the object URL", () => {
    render(<DownloadMarkdownButton article={article} />);

    fireEvent.click(screen.getByRole("button", { name: /download \.md/i }));

    expect(createObjectURL).toHaveBeenCalledTimes(1);

    const [blobArg] = createObjectURL.mock.calls[0];
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.type).toBe("text/markdown");

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  test("the temporary anchor has the article's filename as its download attribute", () => {
    render(<DownloadMarkdownButton article={article} />);

    const appendChildSpy = vi.spyOn(document.body, "appendChild");

    fireEvent.click(screen.getByRole("button", { name: /download \.md/i }));

    const anchor = appendChildSpy.mock.calls
      .map(([node]) => node)
      .find((node) => node.tagName === "A");

    expect(anchor.download).toBe("test-article.md");
    expect(anchor.href).toContain("blob:mock-url");

    appendChildSpy.mockRestore();
  });
});
