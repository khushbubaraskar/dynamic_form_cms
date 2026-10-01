/**
 * Form submission service.
 * Replace this mock implementation with real API calls when backend is ready.
 */

const STORAGE_KEY = 'dfc_submissions';

function getSubmissions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export const formService = {
  /**
   * Submit form data.
   * @param {string} formId
   * @param {Object} data - key/value form data
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async submit(formId, data) {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const submissions = getSubmissions();
    submissions.push({
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      formId,
      data,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));

    return { success: true, message: 'Submitted successfully.' };
  },

  /**
   * Get all submissions for a form.
   */
  async getByFormId(formId) {
    await new Promise((r) => setTimeout(r, 200));
    return getSubmissions().filter((s) => s.formId === formId);
  },

  /**
   * Get all submissions.
   */
  async getAll() {
    await new Promise((r) => setTimeout(r, 200));
    return getSubmissions();
  },
};
