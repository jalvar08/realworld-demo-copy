import { useState } from "react";

// Inline edit control for a single comment's body. Shown in place of the
// comment text only for the comment's own author (see CommentList).
function CommentEditForm({ initialBody, onCancel, onSave }) {
  const [body, setBody] = useState(initialBody);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (body.trim() === "") return;

    onSave(body);
  };

  return (
    <form className="comment-edit-form" onSubmit={handleSubmit}>
      <textarea
        className="form-control"
        onChange={(e) => setBody(e.target.value)}
        rows="3"
        value={body}
      ></textarea>
      <div className="comment-edit-actions">
        <button className="btn btn-sm btn-primary" type="submit">
          Save
        </button>{" "}
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CommentEditForm;
