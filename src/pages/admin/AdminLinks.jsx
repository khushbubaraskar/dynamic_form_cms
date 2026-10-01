import { useState } from 'react';
import { useStore, Actions } from '../../hooks/useStore';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function AdminLinks() {
  const { state, dispatch } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', path: '', formId: '' });
  const [deleteId, setDeleteId] = useState(null);

  function openCreate() {
    setEditing(null);
    setFormData({ name: '', path: '/', formId: '' });
    setShowModal(true);
  }

  function openEdit(link) {
    setEditing(link);
    setFormData({ name: link.name, path: link.path, formId: link.formId });
    setShowModal(true);
  }

  function handleSave() {
    if (!formData.name.trim() || !formData.path.trim()) return;
    // Ensure path starts with /
    const path = formData.path.startsWith('/') ? formData.path : '/' + formData.path;
    if (editing) {
      dispatch({
        type: Actions.UPDATE_LINK,
        payload: { id: editing.id, name: formData.name.trim(), path, formId: formData.formId },
      });
    } else {
      dispatch({
        type: Actions.ADD_LINK,
        payload: { name: formData.name.trim(), path, formId: formData.formId },
      });
    }
    setShowModal(false);
  }

  function handleDelete() {
    if (!deleteId) return;
    dispatch({ type: Actions.DELETE_LINK, payload: deleteId });
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
          <h3>Links ({state.links.length})</h3>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            + Add Link
          </button>
        </div>
        <div className="card-body">
          {state.links.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <p>No links configured. Click "Add Link" to create a route.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Link Name</th>
                    <th>Path</th>
                    <th>Assigned Form</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.links.map((link) => (
                    <tr key={link.id}>
                      <td style={{ fontWeight: 500 }}>{link.name}</td>
                      <td><code style={{ background: 'var(--clr-bg)', padding: '3px 10px', borderRadius: 4, fontSize: 'var(--fs-xs)', fontFamily: 'monospace' }}>{link.path}</code></td>
                      <td>
                        {link.formId ? (
                          <span className="badge badge-success">{getFormName(link.formId)}</span>
                        ) : (
                          <span className="badge badge-warning">No form</span>
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-outline btn-sm" onClick={() => openEdit(link)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(link.id)}>Delete</button>
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
              <h2>{editing ? 'Edit Link' : 'Add Link'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Link Name <span className="required">*</span></label>
                <input
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Property Enquiry"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Path <span className="required">*</span></label>
                <input
                  className="form-input"
                  value={formData.path}
                  onChange={(e) => setFormData((p) => ({ ...p, path: e.target.value }))}
                  placeholder="e.g. /property-enquiry"
                />
                <div className="form-hint">URL path for this page (must start with /)</div>
              </div>
              <div className="form-group">
                <label className="form-label">Assigned Form</label>
                <select
                  className="form-select"
                  value={formData.formId}
                  onChange={(e) => setFormData((p) => ({ ...p, formId: e.target.value }))}
                >
                  <option value="">— No form —</option>
                  {state.forms.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!formData.name.trim() || !formData.path.trim()}
              >
                {editing ? 'Update Link' : 'Add Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Link"
        message="Are you sure you want to delete this link?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
