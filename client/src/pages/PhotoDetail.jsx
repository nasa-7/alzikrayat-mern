import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { api, imageUrl, authorName, initials, formatDate } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import CommentList from '../components/CommentList.jsx';
import CommentForm from '../components/CommentForm.jsx';
import Reveal from '../components/Reveal.jsx';
import { Loading, ErrorAlert } from '../components/Feedback.jsx';

/** /photos/:id - full-size photo, metadata, owner-only delete, and live comment thread. */
export default function PhotoDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: photo, loading, error } = useFetch(`/api/photos/${id}`);
  const { data: fetchedComments, loading: loadingComments } = useFetch(`/api/photos/${id}/comments`);
  const [comments, setComments] = useState([]);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (fetchedComments) setComments(fetchedComments);
  }, [fetchedComments]);

  useEffect(() => {
    document.title = photo ? `${photo.title} - Alzikrayat` : 'Alzikrayat';
  }, [photo]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this photo permanently?')) return;
    try {
      await api(`/api/photos/${id}`, { method: 'DELETE' });
      navigate('/photos');
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  if (loading) return <Loading label="Loading photo..." />;
  if (error) {
    return (
      <>
        <ErrorAlert messages={error} />
        <Link to="/photos" className="section-link">&larr; Back to all moments</Link>
      </>
    );
  }

  const isOwner = user && photo.userId && user._id === photo.userId._id;

  return (
    <>
      <Link to="/photos?style=grid-4" className="section-link d-inline-block mb-3">&larr; Back to all moments</Link>

      <div className="row g-4">
        <Reveal className="col-lg-8">
          <img src={imageUrl(photo.fileName)} className="detail-img" alt={photo.title} />
        </Reveal>
        <Reveal className="col-lg-4">
          <h1 className="detail-title mb-2">{photo.title}</h1>
          <div className="moment-author mb-3">
            <span className="avatar">{initials(photo.userId)}</span>
            <div>
              <div className="fw-semibold">{authorName(photo.userId)}</div>
              <div className="text-muted small">{formatDate(photo.dateTime)}</div>
            </div>
          </div>
          {photo.description && <p className="text-muted mb-4" style={{ whiteSpace: 'pre-wrap' }}>{photo.description}</p>}
          <ErrorAlert messages={deleteError} />
          {isOwner && (
            <button type="button" className="pill-btn pill-btn-danger bg-transparent" onClick={handleDelete}>
              Delete photo
            </button>
          )}
        </Reveal>
      </div>

      <hr className="my-5" />

      <section id="comments">
        <h2 className="section-title mb-4" style={{ fontSize: '1.4rem' }}>Comments ({comments.length})</h2>
        <div className="mb-4" style={{ maxWidth: 720 }}>
          {loadingComments ? <Loading label="Loading comments..." /> : <CommentList comments={comments} />}
        </div>
        <CommentForm photoId={id} onAdded={(c) => setComments((prev) => [...prev, c])} />
      </section>
    </>
  );
}
