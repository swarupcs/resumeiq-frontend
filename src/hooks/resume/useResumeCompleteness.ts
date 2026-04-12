import { useMemo } from 'react';
import type { ResumeData, CompletenessTip, CompletenessResult } from '@/types';

interface Section {
  key: string;
  label: string;
  points: number;
  tip: string;
  check: (r: ResumeData) => boolean;
}

const SECTIONS: Section[] = [
  { key: 'full_name',   label: 'Full name',            points: 5,  tip: 'Add your full name',                          check: (r) => !!r.personal_info?.full_name?.trim() },
  { key: 'email',       label: 'Email',                points: 5,  tip: 'Add your email address',                      check: (r) => !!r.personal_info?.email?.trim() },
  { key: 'phone',       label: 'Phone',                points: 5,  tip: 'Add your phone number',                       check: (r) => !!r.personal_info?.phone?.trim() },
  { key: 'location',    label: 'Location',             points: 5,  tip: 'Add your city or location',                   check: (r) => !!r.personal_info?.location?.trim() },
  { key: 'profession',  label: 'Profession',           points: 5,  tip: 'Add your job title or profession',            check: (r) => !!r.personal_info?.profession?.trim() },
  { key: 'photo',       label: 'Profile photo',        points: 5,  tip: 'Upload a professional profile photo',         check: (r) => !!r.personal_info?.image },
  { key: 'summary',     label: 'Professional summary', points: 15, tip: 'Write a professional summary (≥50 chars)',    check: (r) => (r.professional_summary?.trim().length ?? 0) >= 50 },
  { key: 'experience',  label: 'Work experience',      points: 20, tip: 'Add at least one experience with description', check: (r) => r.experience?.some((e) => e.description?.trim()) ?? false },
  { key: 'education',   label: 'Education',            points: 10, tip: 'Add your education background',               check: (r) => (r.education?.length ?? 0) > 0 },
  { key: 'skills',      label: 'Skills (5+)',          points: 15, tip: 'Add at least 5 skills',                      check: (r) => (r.skills?.length ?? 0) >= 5 },
  { key: 'projects',    label: 'Projects',             points: 10, tip: 'Add at least one project with description',   check: (r) => r.project?.some((p) => p.description?.trim()) ?? false },
];

export const useResumeCompleteness = (resumeData: ResumeData | null): CompletenessResult => {
  return useMemo(() => {
    if (!resumeData) return { score: 0, tips: [], completedSections: [], totalSections: SECTIONS.length, allSections: [] };

    const results: CompletenessTip[] = SECTIONS.map((s) => ({
      key: s.key, label: s.label, points: s.points, tip: s.tip,
      done: s.check(resumeData),
    }));

    const score = results.filter((s) => s.done).reduce((sum, s) => sum + s.points, 0);
    const tips = results.filter((s) => !s.done).sort((a, b) => b.points - a.points).slice(0, 4);
    const completedSections = results.filter((s) => s.done);

    return { score, tips, completedSections, totalSections: SECTIONS.length, allSections: results };
  }, [resumeData]);
};
