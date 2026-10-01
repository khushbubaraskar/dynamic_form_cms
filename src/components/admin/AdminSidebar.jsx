import { NavLink } from 'react-router-dom';

const SvgIcon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// Minimal inline SVG paths (Lucide-compatible)
const icons = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  images: 'M21 3H3v18h18V3z M21 15l-5-5L5 21 M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  forms: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  links: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  popup: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  external: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3',
};

export default function AdminSidebar({ open, onClose }) {
  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true, section: null },
    { to: '/admin/images', label: 'Images', icon: 'images', section: 'Content' },
    { to: '/admin/forms', label: 'Forms', icon: 'forms', section: 'Forms' },
    { to: '/admin/links', label: 'Links', icon: 'links' },
    { to: '/admin/popups', label: 'Popup Settings', icon: 'popup' },
  ];

  let lastSection = '';

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-icon">PE</span>
          CMS Admin
        </div>
        <ul className="sidebar-nav">
          {navItems.map((item) => {
            const showSection = item.section && item.section !== lastSection;
            if (item.section) lastSection = item.section;
            return (
              <li key={item.to}>
                {showSection && (
                  <div className="sidebar-section-label">{item.section}</div>
                )}
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  <span className="nav-icon">
                    <SvgIcon d={icons[item.icon]} size={18} />
                  </span>
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div className="sidebar-footer">
          <NavLink to="/" onClick={onClose}>
            <span className="nav-icon">
              <SvgIcon d={icons.external} size={16} />
            </span>
            View Public Site
          </NavLink>
        </div>
      </aside>
    </>
  );
}
