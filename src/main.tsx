import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import '@/app/i18n';
import '@/styles.css';
import { applyRoleFromUrl } from '@/features/preferences/roleUrl';

// A shared ?role=frontend|ai link must open on the right lens immediately, so
// the store is seeded from the URL before the first render. Invalid values are
// ignored and the saved preference (or the `ai` default) stays in charge.
applyRoleFromUrl(window.location.search);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
