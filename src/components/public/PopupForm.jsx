import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';
import { useScrollPercentage } from '../../hooks/useScrollPercentage';
import DynamicFormRenderer from '../forms/DynamicFormRenderer';

/**
 * PopupForm — listens for scroll trigger and shows the configured popup form.
 * Fully configuration-driven: it reads popup settings from the store.
 */
export default function PopupForm() {
  const { state } = useStore();
  const location = useLocation();
  const scrollPct = useScrollPercentage();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Find active popup config for current path
  const popup = state.popups.find(
    (p) => p.enabled && p.path === location.pathname
  );
  const form = popup ? state.forms.find((f) => f.id === popup.formId) : null;

  // Reset dismissed state when navigating to a different page
  useEffect(() => {
    setDismissed(false);
    setVisible(false);
  }, [location.pathname]);

  // Trigger popup when scroll reaches configured percentage
  useEffect(() => {
    if (!popup || !form || dismissed) return;
    if (popup.trigger === 'scroll' && scrollPct >= popup.scrollPercentage) {
      setVisible(true);
    }
  }, [scrollPct, popup, form, dismissed]);

  function handleClose() {
    setVisible(false);
    setDismissed(true);
  }

  if (!visible || !form) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Interested in this property?</h3>
          <button className="modal-close" onClick={handleClose} aria-label="Close popup">
            &times;
          </button>
        </div>
        <p className="popup-lead">
          Fill in your details and our team will get back to you within 24 hours.
        </p>
        <div className="popup-body">
          <DynamicFormRenderer form={form} onSuccess={() => {}} />
        </div>
      </div>
    </div>
  );
}
