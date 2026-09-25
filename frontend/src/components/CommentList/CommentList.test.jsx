import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CommentList from "./CommentList";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ slug: "a-slug" }),
  Link: ({ children }) => <>{children}</>,
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../services/getComments", () => ({ default: vi.fn() }));
vi.mock("../../services/deleteComment", () => ({ default: vi.fn() }));
vi.mock("../../services/updateComment", () => ({ default: vi.fn() }));

import { useAuth } from "../../context/AuthContext";
import getComments from "../../services/getComments";
import updateComment from "../../services/updateComment";

const author = {
  bio: "",
  followersCount: 0,
  following: false,
  image: "",
  username: "jane",
};

function makeComment(overrides = {}) {
  return {
    author,
    body: "original text",
    createdAt: "2020-01-01T00:00:00.000Z",
    id: 1,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// AC-083: the edit control is only shown to the comment's own author.
test("no edit control is shown when the viewer is not the comment's author", async () => {
  getComments.mockResolvedValue([makeComment()]);
  useAuth.mockReturnValue({
    headers: {},
    isAuth: true,
    loggedUser: { username: "someone-else" },
  });

  const { container } = render(
    <CommentList triggerUpdate={{}} updateComments={vi.fn()} />,
  );

  await screen.findByText("original text");

  expect(container.querySelector(".ion-edit")).not.toBeInTheDocument();
});

// AC-083: the edit control is shown to the comment's own author.
test("edit control is shown when the viewer is the comment's author", async () => {
  getComments.mockResolvedValue([makeComment()]);
  useAuth.mockReturnValue({
    headers: {},
    isAuth: true,
    loggedUser: { username: "jane" },
  });

  const { container } = render(
    <CommentList triggerUpdate={{}} updateComments={vi.fn()} />,
  );

  await screen.findByText("original text");

  expect(container.querySelector(".ion-edit")).toBeInTheDocument();
});

// AC-080: a successful edit sends the new body to the server and, once
// saved, the list is refreshed from the server rather than only updated
// optimistically in local state.
test("saving an edit sends the updated body and refreshes from the server", async () => {
  getComments.mockResolvedValue([makeComment()]);
  updateComment.mockResolvedValue(makeComment({ body: "edited text" }));
  const updateComments = vi.fn();
  useAuth.mockReturnValue({
    headers: { Authorization: "Token abc" },
    isAuth: true,
    loggedUser: { username: "jane" },
  });

  const { container } = render(
    <CommentList triggerUpdate={{}} updateComments={updateComments} />,
  );

  await screen.findByText("original text");

  fireEvent.click(container.querySelector(".ion-edit"));

  const textarea = await screen.findByDisplayValue("original text");
  fireEvent.change(textarea, { target: { value: "edited text" } });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => expect(updateComments).toHaveBeenCalled());

  expect(updateComment).toHaveBeenCalledWith({
    body: "edited text",
    commentId: 1,
    headers: { Authorization: "Token abc" },
    slug: "a-slug",
  });
});
