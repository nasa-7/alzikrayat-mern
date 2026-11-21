import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ErrorAlert } from './Feedback.jsx';

/** Comment box. Props: photoId, onAdded(comment) - lets the parent update the list instantly. */
export default function CommentForm({ photoId, onAdded }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [errors, setErrors] = useState([]);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!user) {
    return (
      <p className="text-muted">
        Please <Link to="/login">login</Link> to leave a comment.
      </p>
    );
  }

  const invalid = touched && text.trim() === '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (text.trim() === '') return;
    setBusy(true);
    setErrors([]);
    try {
      const created = await api(`/api/photos/${photoId}/comments`, { method: 'POST', body: { comment: text } });
      onAdded(created);
      setText('');
      setTouched(false);
    } catch (err) {
      setErrors(err.errors);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 720 }}>
      <ErrorAlert messages={errors} />
      <div className="mb-2">
        <textarea
          className={`form-control ${invalid ? 'is-invalid' : ''}`}
          rows="2"
          maxLength={1000}
          placeholder="Add a comment..."
          style={{ borderRadius: 14 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="invalid-feedback">Please write a comment before submitting.</div>
      </div>
      <button type="submit" className="pill-btn" disabled={busy} style={{ background: 'var(--maroon-700)', color: '#fff', border: 'none' }}>
        {busy ? 'Posting...' : 'Post comment'}
      </button>
    </form>
  );
}
