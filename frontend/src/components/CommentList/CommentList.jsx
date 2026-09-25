import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dateFormatter from "../../helpers/dateFormatter";
import deleteComment from "../../services/deleteComment";
import getComments from "../../services/getComments";
import updateComment from "../../services/updateComment";
import CommentAuthor from "./CommentAuthor";
import CommentEditForm from "./CommentEditForm";

function CommentList({ triggerUpdate, updateComments }) {
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const { headers, isAuth, loggedUser } = useAuth();
  const { slug } = useParams();

  useEffect(() => {
    getComments({ slug }).then(setComments).catch(console.error);
  }, [slug, triggerUpdate]);

  const handleClick = (commentId) => {
    if (!isAuth) alert("You need to login first");

    const confirmation = window.confirm("Want to delete the comment?");
    if (!confirmation) return;

    deleteComment({ commentId, headers, slug })
      .then(updateComments)
      .catch(console.error);
  };

  const handleSave = (commentId, body) => {
    updateComment({ body, commentId, headers, slug })
      .then(updateComments)
      .then(() => setEditingId(null))
      .catch(console.error);
  };

  return comments?.length > 0 ? (
    comments.map(({ author, author: { username }, body, createdAt, id }) => {
      const isOwnComment = isAuth && loggedUser.username === username;

      return (
        <div className="card" key={id}>
          <div className="card-block">
            {editingId === id ? (
              <CommentEditForm
                initialBody={body}
                onCancel={() => setEditingId(null)}
                onSave={(newBody) => handleSave(id, newBody)}
              />
            ) : (
              <p className="card-text">{body}</p>
            )}
          </div>
          <div className="card-footer">
            <CommentAuthor {...author} />
            <span className="date-posted">{dateFormatter(createdAt)}</span>
            {isOwnComment && editingId !== id && (
              <button
                className="btn btn-sm btn-outline-secondary pull-xs-right"
                onClick={() => setEditingId(id)}
              >
                <i className="ion-edit"></i>
              </button>
            )}
            {isOwnComment && (
              <button
                className="btn btn-sm btn-outline-secondary pull-xs-right"
                onClick={() => handleClick(id)}
              >
                <i className="ion-trash-a"></i>
              </button>
            )}
          </div>
        </div>
      );
    })
  ) : (
    <div>There are no comments yet...</div>
  );
}

export default CommentList;
