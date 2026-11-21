import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';

/** App shell: sticky sidebar + scrolling content, with the mobile sidebar toggle. */
export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-shell">
      <button
        type="button"
        className={`sidebar-toggle d-lg-none ${open ? 'active' : ''}`}
        aria-label="Toggle menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>
      <Navbar open={open} onNavigate={() => setOpen(false)} />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
