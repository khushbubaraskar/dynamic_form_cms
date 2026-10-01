import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';

export default function PublicHeader() {
  const { state } = useStore();
  const [navOpen, setNavOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;
      // Only hide after scrolling past 80px to avoid flickering at top
      if (currentY > 80) {
        setHidden(currentY > lastScrollY.current);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`public-header${hidden ? ' header-hidden' : ''}`}>
      <Link to="/" className="logo">
        <span className="logo-mark">PE</span>
        Premium Estates
      </Link>
      <button
        className="public-nav-toggle"
        onClick={() => setNavOpen(!navOpen)}
        aria-label="Toggle navigation"
      >
        {navOpen ? '✕' : '☰'}
      </button>
      <nav className={`public-nav${navOpen ? ' open' : ''}`}>
        <NavLink to="/" end onClick={() => setNavOpen(false)}>Home</NavLink>
        {state.links.map((link) => (
          <NavLink key={link.id} to={link.path} onClick={() => setNavOpen(false)}>
            {link.name}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
