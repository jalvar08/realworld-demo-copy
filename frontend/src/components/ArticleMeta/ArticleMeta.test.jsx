import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ArticleMeta from "./ArticleMeta";

// AC-090/AC-091: the reading-time badge renders next to the date without
// altering the date's own formatting (REQ-040).
describe("ArticleMeta reading time badge", () => {
  test("renders the reading time badge alongside an unchanged date string", () => {
    render(
      <MemoryRouter>
        <ArticleMeta
          author={{ username: "author-name" }}
          body={"word ".repeat(201)}
          createdAt="2020-01-01T12:11:08.212Z"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("January 1, 2020")).toBeInTheDocument();
    expect(screen.getByText(/2 min read/)).toBeInTheDocument();
  });

  test("renders a minimum of 1 min read for an article with no body yet", () => {
    render(
      <MemoryRouter>
        <ArticleMeta
          author={{ username: "author-name" }}
          createdAt="2020-01-01T12:11:08.212Z"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("January 1, 2020")).toBeInTheDocument();
    expect(screen.getByText(/1 min read/)).toBeInTheDocument();
  });
});
