import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { recordView } from "../../helpers/recentlyViewed";
import RecentlyViewed from "./RecentlyViewed";

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <RecentlyViewed />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

// AC-106, AC-107

it("renders nothing when no articles have been recently viewed", () => {
  const { container } = renderWithRouter();

  expect(container).toBeEmptyDOMElement();
});

it("renders recently viewed articles as links, most recent first", () => {
  recordView({ slug: "first", title: "First Article" });
  recordView({ slug: "second", title: "Second Article" });
  recordView({ slug: "third", title: "Third Article" });

  renderWithRouter();

  const links = screen.getAllByRole("link");

  expect(links).toHaveLength(3);
  expect(links[0]).toHaveTextContent("Third Article");
  expect(links[0]).toHaveAttribute("href", expect.stringContaining("/article/third"));
  expect(links[1]).toHaveTextContent("Second Article");
  expect(links[2]).toHaveTextContent("First Article");
});
