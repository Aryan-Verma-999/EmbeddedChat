/**
 * Inject a Google Fonts stylesheet on demand.
 * De-duplicated by ID so repeated calls are safe.
 */
const injectGoogleFont = (family) => {
  const id = `ec-ai-font-${family.replace(/\s+/g, '-').toLowerCase()}`;
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
};

export default injectGoogleFont;
