import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore, Actions } from '../../hooks/useStore';
import FieldEditor from '../../components/admin/FieldEditor';
import ConfirmDialog from '../../components/common/ConfirmDialog';

/* ─── Drag handle icon ─── */
function DragHandle({ listeners, attributes }) {
  return (
    <div
      className="field-drag"
      {...listeners}
      {...attributes}
      title="Drag to reorder"
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9"  cy="5"  r="1.2" fill="currentColor" stroke="none" />
        <circle cx="15" cy="5"  r="1.2" fill="currentColor" stroke="none" />
        <circle cx="9"  cy="12" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="9"  cy="19" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="15" cy="19" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}

/* ─── Sortable field row ─── */
function SortableFieldItem({ field, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`field-list-item${isDragging ? ' field-list-item--dragging' : ''}`}
    >
      <DragHandle listeners={listeners} attributes={attributes} />
      <div className="field-info">
        <div className="field-label">{field.label}</div>
        <div className="field-meta">
          <span className="field-type-badge">{field.type}</span>
          <span>•</span>
          <span>{field.required ? 'Required' : 'Optional'}</span>
          {field.options?.length > 0 && (
            <>
              <span>•</span>
              <span>{field.options.length} options</span>
            </>
          )}
        </div>
      </div>
      <div className="field-actions">
        <button className="btn btn-outline btn-sm" onClick={onEdit}>Edit</button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function AdminForms() {
  const { state, dispatch } = useStore();
  const [editingFormId, setEditingFormId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFormName, setNewFormName] = useState('');
  const [newFormMessage, setNewFormMessage] = useState('Thank you for your submission!');
  const [editingField, setEditingField] = useState(null);
  const [fieldModalOpen, setFieldModalOpen] = useState(false);
  const [deleteFormId, setDeleteFormId] = useState(null);
  const [deleteFieldInfo, setDeleteFieldInfo] = useState(null);

  const editingForm = editingFormId ? state.forms.find((f) => f.id === editingFormId) : null;

  // DnD sensors — pointer for desktop, touch for mobile
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  // Create form
  function handleCreateForm() {
    if (!newFormName.trim()) return;
    dispatch({
      type: Actions.ADD_FORM,
      payload: { name: newFormName.trim(), successMessage: newFormMessage.trim() },
    });
    setShowCreateForm(false);
    setNewFormName('');
    setNewFormMessage('Thank you for your submission!');
  }

  // Update form meta
  function handleUpdateFormMeta(key, value) {
    if (!editingForm) return;
    dispatch({
      type: Actions.UPDATE_FORM,
      payload: { id: editingForm.id, [key]: value },
    });
  }

  // Delete form
  function handleDeleteForm() {
    if (!deleteFormId) return;
    dispatch({ type: Actions.DELETE_FORM, payload: deleteFormId });
    setDeleteFormId(null);
    if (editingFormId === deleteFormId) setEditingFormId(null);
  }

  // Add / Edit field
  function handleSaveField(fieldData) {
    if (!editingFormId) return;
    if (editingField) {
      dispatch({
        type: Actions.UPDATE_FIELD,
        payload: { formId: editingFormId, field: { ...editingField, ...fieldData } },
      });
    } else {
      dispatch({
        type: Actions.ADD_FIELD,
        payload: { formId: editingFormId, field: fieldData },
      });
    }
    setFieldModalOpen(false);
    setEditingField(null);
  }

  // Delete field
  function handleDeleteField() {
    if (!deleteFieldInfo) return;
    dispatch({
      type: Actions.DELETE_FIELD,
      payload: { formId: deleteFieldInfo.formId, fieldId: deleteFieldInfo.fieldId },
    });
    setDeleteFieldInfo(null);
  }

  // DnD reorder handler
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id || !editingForm) return;

    const sorted = [...editingForm.fields].sort((a, b) => a.order - b.order);
    const oldIndex = sorted.findIndex((f) => f.id === active.id);
    const newIndex = sorted.findIndex((f) => f.id === over.id);
    const reordered = arrayMove(sorted, oldIndex, newIndex);

    dispatch({
      type: Actions.REORDER_FIELDS,
      payload: { formId: editingFormId, fields: reordered },
    });
  }

  // ─── Forms List View ───
  if (!editingFormId) {
    return (
      <div>
        <div className="card">
          <div className="card-header">
            <h3>Forms ({state.forms.length})</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowCreateForm(true)}>
              + Create Form
            </button>
          </div>
          <div className="card-body">
            {state.forms.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                </div>
                <p>No forms created yet. Click "Create Form" to get started.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Form Name</th>
                      <th>Fields</th>
                      <th>Success Message</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.forms.map((form) => (
                      <tr key={form.id}>
                        <td style={{ fontWeight: 500 }}>{form.name}</td>
                        <td>
                          <span className="badge badge-default">{form.fields.length} fields</span>
                        </td>
                        <td style={{ color: 'var(--clr-text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {form.successMessage}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => setEditingFormId(form.id)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => setDeleteFormId(form.id)}
                            >
                              Delete
                            </button>
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

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create Form</h2>
                <button className="modal-close" onClick={() => setShowCreateForm(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Form Name <span className="required">*</span></label>
                  <input
                    className="form-input"
                    value={newFormName}
                    onChange={(e) => setNewFormName(e.target.value)}
                    placeholder="e.g. Property Enquiry"
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Success Message</label>
                  <textarea
                    className="form-textarea"
                    value={newFormMessage}
                    onChange={(e) => setNewFormMessage(e.target.value)}
                    placeholder="Message shown after successful submission"
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setShowCreateForm(false)}>Cancel</button>
                <button
                  className="btn btn-primary"
                  onClick={handleCreateForm}
                  disabled={!newFormName.trim()}
                >
                  Create Form
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={!!deleteFormId}
          title="Delete Form"
          message="Are you sure you want to delete this form? All fields will be lost. Links and popups using this form will be unlinked."
          onConfirm={handleDeleteForm}
          onCancel={() => setDeleteFormId(null)}
        />
      </div>
    );
  }

  // ─── Form Editor View ───
  const sortedFields = editingForm ? [...editingForm.fields].sort((a, b) => a.order - b.order) : [];

  return (
    <div>
      <button
        className="btn btn-outline btn-sm"
        onClick={() => setEditingFormId(null)}
        style={{ marginBottom: 20 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Forms
      </button>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3>Form Settings</h3>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Form Name</label>
            <input
              className="form-input"
              value={editingForm?.name || ''}
              onChange={(e) => handleUpdateFormMeta('name', e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Success Message</label>
            <textarea
              className="form-textarea"
              value={editingForm?.successMessage || ''}
              onChange={(e) => handleUpdateFormMeta('successMessage', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Fields ({sortedFields.length})</h3>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => { setEditingField(null); setFieldModalOpen(true); }}
          >
            + Add Field
          </button>
        </div>
        <div className="card-body">
          {sortedFields.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <p>No fields added yet. Click "+ Add Field" to start building your form.</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedFields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                {sortedFields.map((field) => (
                  <SortableFieldItem
                    key={field.id}
                    field={field}
                    onEdit={() => { setEditingField(field); setFieldModalOpen(true); }}
                    onDelete={() => setDeleteFieldInfo({ formId: editingFormId, fieldId: field.id, label: field.label })}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      <FieldEditor
        open={fieldModalOpen}
        field={editingField}
        onSave={handleSaveField}
        onClose={() => { setFieldModalOpen(false); setEditingField(null); }}
      />

      <ConfirmDialog
        open={!!deleteFieldInfo}
        title="Delete Field"
        message={`Are you sure you want to delete the "${deleteFieldInfo?.label}" field?`}
        onConfirm={handleDeleteField}
        onCancel={() => setDeleteFieldInfo(null)}
      />
    </div>
  );
}
