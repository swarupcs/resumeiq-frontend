// src/pages/Render.jsx
//
// This page is ONLY for Puppeteer PDF generation — never linked to in the UI.
//
// Phase 3 — Feature 5: Protect /render from crawlers.
// Added <meta name="robots" content="noindex, nofollow"> via react-helmet-async
// (or a plain useEffect that injects it directly into document.head) so search
// engines never index this route. Also excluded in robots.txt.
//
// How PDF generation works:
// 1. Backend calls page.evaluateOnNewDocument() to inject window.__RESUME_DATA__
//    before any script runs on this page.
// 2. This component reads that data synchronously — no API call, no auth.
// 3. Puppeteer waits for [data-resume-ready] before generating the PDF.

import { useMemo, useEffect } from 'react';
import ResumePreview from '@/components/builder/ResumePreview';

const Render = () => {
  // Phase 3 — Feature 5: Inject noindex meta so this Puppeteer-only route
  // is never crawled or indexed by search engines.
  // Using a direct DOM approach avoids adding react-helmet as a dependency.
  useEffect(() => {
    const existing = document.querySelector('meta[name="robots"]');
    if (existing) {
      existing.setAttribute('content', 'noindex, nofollow');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      document.head.appendChild(meta);
    }

    // Cleanup: restore default on unmount (though this page is never
    // navigated away from in normal use — it's Puppeteer-only)
    return () => {
      const el = document.querySelector('meta[name="robots"]');
      if (el) el.remove();
    };
  }, []);

  const resumeData = useMemo(() => window.__RESUME_DATA__ ?? null, []);

  if (!resumeData) {
    return (
      <div style={{ padding: 40, fontFamily: 'sans-serif', color: '#666' }}>
        No resume data provided. This page is only accessible via PDF export.
      </div>
    );
  }

  return (
    <div
      data-resume-ready
      style={{ background: 'white', margin: 0, padding: 0 }}
    >
      <ResumePreview
        data={resumeData}
        template={resumeData.template ?? 'classic'}
        accentColor={resumeData.accent_color ?? '#3B82F6'}
      />
    </div>
  );
};

export default Render;
