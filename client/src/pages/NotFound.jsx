import { Link } from 'react-router-dom';

/** Fallback for unknown client routes. */
export default function NotFound() {
  return (
    <div className="text-center py-5">
      <h1 className="section-title">Page not found</h1>
      <p className="text-muted">That page doesn't exist.</p>
      <Link to="/" className="section-link">&larr; Back to Discover</Link>
    </div>
  );
}
