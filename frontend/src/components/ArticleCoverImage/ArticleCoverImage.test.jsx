import { render, screen } from "@testing-library/react";
import ArticleCoverImage from "./ArticleCoverImage";

// AC-087: an article's cover image renders when a URL is given, and renders
// nothing at all (no <img>, no placeholder) when it's absent.
describe("ArticleCoverImage", () => {
  test("image URL given -> renders an <img> with that src", () => {
    render(<ArticleCoverImage image="https://example.com/cover.jpg" />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/cover.jpg");
  });

  test("no image URL -> renders nothing", () => {
    const { container } = render(<ArticleCoverImage image={undefined} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});
