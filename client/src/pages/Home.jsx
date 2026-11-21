import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { imageUrl } from '../api.js';
import PhotoCard from '../components/PhotoCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { Loading, ErrorAlert } from '../components/Feedback.jsx';

/** Discover / landing page: hero banner, stats, recent moments. */
export default function Home() {
  document.title = 'Discover - Alzikrayat';
  const { user } = useAuth();
  const { data: photos, loading, error } = useFetch('/api/photos');

  const featured = photos?.[0];
  const recent = (photos || []).slice(0, 6);
  const contributors = photos ? new Set(photos.map((p) => p.userId?._id)).size : 0;

  return (
    <>
      <div className="hero-banner mb-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <div className="hero-eyebrow">Issue 01 / Remembering</div>
            <h1 className="hero-title">Keep the<br />feeling.</h1>
            <p className="hero-copy">
              Alzikrayat is a living album for the places, people, and quiet seconds we never want to lose.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/photos" className="btn-hero-primary">Explore the collection ↗</Link>
              <Link to={user ? '/photos/new' : '/register'} className="btn-hero-ghost" style={{ marginLeft: 0 }}>Make your own album</Link>
            </div>
          </div>
          <div className="col-lg-6">
            {featured && (
              <Link to={`/photos/${featured._id}`} className="text-decoration-none">
                <div className="hero-feature-card">
                  <img src={imageUrl(featured.fileName)} className="hero-feature-img" alt={featured.title} />
                  <div className="hero-feature-caption">
                    <div className="hero-feature-label">Featured moment</div>
                    <div className="fw-semibold fs-5 text-white">{featured.title}</div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="row g-3 mb-5">
        {[
          [photos?.length ?? 0, 'Moments shared'],
          [contributors, 'Contributors'],
          ['MERN', 'Full-stack architecture'],
          ['REST', 'JSON API + Mongoose'],
        ].map(([num, label]) => (
          <div className="col-6 col-md-3" key={label}>
            <div className="stat-box">
              <div className="stat-number">{num}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-end mb-3">
        <div>
          <div className="section-eyebrow">A little further</div>
          <h2 className="section-title">Recent moments</h2>
        </div>
        <Link to="/photos?style=grid-4" className="section-link">See all &rsaquo;</Link>
      </div>

      {loading && <Loading />}
      <ErrorAlert messages={error} />
      {!loading && !error && recent.length === 0 && (
        <div className="alert alert-light border">
          No photos yet. {user ? <Link to="/photos/new">Be the first to upload one!</Link> : <><Link to="/login">Login</Link> to be the first to upload one!</>}
        </div>
      )}
      {recent.length > 0 && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 mb-5 stagger">
          {recent.map((photo) => (
            <Reveal className="col" key={photo._id}>
              <PhotoCard photo={photo} showExcerpt />
            </Reveal>
          ))}
        </div>
      )}

      <Reveal className="story-cta-banner d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <h2 className="fw-normal mb-1" style={{ fontFamily: 'var(--font-display)' }}>Not a highlight reel.</h2>
          <h2 className="fw-semibold mb-0" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-500)' }}>A record of being here.</h2>
        </div>
        <Link to="/about" className="btn-hero-primary">Read our story ↗</Link>
      </Reveal>
    </>
  );
}
