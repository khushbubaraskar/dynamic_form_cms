import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

const PAGE_TITLES = {
  '/admin': 'Dashboard',
  '/admin/images': 'Image Management',
  '/admin/forms': 'Form Builder',
  '/admin/links': 'Link Management',
  '/admin/popups': 'Popup Settings',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title = PAGE_TITLES[location.pathname] || 'Admin';

  return (
    <div className="admin-layout">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <h1>{title}</h1>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
