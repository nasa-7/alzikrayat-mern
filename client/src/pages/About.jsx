import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Reveal from '../components/Reveal.jsx';

/** "Our story" static page. */
export default function About() {
  document.title = 'Our Story - Alzikrayat';
  const { user } = useAuth();
  return (
    <>
      <div className="section-eyebrow">Our story / 01</div>
      <h1 className="story-hero-title mt-3 mb-4">A photograph<br /><span className="accent">is a place.</span></h1>
      <p className="fs-5 text-muted mb-5" style={{ maxWidth: 640 }}>
        We made Alzikrayat for the photos that do not belong in a timeline. The blurry train
        window. The friend just out of frame. The ordinary Tuesday that somehow became the
        one you tell stories about.
      </p>

      <hr className="my-5" />

      <div className="row g-5 align-items-start mb-5">
        <div className="col-lg-3">
          <div className="section-eyebrow">The thought</div>
        </div>
        <div className="col-lg-9">
          <h2 className="fw-normal mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem' }}>
            Memory is not a feed. It is a room you can return to.
          </h2>
          <p className="text-muted fs-6 mb-4" style={{ maxWidth: 640 }}>
            Most places ask us to move on quickly. Alzikrayat takes the opposite view: a
            slower, more human kind of sharing where context matters as much as the image,
            and a small reflection can make a moment feel close again. This edition rebuilds
            the album on the MERN stack - a React front end, an Express REST API, and MongoDB
            underneath - keeping the same warm design as the original.
          </p>
          <div className="row g-3">
            <Reveal className="col-md-6">
              <div className="story-callout story-callout-pink">
                <div className="small fw-semibold mb-2">01</div>
                <h3 className="h5">Keep the details</h3>
                <p className="mb-0 small">A title, a place, a few honest words. Enough to find the feeling again.</p>
              </div>
            </Reveal>
            <Reveal className="col-md-6">
              <div className="story-callout story-callout-gold">
                <div className="small fw-semibold mb-2">02</div>
                <h3 className="h5">Share with care</h3>
                <p className="mb-0 small">A collection shaped by people, not performance. Leave a comment when you have one.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <Reveal className="story-cta-banner d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <div className="hero-eyebrow mb-2">Come in</div>
          <h2 className="fw-normal mb-0" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>
            Bring the moments<br />you keep returning to.
          </h2>
        </div>
        <Link to={user ? '/photos/new' : '/register'} className="btn-hero-primary">Start collecting ↗</Link>
      </Reveal>
    </>
  );
}
