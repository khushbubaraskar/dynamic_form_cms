import { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { initialForms, initialLinks, initialImages, initialPopups } from '../data/initialData';

const STORAGE_KEY = 'dfc_store';

/* ─── helpers ─── */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ─── initial state ─── */
const defaultState = {
  forms: initialForms,
  links: initialLinks,
  images: initialImages,
  popups: initialPopups,
};

/* ─── action types ─── */
export const Actions = {
  // Forms
  ADD_FORM: 'ADD_FORM',
  UPDATE_FORM: 'UPDATE_FORM',
  DELETE_FORM: 'DELETE_FORM',
  // Fields
  ADD_FIELD: 'ADD_FIELD',
  UPDATE_FIELD: 'UPDATE_FIELD',
  DELETE_FIELD: 'DELETE_FIELD',
  REORDER_FIELDS: 'REORDER_FIELDS',
  // Links
  ADD_LINK: 'ADD_LINK',
  UPDATE_LINK: 'UPDATE_LINK',
  DELETE_LINK: 'DELETE_LINK',
  // Images
  ADD_IMAGE: 'ADD_IMAGE',
  UPDATE_IMAGE: 'UPDATE_IMAGE',
  DELETE_IMAGE: 'DELETE_IMAGE',
  // Popups
  ADD_POPUP: 'ADD_POPUP',
  UPDATE_POPUP: 'UPDATE_POPUP',
  DELETE_POPUP: 'DELETE_POPUP',
  // Reset
  RESET: 'RESET',
};

/* ─── reducer ─── */
function reducer(state, action) {
  const now = new Date().toISOString();

  switch (action.type) {
    /* ── Forms ── */
    case Actions.ADD_FORM: {
      const newForm = {
        id: uuidv4(),
        name: action.payload.name || 'Untitled Form',
        successMessage: action.payload.successMessage || 'Thank you for your submission!',
        createdAt: now,
        updatedAt: now,
        fields: [],
      };
      return { ...state, forms: [...state.forms, newForm] };
    }
    case Actions.UPDATE_FORM: {
      return {
        ...state,
        forms: state.forms.map((f) =>
          f.id === action.payload.id ? { ...f, ...action.payload, updatedAt: now } : f
        ),
      };
    }
    case Actions.DELETE_FORM: {
      return {
        ...state,
        forms: state.forms.filter((f) => f.id !== action.payload),
        links: state.links.map((l) =>
          l.formId === action.payload ? { ...l, formId: '' } : l
        ),
        popups: state.popups.map((p) =>
          p.formId === action.payload ? { ...p, formId: '', enabled: false } : p
        ),
      };
    }

    /* ── Fields ── */
    case Actions.ADD_FIELD: {
      const { formId, field } = action.payload;
      return {
        ...state,
        forms: state.forms.map((f) => {
          if (f.id !== formId) return f;
          const newField = { ...field, id: uuidv4(), order: f.fields.length };
          return { ...f, fields: [...f.fields, newField], updatedAt: now };
        }),
      };
    }
    case Actions.UPDATE_FIELD: {
      const { formId, field } = action.payload;
      return {
        ...state,
        forms: state.forms.map((f) => {
          if (f.id !== formId) return f;
          return {
            ...f,
            fields: f.fields.map((fld) => (fld.id === field.id ? { ...fld, ...field } : fld)),
            updatedAt: now,
          };
        }),
      };
    }
    case Actions.DELETE_FIELD: {
      const { formId, fieldId } = action.payload;
      return {
        ...state,
        forms: state.forms.map((f) => {
          if (f.id !== formId) return f;
          const filtered = f.fields.filter((fld) => fld.id !== fieldId);
          return {
            ...f,
            fields: filtered.map((fld, i) => ({ ...fld, order: i })),
            updatedAt: now,
          };
        }),
      };
    }
    case Actions.REORDER_FIELDS: {
      const { formId, fields } = action.payload;
      return {
        ...state,
        forms: state.forms.map((f) => {
          if (f.id !== formId) return f;
          return { ...f, fields: fields.map((fld, i) => ({ ...fld, order: i })), updatedAt: now };
        }),
      };
    }

    /* ── Links ── */
    case Actions.ADD_LINK: {
      const newLink = { id: uuidv4(), ...action.payload };
      return { ...state, links: [...state.links, newLink] };
    }
    case Actions.UPDATE_LINK: {
      return {
        ...state,
        links: state.links.map((l) =>
          l.id === action.payload.id ? { ...l, ...action.payload } : l
        ),
      };
    }
    case Actions.DELETE_LINK: {
      return { ...state, links: state.links.filter((l) => l.id !== action.payload) };
    }

    /* ── Images ── */
    case Actions.ADD_IMAGE: {
      const newImg = { id: uuidv4(), ...action.payload };
      return { ...state, images: [...state.images, newImg] };
    }
    case Actions.UPDATE_IMAGE: {
      return {
        ...state,
        images: state.images.map((img) =>
          img.id === action.payload.id ? { ...img, ...action.payload } : img
        ),
      };
    }
    case Actions.DELETE_IMAGE: {
      return { ...state, images: state.images.filter((img) => img.id !== action.payload) };
    }

    /* ── Popups ── */
    case Actions.ADD_POPUP: {
      const newPopup = { id: uuidv4(), enabled: true, trigger: 'scroll', scrollPercentage: 50, ...action.payload };
      return { ...state, popups: [...state.popups, newPopup] };
    }
    case Actions.UPDATE_POPUP: {
      return {
        ...state,
        popups: state.popups.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      };
    }
    case Actions.DELETE_POPUP: {
      return { ...state, popups: state.popups.filter((p) => p.id !== action.payload) };
    }

    /* ── Reset ── */
    case Actions.RESET:
      return { ...defaultState };

    default:
      return state;
  }
}

/* ─── Context ─── */
const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, loadState() || defaultState);

  // Persist on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
