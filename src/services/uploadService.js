/**
 * File upload service for form file fields.
 * Replace with real backend/cloud upload when ready.
 */

export const uploadService = {
  /**
   * Upload a file submitted through a form.
   * @param {File} file
   * @returns {Promise<{success: boolean, fileName: string, url: string}>}
   */
  async upload(file) {
    await new Promise((r) => setTimeout(r, 500));
    // Mock: create a data URL for demo
    const url = URL.createObjectURL(file);
    return {
      success: true,
      fileName: file.name,
      url,
    };
  },
};
