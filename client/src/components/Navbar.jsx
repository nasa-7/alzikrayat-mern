import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Sidebar navigation (the toolbar). Logged in: "Hi <firstName>" + Logout.
 * Logged out: "Please Login" routing to the LoginRegister view.
 */
export default function Navbar({ open, onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) => `side-link ${isActive ? 'active' : ''}`;

  const handleLogout = () => {
    logout();
    onNavigate();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} id="sidebar">
      <div className="sidebar-top">
        <Link to="/" className="brand" onClick={onNavigate}>
          <span className="brand-icon">📷</span> alzikrayat<span className="brand-dot">.</span>
        </Link>
        <div className="eyebrow">A living album</div>

        <nav className="side-nav">
          <div className="nav-label">Wander through</div>
          <NavLink to="/" end className={linkClass} onClick={onNavigate}>
            <span className="side-link-icon">◎</span> Discover
          </NavLink>
          <NavLink to="/photos" className={linkClass} onClick={onNavigate}>
            <span className="side-link-icon">▦</span> All moments
          </NavLink>
          <NavLink to="/about" className={linkClass} onClick={onNavigate}>
            <span className="side-link-icon">✦</span> Our story
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <Link to={user ? '/photos/new' : '/login'} className="btn-cta" onClick={onNavigate}>
          ✎ Add a moment
        </Link>
        {user ? (
          <div className="whoami-card">
            <div className="whoami-name">Hi, {user.firstName} 👋</div>
            <button type="button" className="whoami-link nav-btn-reset" onClick={handleLogout}>
              Logout ↗
            </button>
          </div>
        ) : (
          <div className="signin-card">
            <div className="signin-title">Please Login</div>
            <p>Save the moments you want to find again.</p>
            <Link to="/login" className="signin-link" onClick={onNavigate}>
              Sign in ↗
            </Link>
          </div>
        )}
        <div className="sidebar-copy">&copy; {new Date().getFullYear()} Alzikrayat</div>
      </div>
    </aside>
  );
}
