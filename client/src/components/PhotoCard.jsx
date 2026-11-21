import { Link } from 'react-router-dom';
import { imageUrl, authorName, initials } from '../api.js';

const excerpt = (text = '', max) => (text.length > max ? `${text.slice(0, max)}...` : text);

/**
 * One photo in a grid. Props: photo (with populated userId), showExcerpt, showFullName.
 */
export default function PhotoCard({ photo, showExcerpt = false, showFullName = true }) {
  const author = photo.userId;
  return (
    <Link to={`/photos/${photo._id}`} className="moment-card">
      <img src={imageUrl(photo.fileName)} className="moment-img" alt={photo.title} loading="lazy" />
      <div className="moment-body">
        <p className="moment-title">
          {photo.title} <span className="moment-arrow">↗</span>
        </p>
        {showExcerpt && <p className="moment-excerpt">{excerpt(photo.description, 90)}</p>}
        <div className="moment-meta">
          <div className="moment-author">
            <span className="avatar">{initials(author)}</span>
            {showFullName ? authorName(author) : author?.firstName}
          </div>
        </div>
      </div>
    </Link>
  );
}
