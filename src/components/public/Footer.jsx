import { FOOTER_CONFIG } from '../../data/footerConfig';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <div className="footer-brand">{FOOTER_CONFIG.companyName}</div>
          <p style={{ maxWidth: 320 }}>{FOOTER_CONFIG.tagline}</p>
        </div>
        <div className="footer-info">
          <div className="footer-section-title">Contact</div>
          <p>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, opacity: 0.6 }}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <a href={`tel:${FOOTER_CONFIG.phone}`}>{FOOTER_CONFIG.phone}</a>
          </p>
          <p>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, opacity: 0.6 }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <a href={`mailto:${FOOTER_CONFIG.email}`}>{FOOTER_CONFIG.email}</a>
          </p>
        </div>
        <div className="footer-info">
          <div className="footer-section-title">Address</div>
          <p>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, opacity: 0.6 }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {FOOTER_CONFIG.address}
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} {FOOTER_CONFIG.companyName}. All rights reserved.</span>
        <span style={{ opacity: 0.5, fontSize: 'var(--fs-xs)' }}>
          <a href="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>Admin</a>
        </span>
      </div>
    </footer>
  );
}
