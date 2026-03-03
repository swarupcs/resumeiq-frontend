// src/pages/Render.jsx
//
// This page is ONLY for Puppeteer PDF generation — never linked to in the UI.
//
// How it works:
// 1. Backend calls page.evaluateOnNewDocument() to inject window.__RESUME_DATA__
//    before any script runs on this page.
// 2. This component reads that data synchronously — no API call, no auth, no
//    network request. The PDF always reflects the exact data passed from the
//    frontend, including unsaved changes.
// 3. Puppeteer waits for [data-resume-ready] before generating the PDF.

import { useMemo } from 'react';
import ResumePreview from '@/components/builder/ResumePreview';

const Render = () => {
  // Read data injected by Puppeteer via page.evaluateOnNewDocument.
  // useMemo so it's only read once — window.__RESUME_DATA__ never changes.
  const resumeData = useMemo(() => window.__RESUME_DATA__ ?? null, []);

  if (!resumeData) {
    return (
      <div style={{ padding: 40, fontFamily: 'sans-serif', color: '#666' }}>
        No resume data provided. This page is only accessible via PDF export.
      </div>
    );
  }

  return (
    // data-resume-ready signals to Puppeteer that rendering is complete
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
