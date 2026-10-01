import { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select / Dropdown' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'file', label: 'File Upload' },
];

const defaultField = {
  label: '',
  name: '',
  type: 'text',
  required: false,
  placeholder: '',
  options: [],
};

export default function FieldEditor({ open, field, onSave, onClose }) {
  const [data, setData] = useState(defaultField);
  const [optionsText, setOptionsText] = useState('');

  useEffect(() => {
    if (field) {
      setData(field);
      setOptionsText((field.options || []).join('\n'));
    } else {
      setData(defaultField);
      setOptionsText('');
    }
  }, [field, open]);

  function handleChange(key, value) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  // Auto-generate field name from label
  function handleLabelChange(label) {
    setData((prev) => ({
      ...prev,
      label,
      name: prev.name && field ? prev.name : label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
    }));
  }

  function handleSave() {
    if (!data.label.trim()) return;
    const options = ['select', 'radio', 'checkbox'].includes(data.type)
      ? optionsText.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];
    onSave({ ...data, options });
  }

  const needsOptions = ['select', 'radio', 'checkbox'].includes(data.type);

  return (
    <Modal
      open={open}
      title={field ? 'Edit Field' : 'Add Field'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!data.label.trim()}>
            {field ? 'Update Field' : 'Add Field'}
          </button>
        </>
      }
    >
      <div className="form-group">
        <label className="form-label">Field Label <span className="required">*</span></label>
        <input
          className="form-input"
          value={data.label}
          onChange={(e) => handleLabelChange(e.target.value)}
          placeholder="e.g. Full Name"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Field Name / Key</label>
        <input
          className="form-input"
          value={data.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. full_name"
        />
        <div className="form-hint">Used as the form data key</div>
      </div>

      <div className="form-group">
        <label className="form-label">Field Type</label>
        <select
          className="form-select"
          value={data.type}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          {FIELD_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Placeholder</label>
        <input
          className="form-input"
          value={data.placeholder}
          onChange={(e) => handleChange('placeholder', e.target.value)}
          placeholder="Enter placeholder text"
        />
      </div>

      <div className="form-group">
        <div className="form-check">
          <input
            type="checkbox"
            id="field-required"
            checked={data.required}
            onChange={(e) => handleChange('required', e.target.checked)}
          />
          <label htmlFor="field-required">Required field</label>
        </div>
      </div>

      {needsOptions && (
        <div className="form-group">
          <label className="form-label">Options (one per line)</label>
          <textarea
            className="form-textarea"
            value={optionsText}
            onChange={(e) => setOptionsText(e.target.value)}
            placeholder={"Option 1\nOption 2\nOption 3"}
            rows={4}
          />
        </div>
      )}
    </Modal>
  );
}
