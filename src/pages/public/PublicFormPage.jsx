import { useLocation } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';
import { linkService } from '../../services/linkService';
import DynamicFormRenderer from '../../components/forms/DynamicFormRenderer';

/**
 * PublicFormPage — the dynamic link→form page.
 * 
 * Flow:
 *   Current URL → Find configured Link → Get linked formId
 *   → Load form configuration → Render Dynamic Form
 *
 * No hardcoded form logic — everything is configuration-driven.
 */
export default function PublicFormPage() {
  const { state } = useStore();
  const location = useLocation();

  // Dynamic resolution: URL → Link → Form
  const link = linkService.findByPath(state.links, location.pathname);
  const form = link ? state.forms.find((f) => f.id === link.formId) : null;

  if (!link) {
    return (
      <div className="form-section" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ marginBottom: 8 }}>Page Not Found</h2>
        <p style={{ color: 'var(--clr-text-secondary)' }}>
          No link configured for this path. Check the admin panel to create one.
        </p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="form-section" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ marginBottom: 8 }}>{link.name}</h2>
        <p style={{ color: 'var(--clr-text-secondary)' }}>
          No form is currently assigned to this link. Configure it in the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Give the page enough height so scroll popups can trigger */}
      <div className="form-section">
        <h2>{link.name}</h2>
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-body">
            <DynamicFormRenderer form={form} />
          </div>
        </div>
      </div>

      {/* Extra height to allow scroll-triggered popups to work */}
      <div style={{ minHeight: '60vh', padding: '48px 24px', background: 'var(--clr-bg)' }}>
        <div className="section-centered">
          <h2>Why Choose Us?</h2>
          <p>
            Our team is dedicated to providing the best experience. Fill out the form above 
            and we'll get back to you shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
