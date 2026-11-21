import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoginForm from '../components/LoginForm.jsx';
import RegisterForm from '../components/RegisterForm.jsx';
import Reveal from '../components/Reveal.jsx';

/** Login / Register view. Prop: mode = 'login' | 'register'. */
export default function LoginRegister({ mode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  document.title = `${mode === 'login' ? 'Login' : 'Register'} - Alzikrayat`;

  if (user) return <Navigate to="/photos" replace />;

  return (
    <div className="row justify-content-center">
      <div className={mode === 'login' ? 'col-md-8 col-lg-6' : 'col-md-9 col-lg-7'}>
        <div className="text-center mb-4">
          <div className="auth-pill-nav">
            <Link to="/login" className={mode === 'login' ? 'active' : ''}>Login</Link>
            <Link to="/register" className={mode === 'register' ? 'active' : ''}>Register</Link>
          </div>
        </div>
        <Reveal>
          {mode === 'login' ? (
            <LoginForm onSuccess={() => navigate('/photos')} />
          ) : (
            <RegisterForm onSuccess={() => navigate('/photos')} />
          )}
        </Reveal>
      </div>
    </div>
  );
}
