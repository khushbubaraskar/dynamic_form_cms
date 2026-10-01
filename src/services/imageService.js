/**
 * Image service — abstract image storage.
 * Replace with Cloudinary / S3 / backend API when ready.
 */

export const imageService = {
  /**
   * Upload an image file and return a local object URL.
   * In production, upload to cloud storage and return the remote URL.
   * @param {File} file
   * @returns {Promise<string>} url
   */
  async upload(file) {
    await new Promise((r) => setTimeout(r, 400));
    // Create a persistent data URL for demo purposes
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Delete an image by URL.
   * In production, delete from cloud storage.
   */
  async delete(url) {
    await new Promise((r) => setTimeout(r, 200));
    // If using object URLs, revoke them
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
    return { success: true };
  },
};
