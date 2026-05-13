import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

posthog.init(POSTHOG_KEY, {
  api_host: POSTHOG_HOST,
  capture_pageview: true,        // auto page_view on load
  capture_pageleave: true,       // bounce tracking
  autocapture: false,            // manual only — keeps noise low
  persistence: 'localStorage',
  loaded: (ph) => {
    // identify with UTM params as person properties on first visit
    const utms = getUTMs();
    if (Object.keys(utms).length > 0) {
      ph.setPersonPropertiesForFlags(utms);
    }
  },
});

function getUTMs() {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const result = {};
  utmKeys.forEach(k => {
    const v = params.get(k);
    if (v) result[k] = v;
  });
  return result;
}

// Global track function — called from inline scripts in index.html
window.track = (event, props = {}) => {
  posthog.capture(event, {
    ...getUTMs(),
    ...props,
  });
};

// Track CTA clicks — attach to all "Try the app" links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href*="app.getheadstrong.xyz"]').forEach(el => {
    el.addEventListener('click', () => {
      window.track('cta_clicked', {
        cta_text: el.textContent.trim(),
        cta_location: el.closest('section')?.id || el.closest('header') ? 'header' : 'unknown',
      });
    });
  });

  // Track footer social links
  document.querySelectorAll('footer a[href*="instagram"], footer a[href*="tiktok"]').forEach(el => {
    el.addEventListener('click', () => {
      window.track('social_link_clicked', { platform: el.href.includes('instagram') ? 'instagram' : 'tiktok' });
    });
  });

  // Track quiz CTA clicks (ghost buttons linking to #quiz section)
  document.querySelectorAll('a[href="#quiz"], a[href*="#quiz"]').forEach(el => {
    el.addEventListener('click', () => {
      window.track('quiz_cta_clicked', {
        cta_text: el.textContent.trim(),
        cta_location: el.closest('section')?.id || (el.closest('header') ? 'header' : 'unknown'),
      });
    });
  });

  // Track crisis resource clicks (988 and crisis links)
  document.querySelectorAll('a[href="tel:988"], a[href*="crisistextline"], a[href*="suicidepreventionlifeline"]').forEach(el => {
    el.addEventListener('click', () => {
      window.track('crisis_resource_clicked', {
        resource: el.href.startsWith('tel:') ? '988' : el.href,
      });
    });
  });
});

export { posthog };
