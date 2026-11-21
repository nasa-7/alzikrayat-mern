import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import PhotoCard from '../components/PhotoCard.jsx';
import PhotoListRow from '../components/PhotoListRow.jsx';
import Slider from '../components/Slider.jsx';
import Reveal from '../components/Reveal.jsx';
import { Loading, ErrorAlert } from '../components/Feedback.jsx';

const STYLES = [
  ['grid-3', '3-col'],
  ['grid-4', '4-col'],
  ['list', 'List'],
  ['slider', 'Slider'],
];

/** "All moments": fetches photos, then offers 4 display styles + search (state lives in the URL). */
export default function Gallery() {
  document.title = 'All moments - Alzikrayat';
  const [params, setParams] = useSearchParams();
  const style = STYLES.some(([k]) => k === params.get('style')) ? params.get('style') : 'grid-3';
  const search = params.get('q') || '';
  const { data: photos, loading, error } = useFetch('/api/photos');

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!photos || !q) return photos || [];
    return photos.filter((p) =>
      `${p.title} ${p.description || ''} ${p.userId?.firstName} ${p.userId?.lastName}`.toLowerCase().includes(q)
    );
  }, [photos, search]);

  const update = (next) => setParams({ style, ...(search ? { q: search } : {}), ...next }, { replace: true });
  const colClass = style === 'grid-3' ? 'row-cols-1 row-cols-sm-2 row-cols-lg-3' : 'row-cols-1 row-cols-sm-2 row-cols-lg-4';

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-2 gap-2">
        <div>
          <div className="section-eyebrow">&#9679; The collection</div>
          <h1 className="section-title" style={{ fontSize: '2.2rem' }}>All moments</h1>
        </div>
        <div className="view-switch">
          {STYLES.map(([key, label]) => (
            <Link
              key={key}
              to={`/photos?style=${key}${search ? `&q=${encodeURIComponent(search)}` : ''}`}
              className={style === key ? 'active' : ''}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <form className="d-flex align-items-center gap-3 mb-4 flex-wrap" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          className="form-control"
          style={{ maxWidth: 420, borderRadius: 999, padding: '10px 18px' }}
          placeholder="Search places, feelings, people..."
          value={search}
          onChange={(e) => update({ q: e.target.value })}
        />
        <span className="text-muted small">
          {visible.length} shared moment{visible.length === 1 ? '' : 's'}
        </span>
      </form>

      {loading && <Loading />}
      <ErrorAlert messages={error} />
      {!loading && !error && visible.length === 0 && <div className="alert alert-light border">No moments match your search yet.</div>}

      {visible.length > 0 && style === 'slider' && <Slider photos={visible} />}

      {visible.length > 0 && style === 'list' && (
        <div className="d-flex flex-column gap-2 mb-4 stagger">
          {visible.map((p) => (
            <Reveal key={p._id}>
              <PhotoListRow photo={p} />
            </Reveal>
          ))}
        </div>
      )}

      {visible.length > 0 && (style === 'grid-3' || style === 'grid-4') && (
        <div className={`row ${colClass} g-4 mb-4 stagger`}>
          {visible.map((p) => (
            <Reveal className="col" key={p._id}>
              <PhotoCard photo={p} showFullName={false} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
