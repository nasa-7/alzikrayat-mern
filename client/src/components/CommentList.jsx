import { authorName, initials, formatDate } from '../api.js';

/** Renders a photo's comment thread. Text is rendered as plain text (React escapes it, preventing XSS). */
export default function CommentList({ comments }) {
  if (comments.length === 0) {
    return <p className="text-muted">No comments yet. Be the first to say something!</p>;
  }
  return comments.map((c) => (
    <div className="comment-row d-flex gap-3" key={c._id}>
      <span className="avatar">{initials(c.userId)}</span>
      <div>
        <strong>{authorName(c.userId)}</strong>
        <span className="text-muted small ms-2">{formatDate(c.dateTime)}</span>
        <p className="mb-0 mt-1" style={{ whiteSpace: 'pre-wrap' }}>{c.comment}</p>
      </div>
    </div>
  ));
}
