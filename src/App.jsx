import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './hooks/useStore';

// Layouts
import AdminLayout from './pages/admin/AdminLayout';
import PublicLayout from './pages/public/PublicLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminImages from './pages/admin/AdminImages';
import AdminForms from './pages/admin/AdminForms';
import AdminLinks from './pages/admin/AdminLinks';
import AdminPopups from './pages/admin/AdminPopups';

// Public Pages
import PublicHome from './pages/public/PublicHome';
import PublicFormPage from './pages/public/PublicFormPage';

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="images" element={<AdminImages />} />
            <Route path="forms" element={<AdminForms />} />
            <Route path="links" element={<AdminLinks />} />
            <Route path="popups" element={<AdminPopups />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<PublicHome />} />
            {/* 
              Catch-all for dynamic links.
              PublicFormPage resolves the current path against configured links
              and renders the assigned form — fully configuration-driven.
            */}
            <Route path="*" element={<PublicFormPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
