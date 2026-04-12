/**
 * resume-constants.ts
 * Shared constants for the resume builder.
 * Kept in a separate non-component file so that ResumePreview.tsx can
 * export only React components, enabling Vite Fast Refresh (HMR).
 */
import type { ResumeData } from '@/types';

export const TEMPLATES = [
  { id: 'classic', name: 'Classic', description: 'Clean & traditional' },
  { id: 'modern', name: 'Modern', description: 'Sidebar with color' },
  { id: 'minimal', name: 'Minimal', description: 'Ultra-clean type' },
  { id: 'executive', name: 'Executive', description: 'Bold header, timeline' },
];

export const ACCENT_COLORS = [
  { name: 'Royal Blue', value: '#3B82F6' },
  { name: 'Violet', value: '#7C3AED' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Rose', value: '#E11D48' },
  { name: 'Amber', value: '#D97706' },
  { name: 'Teal', value: '#0D9488' },
  { name: 'Sky', value: '#0EA5E9' },
  { name: 'Purple', value: '#9333EA' },
  { name: 'Crimson', value: '#DC2626' },
  { name: 'Charcoal', value: '#374151' },
];

export const SAMPLE_RESUME_DATA: ResumeData = {
  title: 'Sample',
  template: 'classic',
  accent_color: '#3B82F6',
  professional_summary:
    'Creative product designer with 5 years of experience crafting intuitive digital experiences.',
  personal_info: {
    full_name: 'Alex Johnson',
    profession: 'Product Designer',
    email: 'alex@example.com',
    phone: '+1 555 0100',
    location: 'San Francisco, CA',
    linkedin: '',
    website: '',
    image: '',
  },
  experience: [
    {
      company: 'Stripe',
      position: 'Senior Product Designer',
      start_date: '2021-03',
      end_date: '',
      is_current: true,
      description: 'Led end-to-end design for the payments dashboard.',
    },
  ],
  education: [
    {
      institution: 'Carnegie Mellon',
      degree: 'B.S.',
      field: 'HCI',
      graduation_date: '2019-05',
      gpa: '3.8',
    },
  ],
  project: [
    {
      name: 'Design System',
      type: 'Open Source',
      description: 'Built a scalable component library.',
    },
  ],
  skills: ['Figma', 'React', 'Prototyping', 'User Research'],
};
