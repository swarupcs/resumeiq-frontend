import { useMemo } from 'react';

// Phase 3 — Feature 3: Resume completeness score.
// Pure computation hook — no API calls, no side effects.
// Returns a score (0–100) and an array of tips for incomplete sections.
//
// Scoring breakdown (totals 100):
//   Personal info (full_name, email, phone, location, profession) — 5pts each = 25
//   Professional summary (non-empty, ≥50 chars)                   — 15
//   Experience (at least 1 entry with description)                — 20
//   Education (at least 1 entry)                                  — 10
//   Skills (at least 5 skills)                                    — 15
//   Projects (at least 1 entry with description)                  — 10
//   Profile photo                                                  — 5
//
// Each tip includes: label, points it would add, and whether it's done.

const SECTIONS = [
  {
    key: 'full_name',
    label: 'Full name',
    points: 5,
    check: (r) => !!r.personal_info?.full_name?.trim(),
    tip: 'Add your full name to personal info',
  },
  {
    key: 'email',
    label: 'Email',
    points: 5,
    check: (r) => !!r.personal_info?.email?.trim(),
    tip: 'Add your email address',
  },
  {
    key: 'phone',
    label: 'Phone',
    points: 5,
    check: (r) => !!r.personal_info?.phone?.trim(),
    tip: 'Add your phone number',
  },
  {
    key: 'location',
    label: 'Location',
    points: 5,
    check: (r) => !!r.personal_info?.location?.trim(),
    tip: 'Add your city or location',
  },
  {
    key: 'profession',
    label: 'Profession',
    points: 5,
    check: (r) => !!r.personal_info?.profession?.trim(),
    tip: 'Add your job title or profession',
  },
  {
    key: 'photo',
    label: 'Profile photo',
    points: 5,
    check: (r) => !!r.personal_info?.image,
    tip: 'Upload a professional profile photo',
  },
  {
    key: 'summary',
    label: 'Professional summary',
    points: 15,
    check: (r) => (r.professional_summary?.trim()?.length ?? 0) >= 50,
    tip: 'Write a professional summary (at least 50 characters)',
  },
  {
    key: 'experience',
    label: 'Work experience',
    points: 20,
    check: (r) => r.experience?.some((e) => e.description?.trim()),
    tip: 'Add at least one experience entry with a description',
  },
  {
    key: 'education',
    label: 'Education',
    points: 10,
    check: (r) => r.education?.length > 0,
    tip: 'Add your education background',
  },
  {
    key: 'skills',
    label: 'Skills (5+)',
    points: 15,
    check: (r) => (r.skills?.length ?? 0) >= 5,
    tip: 'Add at least 5 skills to strengthen your resume',
  },
  {
    key: 'projects',
    label: 'Projects',
    points: 10,
    check: (r) => r.project?.some((p) => p.description?.trim()),
    tip: 'Add at least one project with a description',
  },
];

export const useResumeCompleteness = (resumeData) => {
  return useMemo(() => {
    if (!resumeData) return { score: 0, tips: [], completedSections: [], totalSections: SECTIONS.length };

    const results = SECTIONS.map((section) => ({
      ...section,
      done: section.check(resumeData),
    }));

    const score = results
      .filter((s) => s.done)
      .reduce((sum, s) => sum + s.points, 0);

    const tips = results
      .filter((s) => !s.done)
      .sort((a, b) => b.points - a.points) // highest-value tips first
      .slice(0, 4); // show top 4 actionable tips

    const completedSections = results.filter((s) => s.done);

    return {
      score,
      tips,
      completedSections,
      totalSections: SECTIONS.length,
      allSections: results,
    };
  }, [resumeData]);
};
