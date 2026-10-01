import { useState, useRef } from 'react';
import { validateForm } from '../../utils/validation';
import { formService } from '../../services/formService';

/**
 * DynamicFormRenderer — renders any form from its configuration.
 * This is the single reusable component that renders ALL forms.
 */
export default function DynamicFormRenderer({ form, onSuccess }) {
  const [values, setValues] = useState({});
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRefs = useRef({});

  if (!form || !form.fields) return null;

  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order);

  function handleChange(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleCheckboxChange(name, option, checked) {
    setValues((prev) => {
      const current = prev[name] || [];
      if (checked) {
        return { ...prev, [name]: [...current, option] };
      } else {
        return { ...prev, [name]: current.filter((v) => v !== option) };
      }
    });
  }

  function handleFileChange(name, file) {
    if (file) {
      setFiles((prev) => ({ ...prev, [name]: file }));
      setValues((prev) => ({ ...prev, [name]: file.name }));
    }
  }

  function handleFileRemove(name) {
    setFiles((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setValues((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    if (fileRefs.current[name]) {
      fileRefs.current[name].value = '';
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { valid, errors: errs } = validateForm(sortedFields, values);
    setErrors(errs);
    if (!valid) return;

    setSubmitting(true);
    try {
      await formService.submit(form.id, { ...values });
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch {
      setErrors({ _form: 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setValues({});
    setFiles({});
    setErrors({});
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div className="success-message">
        <div className="success-icon">✅</div>
        <h3>Submitted Successfully</h3>
        <p>{form.successMessage || 'Thank you for your submission!'}</p>
        <button className="btn btn-outline" onClick={handleReset} style={{ marginTop: 16 }}>
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {errors._form && (
        <div className="form-error" style={{ marginBottom: 16, textAlign: 'center' }}>
          {errors._form}
        </div>
      )}
      {sortedFields.map((field) => (
        <div className="form-group" key={field.id}>
          <label className="form-label" htmlFor={`field-${field.id}`}>
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          {renderField(field, values, files, fileRefs, handleChange, handleCheckboxChange, handleFileChange, handleFileRemove, errors)}
          {errors[field.name] && <div className="form-error">{errors[field.name]}</div>}
        </div>
      ))}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={submitting}
        style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
      >
        {submitting ? <><span className="spinner" /> Submitting...</> : 'Submit'}
      </button>
    </form>
  );
}

function renderField(field, values, files, fileRefs, onChange, onCheckbox, onFile, onFileRemove, errors) {
  const id = `field-${field.id}`;
  const val = values[field.name] || '';
  const errClass = errors[field.name] ? ' error' : '';

  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'number':
      return (
        <input
          id={id}
          className={`form-input${errClass}`}
          type={field.type === 'phone' ? 'tel' : field.type}
          value={val}
          placeholder={field.placeholder || ''}
          required={field.required}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );

    case 'textarea':
      return (
        <textarea
          id={id}
          className={`form-textarea${errClass}`}
          value={val}
          placeholder={field.placeholder || ''}
          required={field.required}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );

    case 'select':
      return (
        <select
          id={id}
          className={`form-select${errClass}`}
          value={val}
          required={field.required}
          onChange={(e) => onChange(field.name, e.target.value)}
        >
          <option value="">{field.placeholder || 'Select...'}</option>
          {(field.options || []).map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      );

    case 'radio':
      return (
        <div>
          {(field.options || []).map((opt, i) => (
            <div className="form-check" key={i}>
              <input
                type="radio"
                id={`${id}-${i}`}
                name={field.name}
                value={opt}
                checked={val === opt}
                onChange={(e) => onChange(field.name, e.target.value)}
              />
              <label htmlFor={`${id}-${i}`}>{opt}</label>
            </div>
          ))}
        </div>
      );

    case 'checkbox':
      return (
        <div>
          {(field.options || []).length > 0 ? (
            field.options.map((opt, i) => (
              <div className="form-check" key={i}>
                <input
                  type="checkbox"
                  id={`${id}-${i}`}
                  value={opt}
                  checked={(values[field.name] || []).includes(opt)}
                  onChange={(e) => onCheckbox(field.name, opt, e.target.checked)}
                />
                <label htmlFor={`${id}-${i}`}>{opt}</label>
              </div>
            ))
          ) : (
            <div className="form-check">
              <input
                type="checkbox"
                id={id}
                checked={!!val}
                onChange={(e) => onChange(field.name, e.target.checked)}
              />
              <label htmlFor={id}>{field.placeholder || field.label}</label>
            </div>
          )}
        </div>
      );

    case 'file':
      return (
        <div className="file-input-wrapper">
          <input
            id={id}
            type="file"
            ref={(el) => { fileRefs.current[field.name] = el; }}
            onChange={(e) => onFile(field.name, e.target.files[0])}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => fileRefs.current[field.name]?.click()}
          >
            📎 Choose File
          </button>
          {files[field.name] ? (
            <>
              <span className="file-name">{files[field.name].name}</span>
              <button type="button" className="file-remove" onClick={() => onFileRemove(field.name)}>
                Remove
              </button>
            </>
          ) : (
            <span className="file-name">No file selected</span>
          )}
        </div>
      );

    default:
      return (
        <input
          id={id}
          className={`form-input${errClass}`}
          type="text"
          value={val}
          placeholder={field.placeholder || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
  }
}
