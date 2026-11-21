import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ErrorAlert } from './Feedback.jsx';

/** Login form. Props: onSuccess() called after the profile is stored in context. */
export default function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
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
      login(await api('/api/auth/login', { method: 'POST', body: form }));
      onSuccess();
    } catch (err) {
      setErrors(err.errors);
      setBusy(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="section-title mb-1" style={{ fontSize: '1.6rem' }}>Welcome back</h2>
      <p className="text-muted mb-4">Come find the moments you keep returning to.</p>
      <ErrorAlert messages={errors} />
      <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold">Email address</label>
          <input type="email" className="form-control" id="email" name="email" required value={form.email} onChange={set} />
          <div className="invalid-feedback">Please enter a valid email address.</div>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="form-label fw-semibold">Password</label>
          <input type="password" className="form-control" id="password" name="password" required minLength={6} value={form.password} onChange={set} />
          <div className="invalid-feedback">Password is required (min 6 characters).</div>
        </div>
        <button type="submit" className="btn-primary-warm" disabled={busy}>{busy ? 'Signing in...' : 'Login'}</button>
      </form>
    </div>
  );
}
