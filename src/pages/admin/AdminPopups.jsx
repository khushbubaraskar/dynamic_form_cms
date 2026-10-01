import { useState } from 'react';
import { useStore, Actions } from '../../hooks/useStore';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function AdminPopups() {
  const { state, dispatch } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ path: '/', formId: '', enabled: true, trigger: 'scroll', scrollPercentage: 50 });
  const [deleteId, setDeleteId] = useState(null);

  function openCreate() {
    setEditing(null);
    setFormData({ path: '/', formId: '', enabled: true, trigger: 'scroll', scrollPercentage: 50 });
    setShowModal(true);
  }

  function openEdit(popup) {
    setEditing(popup);
    setFormData({
      path: popup.path,
      formId: popup.formId,
      enabled: popup.enabled,
      trigger: popup.trigger,
      scrollPercentage: popup.scrollPercentage,
    });
    setShowModal(true);
  }

  function handleSave() {
    if (!formData.path.trim() || !formData.formId) return;
    const path = formData.path.startsWith('/') ? formData.path : '/' + formData.path;
    if (editing) {
      dispatch({
        type: Actions.UPDATE_POPUP,
        payload: { id: editing.id, ...formData, path },
      });
    } else {
      dispatch({
        type: Actions.ADD_POPUP,
        payload: { ...formData, path },
      });
    }
    setShowModal(false);
  }

  function toggleEnabled(popup) {
    dispatch({
      type: Actions.UPDATE_POPUP,
      payload: { id: popup.id, enabled: !popup.enabled },
    });
  }

  function handleDelete() {
    if (!deleteId) return;
    dispatch({ type: Actions.DELETE_POPUP, payload: deleteId });
    setDeleteId(null);
  }

  function getFormName(formId) {
    const form = state.forms.find((f) => f.id === formId);
    return form ? form.name : '—';
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h3>Popup Settings ({state.popups.length})</h3>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            + Add Popup
          </button>
        </div>
        <div className="card-body">
          {state.popups.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p>No popup configurations. Click "Add Popup" to create one.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Form</th>
                    <th>Trigger</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.popups.map((popup) => (
                    <tr key={popup.id}>
                      <td><code style={{ background: 'var(--clr-bg)', padding: '3px 10px', borderRadius: 4, fontSize: 'var(--fs-xs)', fontFamily: 'monospace' }}>{popup.path}</code></td>
                      <td>{getFormName(popup.formId)}</td>
                      <td>
                        <span className="badge badge-default">{popup.scrollPercentage}% scroll</span>
                      </td>
                      <td>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={popup.enabled}
                            onChange={() => toggleEnabled(popup)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-outline btn-sm" onClick={() => openEdit(popup)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(popup.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Popup' : 'Add Popup'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Page Path <span className="required">*</span></label>
                <input
                  className="form-input"
                  value={formData.path}
                  onChange={(e) => setFormData((p) => ({ ...p, path: e.target.value }))}
                  placeholder="e.g. /property-enquiry"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Form <span className="required">*</span></label>
                <select
                  className="form-select"
                  value={formData.formId}
                  onChange={(e) => setFormData((p) => ({ ...p, formId: e.target.value }))}
                >
                  <option value="">— Select a form —</option>
                  {state.forms.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Trigger</label>
                <select
                  className="form-select"
                  value={formData.trigger}
                  onChange={(e) => setFormData((p) => ({ ...p, trigger: e.target.value }))}
                >
                  <option value="scroll">Scroll Percentage</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Scroll Percentage (%)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="100"
                  value={formData.scrollPercentage}
                  onChange={(e) => setFormData((p) => ({ ...p, scrollPercentage: Number(e.target.value) }))}
                />
                <div className="form-hint">Popup appears when user scrolls past this percentage</div>
              </div>
              <div className="form-group">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="popup-enabled"
                    checked={formData.enabled}
                    onChange={(e) => setFormData((p) => ({ ...p, enabled: e.target.checked }))}
                  />
                  <label htmlFor="popup-enabled">Enabled</label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!formData.path.trim() || !formData.formId}
              >
                {editing ? 'Update Popup' : 'Add Popup'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Popup"
        message="Are you sure you want to delete this popup configuration?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
