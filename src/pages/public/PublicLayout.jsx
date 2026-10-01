import { Outlet } from 'react-router-dom';
import PublicHeader from '../../components/public/PublicHeader';
import Footer from '../../components/public/Footer';
import PopupForm from '../../components/public/PopupForm';

export default function PublicLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PublicHeader />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <PopupForm />
    </div>
  );
}
