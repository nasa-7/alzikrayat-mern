import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ErrorAlert } from './Feedback.jsx';

const EMPTY = { firstName: '', lastName: '', email: '', password: '', location: '', occupation: '', description: '' };

/** Registration form; logs the new user in automatically. Props: onSuccess(). */
export default function RegisterForm({ onSuccess }) {
  const { login } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState([]);
  const [validated, setValidated] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    if (!e.currentTarget.checkValidity()) return;
    setBusy(true);
    setErrors([]);
    try {
      await api('/api/auth/register', { method: 'POST', body: form });
      login(await api('/api/auth/login', { method: 'POST', body: { email: form.email, password: form.password } }));
      onSuccess();
    } catch (err) {
      setErrors(err.errors);
      setBusy(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="section-title mb-1" style={{ fontSize: '1.6rem' }}>Start your own corner</h2>
      <p className="text-muted mb-4">Save the moments you want to find again.</p>
      <ErrorAlert messages={errors} />
      <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-sm-6 mb-3">
            <label htmlFor="firstName" className="form-label fw-semibold">First name</label>
            <input type="text" className="form-control" id="firstName" name="firstName" pattern="[A-Za-z ]{1,50}" maxLength={50} required value={form.firstName} onChange={set} />
            <div className="invalid-feedback">Letters only, max 50 characters.</div>
          </div>
          <div className="col-sm-6 mb-3">
            <label htmlFor="lastName" className="form-label fw-semibold">Last name</label>
            <input type="text" className="form-control" id="lastName" name="lastName" pattern="[A-Za-z ]{1,50}" maxLength={50} required value={form.lastName} onChange={set} />
            <div className="invalid-feedback">Letters only, max 50 characters.</div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold">Email address</label>
          <input type="email" className="form-control" id="email" name="email" required value={form.email} onChange={set} />
          <div className="invalid-feedback">Please enter a valid email address.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-semibold">Password</label>
          <input type="password" className="form-control" id="password" name="password" required minLength={6} value={form.password} onChange={set} />
          <div className="invalid-feedback">Password must be at least 6 characters.</div>
          <div className="form-text">Stored securely with bcrypt - never saved in plain text.</div>
        </div>
        <div className="row">
          <div className="col-sm-6 mb-3">
            <label htmlFor="location" className="form-label fw-semibold">Location <span className="text-muted fw-normal">(optional)</span></label>
            <input type="text" className="form-control" id="location" name="location" maxLength={100} value={form.location} onChange={set} />
          </div>
          <div className="col-sm-6 mb-3">
            <label htmlFor="occupation" className="form-label fw-semibold">Occupation <span className="text-muted fw-normal">(optional)</span></label>
            <input type="text" className="form-control" id="occupation" name="occupation" maxLength={100} value={form.occupation} onChange={set} />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="form-label fw-semibold">About you <span className="text-muted fw-normal">(optional)</span></label>
          <textarea className="form-control" id="description" name="description" rows="2" maxLength={500} value={form.description} onChange={set} />
        </div>
        <button type="submit" className="btn-primary-warm" disabled={busy}>{busy ? 'Creating...' : 'Create account'}</button>
      </form>
    </div>
  );
}
