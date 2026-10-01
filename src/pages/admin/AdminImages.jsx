import { useState } from 'react';
import { useStore, Actions } from '../../hooks/useStore';
import { imageService } from '../../services/imageService';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const SLOT_OPTIONS = [
  { value: 'hero', label: 'Hero Image', usage: 'Homepage hero banner' },
  { value: 'project', label: 'Project Main Image', usage: 'Project showcase section' },
  { value: 'gallery', label: 'Project Gallery', usage: 'Image gallery section' },
  { value: 'amenities', label: 'Amenities Image', usage: 'Amenities highlight' },
  { value: 'location', label: 'Location Image', usage: 'Location / map section' },
  { value: 'floorplan', label: 'Floor Plan', usage: 'Floor plan diagram' },
  { value: 'cta', label: 'CTA / Contact Image', usage: 'Contact or CTA section' },
  { value: 'other', label: 'Other', usage: 'General purpose' },
];

function getSlotLabel(slot) {
  const found = SLOT_OPTIONS.find((s) => s.value === slot);
  return found ? found.label : slot || 'Unassigned';
}

function getSlotUsage(slot) {
  const found = SLOT_OPTIONS.find((s) => s.value === slot);
  return found ? found.usage : '';
}

export default function AdminImages() {
  const { state, dispatch } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [addAlt, setAddAlt] = useState('');
  const [addSlot, setAddSlot] = useState('other');
  const [addFile, setAddFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [replacingId, setReplacingId] = useState(null);

  async function handleAdd() {
    if (!addName.trim() || !addFile) return;
    setUploading(true);
    try {
      const url = await imageService.upload(addFile);
      dispatch({
        type: Actions.ADD_IMAGE,
        payload: { name: addName.trim(), url, alt: addAlt.trim(), slot: addSlot },
      });
      setShowAdd(false);
      setAddName('');
      setAddAlt('');
      setAddSlot('other');
      setAddFile(null);
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleReplace(e, imgId) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setReplacingId(imgId);
    try {
      const url = await imageService.upload(file);
      dispatch({
        type: Actions.UPDATE_IMAGE,
        payload: { id: imgId, url },
      });
    } catch {
      alert('Replace failed');
    } finally {
      setUploading(false);
      setReplacingId(null);
    }
  }

  function handleDelete() {
    if (!deleteId) return;
    const img = state.images.find((i) => i.id === deleteId);
    if (img?.url) imageService.delete(img.url);
    dispatch({ type: Actions.DELETE_IMAGE, payload: deleteId });
    setDeleteId(null);
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3>Image Management ({state.images.length})</h3>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
            + Add Image
          </button>
        </div>
      </div>

      {state.images.length === 0 ? (
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <p>No images added yet. Click "Add Image" to get started.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="image-mgmt-grid">
          {state.images.map((img) => (
            <div className="image-mgmt-card" key={img.id}>
              <div className={`image-mgmt-preview${img.slot === 'floorplan' ? ' floorplan' : ''}`}>
                {img.url ? (
                  <img src={img.url} alt={img.alt || img.name} />
                ) : (
                  <div className="image-mgmt-placeholder">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <span>No image uploaded</span>
                  </div>
                )}
              </div>
              <div className="image-mgmt-body">
                <div className="image-mgmt-name">{img.name}</div>
                <div className="image-mgmt-slot">
                  <span className="badge badge-info">{getSlotLabel(img.slot)}</span>
                  {' '}
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-tertiary)' }}>
                    {getSlotUsage(img.slot)}
                  </span>
                </div>
                {img.alt && (
                  <div className="image-mgmt-alt">Alt: {img.alt}</div>
                )}
              </div>
              <div className="image-mgmt-actions">
                <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', flex: 1 }}>
                  {uploading && replacingId === img.id ? 'Uploading...' : (img.url ? 'Replace' : 'Upload')}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleReplace(e, img.id)}
                  />
                </label>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setDeleteId(img.id)}
                  style={{ flex: 1 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Image Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Image</h2>
              <button className="modal-close" onClick={() => setShowAdd(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Image Name <span className="required">*</span></label>
                <input
                  className="form-input"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="e.g. Project Hero Image"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Image Slot</label>
                <select
                  className="form-select"
                  value={addSlot}
                  onChange={(e) => setAddSlot(e.target.value)}
                >
                  {SLOT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label} — {s.usage}</option>
                  ))}
                </select>
                <div className="form-hint">Determines where this image is used on the public site</div>
              </div>
              <div className="form-group">
                <label className="form-label">Alt Text</label>
                <input
                  className="form-input"
                  value={addAlt}
                  onChange={(e) => setAddAlt(e.target.value)}
                  placeholder="Describe the image for accessibility"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Image File <span className="required">*</span></label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAddFile(e.target.files[0])}
                  className="form-input"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleAdd}
                disabled={!addName.trim() || !addFile || uploading}
              >
                {uploading ? 'Uploading...' : 'Add Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Image"
        message="Are you sure you want to delete this image? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
