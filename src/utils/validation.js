/**
 * Validation utility — generates validators from field configuration.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s()-]{7,15}$/;

/**
 * Validate a single field value against its configuration.
 * @param {Object} field - field config
 * @param {*} value - current value
 * @returns {string|null} error message or null
 */
export function validateField(field, value) {
  const { type, required, label } = field;

  // Required check
  if (required) {
    if (type === 'file') {
      if (!value) return `${label} is required`;
    } else if (type === 'checkbox') {
      // checkbox: at least one checked
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return `${label} is required`;
      }
    } else {
      if (value === undefined || value === null || String(value).trim() === '') {
        return `${label} is required`;
      }
    }
  }

  // Type-specific validation (only if value is provided)
  const strVal = String(value || '').trim();
  if (!strVal && !required) return null;
  if (!strVal) return null;

  switch (type) {
    case 'email':
      if (!EMAIL_RE.test(strVal)) return 'Please enter a valid email address';
      break;
    case 'phone':
      if (!PHONE_RE.test(strVal)) return 'Please enter a valid phone number';
      break;
    case 'number':
      if (isNaN(Number(strVal))) return 'Please enter a valid number';
      break;
    default:
      break;
  }

  return null;
}

/**
 * Validate all fields in a form.
 * @param {Array} fields - field configs
 * @param {Object} values - { [fieldName]: value }
 * @returns {{ valid: boolean, errors: Object }}
 */
export function validateForm(fields, values) {
  const errors = {};
  let valid = true;

  fields.forEach((field) => {
    const error = validateField(field, values[field.name]);
    if (error) {
      errors[field.name] = error;
      valid = false;
    }
  });

  return { valid, errors };
}
