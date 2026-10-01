import { useState } from 'react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="modal-body">
          <div className="confirm-body">
            <div className="confirm-icon">⚠️</div>
            <h3 style={{ marginBottom: 8 }}>{title || 'Confirm Delete'}</h3>
            <p>{message || 'Are you sure? This action cannot be undone.'}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
