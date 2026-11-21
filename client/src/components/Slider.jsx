import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { imageUrl, authorName } from '../api.js';

/** Auto-advancing image slider (React replacement for the Bootstrap carousel). */
export default function Slider({ photos }) {
  const [index, setIndex] = useState(0);
  const count = photos.length;

  useEffect(() => {
    if (count < 2) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(timer);
  }, [count, index]);

  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  const photo = photos[index] || photos[0];
  const go = (delta) => setIndex((i) => (i + delta + count) % count);

  return (
    <div className="mb-4">
      <div className="slider">
        <Link to={`/photos/${photo._id}`}>
          <img src={imageUrl(photo.fileName)} alt={photo.title} className="slider-img" />
        </Link>
        <div className="slider-caption d-none d-md-block">
          <h5>{photo.title}</h5>
          <p className="mb-0">by {authorName(photo.userId)}</p>
        </div>
        {count > 1 && (
          <>
            <button type="button" className="slider-btn prev" aria-label="Previous" onClick={() => go(-1)}>‹</button>
            <button type="button" className="slider-btn next" aria-label="Next" onClick={() => go(1)}>›</button>
          </>
        )}
      </div>
      <div className="slider-dots">
        {photos.map((p, i) => (
          <button
            key={p._id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            className={`slider-dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
