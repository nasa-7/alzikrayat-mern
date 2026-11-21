import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Reveal from '../components/Reveal.jsx';
import { ErrorAlert } from '../components/Feedback.jsx';

const MAX_BYTES = 5 * 1024 * 1024;

/** Upload form (logged-in users only). Sends multipart/form-data to POST /api/photos. */
export default function AddPhoto() {
  document.title = 'Add a moment - Alzikrayat';
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState([]);
  const [validated, setValidated] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    if (!e.currentTarget.checkValidity()) return;
    if (file.size > MAX_BYTES) {
      setErrors(['The image must be smaller than 5 MB.']);
      return;
    }
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('photo', file); // file last so multer sees text fields first
    setBusy(true);
    setErrors([]);
    try {
      const created = await api('/api/photos', { method: 'POST', form });
      navigate(`/photos/${created._id}`);
    } catch (err) {
      setErrors(err.errors);
      setBusy(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-7">
        <div className="section-eyebrow">New entry</div>
        <h1 className="section-title mb-4">Add a moment</h1>
        <ErrorAlert messages={errors} />
        <Reveal className="auth-card">
          <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="photo" className="form-label fw-semibold">Image file</label>
              <input type="file" className="form-control" id="photo" accept=".jpg,.jpeg,.png,.gif,.webp" required onChange={(e) => setFile(e.target.files[0] || null)} />
              <div className="form-text">JPG, PNG, GIF, or WEBP. Max 5 MB.</div>
              <div className="invalid-feedback">Please choose an image file.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-semibold">Title</label>
              <input type="text" className="form-control" id="title" maxLength={200} required placeholder="Where the river turns gold" value={title} onChange={(e) => setTitle(e.target.value)} />
              <div className="invalid-feedback">A title is required (max 200 characters).</div>
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="form-label fw-semibold">A few honest words <span className="text-muted fw-normal">(optional)</span></label>
              <textarea className="form-control" id="description" rows="3" maxLength={2000} placeholder="What made this moment worth keeping?" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary-warm" disabled={busy}>{busy ? 'Uploading...' : 'Save this moment'}</button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
