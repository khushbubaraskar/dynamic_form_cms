import { useState, useEffect } from 'react';

/**
 * Returns the current scroll percentage (0–100).
 */
export function useScrollPercentage() {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) {
        setPercentage(0);
        return;
      }
      setPercentage(Math.round((scrollTop / docHeight) * 100));
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return percentage;
}
