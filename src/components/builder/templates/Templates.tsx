import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/brand-icons';
import type { ResumeData } from '@/types';

interface TemplateProps { data: ResumeData; accentColor: string; }

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const getImageSrc = (image?: string | File | null): string | null => {
  if (!image) return null;
  if (typeof image === 'string') return image;
  return URL.createObjectURL(image);
};

// ── Classic Template ──────────────────────────────────────────────────────────
export const ClassicTemplate = ({ data, accentColor }: TemplateProps) => {
  const { personal_info: pi, professional_summary, experience, education, project, skills } = data;
  const imgSrc = getImageSrc(pi?.image);
  return (
    <div className="p-8 text-gray-900 text-sm leading-relaxed h-full bg-white">
      <div className="text-center border-b-2 pb-4 mb-6" style={{ borderColor: accentColor }}>
        {imgSrc && <img src={imgSrc} alt="Profile" className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2" style={{ borderColor: accentColor }} />}
        <h1 className="text-2xl font-bold" style={{ color: accentColor }}>{pi?.full_name || 'Your Name'}</h1>
        {pi?.profession && <p className="text-gray-600 mt-1">{pi.profession}</p>}
        <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs text-gray-600">
          {pi?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{pi.email}</span>}
          {pi?.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{pi.phone}</span>}
          {pi?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pi.location}</span>}
          {pi?.linkedin && <span className="flex items-center gap-1"><LinkedinIcon className="w-3 h-3" />LinkedIn</span>}
          {pi?.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />Portfolio</span>}
        </div>
      </div>
      {professional_summary && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Professional Summary</h2><p className="text-gray-700 text-xs whitespace-pre-line">{professional_summary}</p></div>}
      {experience.length > 0 && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Experience</h2><div className="space-y-3">{experience.map((exp, i) => <div key={i}><div className="flex justify-between items-start"><div><h3 className="font-semibold text-gray-900">{exp.position}</h3><p className="text-gray-600 text-xs">{exp.company}</p></div><span className="text-xs text-gray-500">{formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span></div>{exp.description && <p className="text-gray-700 text-xs mt-1 whitespace-pre-line">{exp.description}</p>}</div>)}</div></div>}
      {education.length > 0 && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Education</h2><div className="space-y-2">{education.map((edu, i) => <div key={i} className="flex justify-between items-start"><div><h3 className="font-semibold">{edu.degree} {edu.field && `in ${edu.field}`}</h3><p className="text-gray-600 text-xs">{edu.institution}</p></div><span className="text-xs text-gray-500">{formatDate(edu.graduation_date)}</span></div>)}</div></div>}
      {project.length > 0 && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Projects</h2><div className="space-y-2">{project.map((proj, i) => <div key={i}><h3 className="font-semibold">{proj.name} {proj.type && <span className="font-normal text-gray-500">({proj.type})</span>}</h3>{proj.description && <p className="text-gray-700 text-xs whitespace-pre-line">{proj.description}</p>}</div>)}</div></div>}
      {skills.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Skills</h2><div className="flex flex-wrap gap-1.5">{skills.map((s, i) => <span key={i} className="px-2 py-0.5 rounded text-xs text-white" style={{ backgroundColor: accentColor }}>{s}</span>)}</div></div>}
    </div>
  );
};

// ── Modern Template ───────────────────────────────────────────────────────────
export const ModernTemplate = ({ data, accentColor }: TemplateProps) => {
  const { personal_info: pi, professional_summary, experience, education, project, skills } = data;
  const imgSrc = getImageSrc(pi?.image);
  return (
    <div className="flex h-full text-sm">
      <div className="w-1/3 p-6 text-white" style={{ backgroundColor: accentColor }}>
        {imgSrc && <img src={imgSrc} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white/30" />}
        <h1 className="text-xl font-bold text-center mb-1">{pi?.full_name || 'Your Name'}</h1>
        {pi?.profession && <p className="text-center text-white/80 text-xs mb-6">{pi.profession}</p>}
        <div className="space-y-2 text-xs mb-6">
          <h3 className="font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2">Contact</h3>
          {pi?.email && <p className="flex items-center gap-2"><Mail className="w-3 h-3" />{pi.email}</p>}
          {pi?.phone && <p className="flex items-center gap-2"><Phone className="w-3 h-3" />{pi.phone}</p>}
          {pi?.location && <p className="flex items-center gap-2"><MapPin className="w-3 h-3" />{pi.location}</p>}
        </div>
        {skills.length > 0 && <div className="text-xs"><h3 className="font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2">Skills</h3><div className="flex flex-wrap gap-1.5">{skills.map((s, i) => <span key={i} className="px-2 py-0.5 rounded bg-white/20 text-white">{s}</span>)}</div></div>}
      </div>
      <div className="w-2/3 p-6 bg-white">
        {professional_summary && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>About Me</h2><p className="text-gray-700 text-xs whitespace-pre-line">{professional_summary}</p></div>}
        {experience.length > 0 && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Experience</h2><div className="space-y-3">{experience.map((exp, i) => <div key={i} className="border-l-2 pl-3" style={{ borderColor: accentColor }}><h3 className="font-semibold">{exp.position}</h3><p className="text-gray-600 text-xs">{exp.company}</p><p className="text-xs text-gray-500">{formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}</p>{exp.description && <p className="text-gray-700 text-xs mt-1 whitespace-pre-line">{exp.description}</p>}</div>)}</div></div>}
        {education.length > 0 && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Education</h2><div className="space-y-2">{education.map((edu, i) => <div key={i} className="border-l-2 pl-3" style={{ borderColor: accentColor }}><h3 className="font-semibold">{edu.degree} {edu.field && `in ${edu.field}`}</h3><p className="text-gray-600 text-xs">{edu.institution}</p></div>)}</div></div>}
        {project.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Projects</h2><div className="space-y-2">{project.map((proj, i) => <div key={i} className="border-l-2 pl-3" style={{ borderColor: accentColor }}><h3 className="font-semibold">{proj.name}</h3>{proj.type && <p className="text-gray-500 text-xs">{proj.type}</p>}{proj.description && <p className="text-gray-700 text-xs whitespace-pre-line">{proj.description}</p>}</div>)}</div></div>}
      </div>
    </div>
  );
};

// ── Minimal Template ──────────────────────────────────────────────────────────
export const MinimalTemplate = ({ data, accentColor }: TemplateProps) => {
  const { personal_info: pi, professional_summary, experience, education, project, skills } = data;
  return (
    <div className="p-8 text-gray-900 text-sm leading-relaxed h-full bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-light tracking-tight" style={{ color: accentColor }}>{pi?.full_name || 'Your Name'}</h1>
        {pi?.profession && <p className="text-gray-500 mt-1">{pi.profession}</p>}
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
          {pi?.email && <span>{pi.email}</span>}
          {pi?.phone && <span>• {pi.phone}</span>}
          {pi?.location && <span>• {pi.location}</span>}
        </div>
      </div>
      <hr className="border-gray-200 mb-6" />
      {professional_summary && <div className="mb-6"><p className="text-gray-700 text-xs whitespace-pre-line">{professional_summary}</p></div>}
      {experience.length > 0 && <div className="mb-6"><h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Experience</h2><div className="space-y-4">{experience.map((exp, i) => <div key={i}><div className="flex justify-between items-baseline"><h3 className="font-medium" style={{ color: accentColor }}>{exp.position}</h3><span className="text-xs text-gray-400">{formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span></div><p className="text-gray-600 text-xs">{exp.company}</p>{exp.description && <p className="text-gray-600 text-xs mt-1 whitespace-pre-line">{exp.description}</p>}</div>)}</div></div>}
      {education.length > 0 && <div className="mb-6"><h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Education</h2><div className="space-y-2">{education.map((edu, i) => <div key={i} className="flex justify-between items-baseline"><div><h3 className="font-medium" style={{ color: accentColor }}>{edu.degree} {edu.field && `— ${edu.field}`}</h3><p className="text-gray-600 text-xs">{edu.institution}</p></div><span className="text-xs text-gray-400">{formatDate(edu.graduation_date)}</span></div>)}</div></div>}
      {project.length > 0 && <div className="mb-6"><h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Projects</h2><div className="space-y-2">{project.map((proj, i) => <div key={i}><h3 className="font-medium" style={{ color: accentColor }}>{proj.name} {proj.type && <span className="font-normal text-gray-400">/ {proj.type}</span>}</h3>{proj.description && <p className="text-gray-600 text-xs whitespace-pre-line">{proj.description}</p>}</div>)}</div></div>}
      {skills.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Skills</h2><p className="text-gray-700 text-xs">{skills.join(' • ')}</p></div>}
    </div>
  );
};

// ── Executive Template ────────────────────────────────────────────────────────
export const ExecutiveTemplate = ({ data, accentColor }: TemplateProps) => {
  const { personal_info: pi, professional_summary, experience, education, project, skills } = data;
  const imgSrc = getImageSrc(pi?.image);
  return (
    <div className="h-full bg-white text-gray-900 text-sm leading-relaxed">
      <div className="px-8 py-6" style={{ backgroundColor: accentColor }}>
        <div className="flex items-center gap-6">
          {imgSrc && <img src={imgSrc} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white/30" />}
          <div className="text-white">
            <h1 className="text-3xl font-bold tracking-tight">{pi?.full_name || 'Your Name'}</h1>
            {pi?.profession && <p className="text-white/90 text-lg mt-1">{pi.profession}</p>}
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-white/80">
              {pi?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{pi.email}</span>}
              {pi?.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{pi.phone}</span>}
              {pi?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pi.location}</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="p-8">
        {professional_summary && <div className="mb-6"><h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Executive Summary</h2><p className="text-gray-700 text-xs whitespace-pre-line">{professional_summary}</p></div>}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {experience.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Experience</h2><div className="space-y-4">{experience.map((exp, i) => <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: accentColor + '40' }}><div className="flex justify-between items-start"><div><h3 className="font-bold">{exp.position}</h3><p className="font-medium text-xs" style={{ color: accentColor }}>{exp.company}</p></div><span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span></div>{exp.description && <p className="text-gray-600 text-xs mt-2 whitespace-pre-line">{exp.description}</p>}</div>)}</div></div>}
            {project.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Key Projects</h2><div className="space-y-3">{project.map((proj, i) => <div key={i} className="p-3 bg-gray-50 rounded-lg"><h3 className="font-semibold">{proj.name} {proj.type && <span className="font-normal text-gray-500 text-xs">• {proj.type}</span>}</h3>{proj.description && <p className="text-gray-600 text-xs mt-1 whitespace-pre-line">{proj.description}</p>}</div>)}</div></div>}
          </div>
          <div className="space-y-6">
            {education.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Education</h2><div className="space-y-3">{education.map((edu, i) => <div key={i}><h3 className="font-semibold text-xs">{edu.degree} {edu.field && `in ${edu.field}`}</h3><p className="text-xs" style={{ color: accentColor }}>{edu.institution}</p><p className="text-gray-500 text-xs">{formatDate(edu.graduation_date)}</p></div>)}</div></div>}
            {skills.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Core Competencies</h2><div className="space-y-1.5">{skills.map((s, i) => <div key={i} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} /><span className="text-xs text-gray-700">{s}</span></div>)}</div></div>}
          </div>
        </div>
      </div>
    </div>
  );
};
