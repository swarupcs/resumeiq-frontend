import { useEffect } from 'react';
import ResumePreview from '@/components/builder/ResumePreview';

export const Render = () => {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const resumeData =
    (((window as unknown) as Record<string, unknown>).__RESUME_DATA__ as
      | Parameters<typeof ResumePreview>[0]['data']
      | null) ?? null;

  if (!resumeData)
    return (
      <div style={{ padding: 40, fontFamily: 'sans-serif', color: '#666' }}>
        No resume data provided.
      </div>
    );

  return (
    <div
      data-resume-ready
      style={{ background: 'white', margin: 0, padding: 0 }}
    >
      <ResumePreview
        data={resumeData}
        template={(resumeData as { template?: string }).template ?? 'classic'}
        accentColor={
          (resumeData as { accent_color?: string }).accent_color ?? '#3B82F6'
        }
      />
    </div>
  );
};
