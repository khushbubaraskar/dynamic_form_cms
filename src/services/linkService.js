/**
 * Link service.
 * Currently reads from the context store; stub for future API integration.
 */

export const linkService = {
  /**
   * Find a link configuration by its path.
   * @param {Array} links - all configured links
   * @param {string} path - current URL path
   * @returns {Object|undefined}
   */
  findByPath(links, path) {
    return links.find((l) => l.path === path);
  },

  /**
   * Find the form ID assigned to a path.
   */
  getFormIdForPath(links, path) {
    const link = this.findByPath(links, path);
    return link ? link.formId : null;
  },
};
