import { Link } from 'react-router-dom';
import { imageUrl, authorName, formatDate } from '../api.js';

/** One photo in the "list" display style. */
export default function PhotoListRow({ photo }) {
  const desc = photo.description || '';
  return (
    <Link to={`/photos/${photo._id}`} className="moment-list-row">
      <img src={imageUrl(photo.fileName)} alt={photo.title} className="moment-list-thumb" loading="lazy" />
      <div className="flex-grow-1">
        <h6 className="mb-1 fw-semibold" style={{ fontFamily: 'var(--font-display)' }}>{photo.title}</h6>
        <p className="mb-1 text-muted small">{desc.length > 140 ? `${desc.slice(0, 140)}...` : desc}</p>
        <small className="text-muted">
          by {authorName(photo.userId)} &middot; {formatDate(photo.dateTime)}
        </small>
      </div>
    </Link>
  );
}
