import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

// ── Template 11: Newspaper ────────────────────────────────────────────────────
export const NewspaperTemplate = ({ data, accentColor }) => {
  const { personal_info, professional_summary, experience, education, project, skills } = data;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getImageSrc = () => {
    if (!personal_info?.image) return null;
    if (typeof personal_info.image === 'string') return personal_info.image;
    return URL.createObjectURL(personal_info.image);
  };

  return (
    <div className="p-7 bg-white text-gray-900 text-xs leading-relaxed h-full" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Masthead */}
      <div className="text-center border-b-4 border-t-4 border-gray-900 py-3 mb-4">
        <h1 className="text-3xl font-black tracking-tight">{personal_info?.full_name || 'Your Name'}</h1>
        {personal_info?.profession && (
          <p className="uppercase tracking-[0.2em] text-xs mt-1 font-bold" style={{ color: accentColor }}>{personal_info.profession}</p>
        )}
        <div className="flex justify-center gap-6 mt-2 text-xs text-gray-500 border-t border-gray-200 pt-2">
          {personal_info?.email && <span>{personal_info.email}</span>}
          {personal_info?.phone && <span>{personal_info.phone}</span>}
          {personal_info?.location && <span>{personal_info.location}</span>}
        </div>
      </div>

      {professional_summary && (
        <div className="mb-4 border-b border-gray-200 pb-3">
          <p className="text-center italic text-gray-600 text-xs">{professional_summary}</p>
        </div>
      )}

      {/* Multi-column newspaper body */}
      <div className="grid grid-cols-3 gap-4 divide-x divide-gray-200">
        <div className="space-y-4 pr-4">
          {experience?.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase border-b-2 border-gray-900 mb-2 pb-0.5">Experience</h2>
              {experience.map((exp, i) => (
                <div key={i} className="mb-3">
                  <p className="font-bold leading-tight">{exp.position}</p>
                  <p style={{ color: accentColor }} className="italic">{exp.company}</p>
                  <p className="text-gray-400">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</p>
                  {exp.description && <p className="text-gray-600 mt-1 whitespace-pre-line">{exp.description}</p>}
                  {i < experience.length - 1 && <hr className="my-2 border-gray-200" />}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4 px-4">
          {project?.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase border-b-2 border-gray-900 mb-2 pb-0.5">Projects</h2>
              {project.map((proj, i) => (
                <div key={i} className="mb-3">
                  <p className="font-bold">{proj.name}</p>
                  {proj.type && <p className="italic text-gray-500">{proj.type}</p>}
                  {proj.description && <p className="text-gray-600 whitespace-pre-line">{proj.description}</p>}
                  {i < project.length - 1 && <hr className="my-2 border-gray-200" />}
                </div>
              ))}
            </div>
          )}
          {personal_info?.image && (
            <div className="text-center">
              <img src={getImageSrc()} alt="Profile" className="w-24 h-24 object-cover mx-auto rounded" style={{ border: `2px solid ${accentColor}` }} />
            </div>
          )}
        </div>
        <div className="space-y-4 pl-4">
          {skills?.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase border-b-2 border-gray-900 mb-2 pb-0.5">Skills</h2>
              <div className="space-y-1">
                {skills.map((skill, i) => (
                  <p key={i} className="text-gray-700">• {skill}</p>
                ))}
              </div>
            </div>
          )}
          {education?.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase border-b-2 border-gray-900 mb-2 pb-0.5">Education</h2>
              {education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <p className="font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p style={{ color: accentColor }} className="italic">{edu.institution}</p>
                  <p className="text-gray-400">{formatDate(edu.graduation_date)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Template 12: Gradient ─────────────────────────────────────────────────────
export const GradientTemplate = ({ data, accentColor }) => {
  const { personal_info, professional_summary, experience, education, project, skills } = data;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getImageSrc = () => {
    if (!personal_info?.image) return null;
    if (typeof personal_info.image === 'string') return personal_info.image;
    return URL.createObjectURL(personal_info.image);
  };

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  return (
    <div className="h-full bg-white text-gray-900 text-xs leading-relaxed">
      {/* Gradient header */}
      <div className="px-8 py-7 text-white" style={{ background: `linear-gradient(135deg, ${accentColor}, ${hexToRgba(accentColor, 0.6)})` }}>
        <div className="flex items-center gap-5">
          {personal_info?.image && (
            <img src={getImageSrc()} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-2 border-white/30 flex-shrink-0" />
          )}
          <div>
            <h1 className="text-2xl font-black text-white">{personal_info?.full_name || 'Your Name'}</h1>
            {personal_info?.profession && <p className="text-white/80 mt-0.5">{personal_info.profession}</p>}
            <div className="flex flex-wrap gap-4 mt-2 text-white/70">
              {personal_info?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personal_info.email}</span>}
              {personal_info?.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personal_info.phone}</span>}
              {personal_info?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personal_info.location}</span>}
              {personal_info?.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />LinkedIn</span>}
              {personal_info?.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />Portfolio</span>}
            </div>
          </div>
        </div>
        {professional_summary && (
          <p className="mt-4 text-white/80 whitespace-pre-line">{professional_summary}</p>
        )}
      </div>

      <div className="p-7 grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          {experience?.length > 0 && (
            <div>
              <h2 className="font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-xs" style={{ backgroundColor: accentColor }}>E</div>
                Experience
              </h2>
              {experience.map((exp, i) => (
                <div key={i} className="mb-3 p-3 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <p className="font-bold text-gray-900">{exp.position}</p>
                    <p className="text-gray-400">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</p>
                  </div>
                  <p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
                  {exp.description && <p className="text-gray-600 mt-1 whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
          {project?.length > 0 && (
            <div>
              <h2 className="font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-xs" style={{ backgroundColor: accentColor }}>P</div>
                Projects
              </h2>
              {project.map((proj, i) => (
                <div key={i} className="mb-2 p-3 rounded-xl border border-gray-100">
                  <p className="font-bold text-gray-900">{proj.name} {proj.type && <span className="font-normal text-gray-400">· {proj.type}</span>}</p>
                  {proj.description && <p className="text-gray-600 mt-0.5 whitespace-pre-line">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-5">
          {skills?.length > 0 && (
            <div>
              <h2 className="font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-xs" style={{ backgroundColor: accentColor }}>S</div>
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full text-white text-xs" style={{ background: `linear-gradient(135deg, ${accentColor}, ${hexToRgba(accentColor, 0.7)})` }}>{skill}</span>
                ))}
              </div>
            </div>
          )}
          {education?.length > 0 && (
            <div>
              <h2 className="font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-xs" style={{ backgroundColor: accentColor }}>E</div>
                Education
              </h2>
              {education.map((edu, i) => (
                <div key={i} className="mb-2 p-3 rounded-xl border border-gray-100">
                  <p className="font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p style={{ color: accentColor }}>{edu.institution}</p>
                  <p className="text-gray-400">{formatDate(edu.graduation_date)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Template 13: Academic ─────────────────────────────────────────────────────
export const AcademicTemplate = ({ data, accentColor }) => {
  const { personal_info, professional_summary, experience, education, project, skills } = data;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getImageSrc = () => {
    if (!personal_info?.image) return null;
    if (typeof personal_info.image === 'string') return personal_info.image;
    return URL.createObjectURL(personal_info.image);
  };

  const Divider = () => <div className="border-b border-gray-200 my-4" />;
  const SectionTitle = ({ children }) => (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>{children}</h2>
  );

  return (
    <div className="px-10 py-8 bg-white text-gray-900 text-xs leading-relaxed h-full" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="text-center mb-4">
        {personal_info?.image && (
          <img src={getImageSrc()} alt="Profile" className="w-16 h-16 rounded-full object-cover mx-auto mb-3" style={{ border: `2px solid ${accentColor}` }} />
        )}
        <h1 className="text-2xl font-bold">{personal_info?.full_name || 'Your Name'}</h1>
        {personal_info?.profession && <p className="mt-1" style={{ color: accentColor }}>{personal_info.profession}</p>}
        <div className="flex justify-center gap-6 mt-2 text-gray-500 text-xs">
          {personal_info?.email && <span>{personal_info.email}</span>}
          {personal_info?.phone && <span>{personal_info.phone}</span>}
          {personal_info?.location && <span>{personal_info.location}</span>}
          {personal_info?.linkedin && <span>LinkedIn</span>}
          {personal_info?.website && <span>Portfolio</span>}
        </div>
      </div>
      <Divider />

      {professional_summary && (
        <>
          <div className="mb-3">
            <SectionTitle>Research Interests / Summary</SectionTitle>
            <p className="text-gray-700 whitespace-pre-line">{professional_summary}</p>
          </div>
          <Divider />
        </>
      )}

      {education?.length > 0 && (
        <>
          <div className="mb-3">
            <SectionTitle>Education</SectionTitle>
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between mb-2">
                <div>
                  <p className="font-bold">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</p>
                  <p className="italic text-gray-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-gray-500">GPA: {edu.gpa}</p>}
                </div>
                <p className="text-gray-400 text-right">{formatDate(edu.graduation_date)}</p>
              </div>
            ))}
          </div>
          <Divider />
        </>
      )}

      {experience?.length > 0 && (
        <>
          <div className="mb-3">
            <SectionTitle>Academic & Professional Experience</SectionTitle>
            {experience.map((exp, i) => (
              <div key={i} className="flex justify-between mb-3">
                <div className="flex-1 pr-4">
                  <p className="font-bold">{exp.position}</p>
                  <p className="italic text-gray-600">{exp.company}</p>
                  {exp.description && <p className="text-gray-600 mt-1 whitespace-pre-line">{exp.description}</p>}
                </div>
                <p className="text-gray-400 text-right flex-shrink-0">{formatDate(exp.start_date)} –<br />{exp.is_current ? 'Present' : formatDate(exp.end_date)}</p>
              </div>
            ))}
          </div>
          <Divider />
        </>
      )}

      {project?.length > 0 && (
        <>
          <div className="mb-3">
            <SectionTitle>Publications & Projects</SectionTitle>
            {project.map((proj, i) => (
              <div key={i} className="mb-2">
                <span className="font-bold">{proj.name}</span>
                {proj.type && <span className="text-gray-500 italic"> ({proj.type})</span>}
                {proj.description && <p className="text-gray-600 mt-0.5 whitespace-pre-line">{proj.description}</p>}
              </div>
            ))}
          </div>
          <Divider />
        </>
      )}

      {skills?.length > 0 && (
        <div>
          <SectionTitle>Technical Skills</SectionTitle>
          <p className="text-gray-700">{skills.join(' · ')}</p>
        </div>
      )}
    </div>
  );
};

// ── Template 14: Startup ──────────────────────────────────────────────────────
export const StartupTemplate = ({ data, accentColor }) => {
  const { personal_info, professional_summary, experience, education, project, skills } = data;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getImageSrc = () => {
    if (!personal_info?.image) return null;
    if (typeof personal_info.image === 'string') return personal_info.image;
    return URL.createObjectURL(personal_info.image);
  };

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const icons = { exp: '💼', edu: '🎓', proj: '🚀', skills: '⚡' };

  return (
    <div className="p-7 bg-white text-gray-900 text-xs leading-relaxed h-full">
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        {personal_info?.image && (
          <img src={getImageSrc()} alt="Profile" className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" style={{ border: `2px solid ${accentColor}` }} />
        )}
        <div className="flex-1">
          <h1 className="text-xl font-black text-gray-900">{personal_info?.full_name || 'Your Name'}</h1>
          {personal_info?.profession && (
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-white text-xs font-medium" style={{ backgroundColor: accentColor }}>{personal_info.profession}</span>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {personal_info?.email && <span className="flex items-center gap-1 text-gray-500 text-xs px-2 py-0.5 rounded-full bg-gray-100"><Mail className="w-3 h-3" />{personal_info.email}</span>}
            {personal_info?.phone && <span className="flex items-center gap-1 text-gray-500 text-xs px-2 py-0.5 rounded-full bg-gray-100"><Phone className="w-3 h-3" />{personal_info.phone}</span>}
            {personal_info?.location && <span className="flex items-center gap-1 text-gray-500 text-xs px-2 py-0.5 rounded-full bg-gray-100"><MapPin className="w-3 h-3" />{personal_info.location}</span>}
            {personal_info?.linkedin && <span className="flex items-center gap-1 text-gray-500 text-xs px-2 py-0.5 rounded-full bg-gray-100"><Linkedin className="w-3 h-3" />LinkedIn</span>}
          </div>
        </div>
      </div>

      {professional_summary && (
        <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor: hexToRgba(accentColor, 0.06) }}>
          <p className="text-gray-600 whitespace-pre-line">{professional_summary}</p>
        </div>
      )}

      {skills?.length > 0 && (
        <div className="mb-4">
          <p className="font-bold text-gray-500 uppercase tracking-wider mb-2">{icons.skills} Tech Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: hexToRgba(accentColor, 0.1), color: accentColor }}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          {experience?.length > 0 && (
            <div>
              <p className="font-bold text-gray-500 uppercase tracking-wider mb-2">{icons.exp} Experience</p>
              {experience.map((exp, i) => (
                <div key={i} className="mb-3 p-2.5 rounded-xl border border-gray-100">
                  <p className="font-bold text-gray-900">{exp.position}</p>
                  <p style={{ color: accentColor }} className="font-medium">{exp.company}</p>
                  <p className="text-gray-400">{formatDate(exp.start_date)} → {exp.is_current ? 'Now' : formatDate(exp.end_date)}</p>
                  {exp.description && <p className="text-gray-600 mt-1 whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          {project?.length > 0 && (
            <div>
              <p className="font-bold text-gray-500 uppercase tracking-wider mb-2">{icons.proj} Projects</p>
              {project.map((proj, i) => (
                <div key={i} className="mb-2 p-2.5 rounded-xl border border-gray-100">
                  <p className="font-bold text-gray-900">{proj.name}</p>
                  {proj.type && <span className="inline-block text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{proj.type}</span>}
                  {proj.description && <p className="text-gray-600 mt-1 whitespace-pre-line">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
          {education?.length > 0 && (
            <div>
              <p className="font-bold text-gray-500 uppercase tracking-wider mb-2">{icons.edu} Education</p>
              {education.map((edu, i) => (
                <div key={i} className="mb-2 p-2.5 rounded-xl border border-gray-100">
                  <p className="font-bold text-gray-900">{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</p>
                  <p style={{ color: accentColor }}>{edu.institution}</p>
                  <p className="text-gray-400">{formatDate(edu.graduation_date)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Template 15: Compact Sidebar ──────────────────────────────────────────────
export const CompactSidebarTemplate = ({ data, accentColor }) => {
  const { personal_info, professional_summary, experience, education, project, skills } = data;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getImageSrc = () => {
    if (!personal_info?.image) return null;
    if (typeof personal_info.image === 'string') return personal_info.image;
    return URL.createObjectURL(personal_info.image);
  };

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  return (
    <div className="h-full bg-white text-gray-900 text-xs leading-relaxed flex">
      {/* Narrow sidebar */}
      <div className="w-44 flex-shrink-0 p-5 flex flex-col gap-4" style={{ backgroundColor: hexToRgba(accentColor, 0.06) }}>
        {personal_info?.image && (
          <img src={getImageSrc()} alt="Profile" className="w-20 h-20 rounded-xl object-cover" style={{ border: `2px solid ${accentColor}` }} />
        )}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: accentColor }}>Contact</p>
          <div className="space-y-1 text-gray-600">
            {personal_info?.email && <div className="flex items-start gap-1.5"><Mail className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: accentColor }} /><span className="break-all text-xs">{personal_info.email}</span></div>}
            {personal_info?.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />{personal_info.phone}</div>}
            {personal_info?.location && <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />{personal_info.location}</div>}
            {personal_info?.linkedin && <div className="flex items-center gap-1.5"><Linkedin className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />LinkedIn</div>}
            {personal_info?.website && <div className="flex items-center gap-1.5"><Globe className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />Portfolio</div>}
          </div>
        </div>
        {skills?.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: accentColor }}>Skills</p>
            <div className="flex flex-col gap-1">
              {skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-1.5 text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
        {education?.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: accentColor }}>Education</p>
            {education.map((edu, i) => (
              <div key={i} className="mb-2">
                <p className="font-semibold text-gray-900">{edu.degree}</p>
                {edu.field && <p className="text-gray-600">{edu.field}</p>}
                <p style={{ color: accentColor }}>{edu.institution}</p>
                <p className="text-gray-400">{formatDate(edu.graduation_date)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="mb-4 pb-3 border-b-2" style={{ borderColor: accentColor }}>
          <h1 className="text-xl font-bold text-gray-900">{personal_info?.full_name || 'Your Name'}</h1>
          {personal_info?.profession && <p className="text-sm mt-0.5" style={{ color: accentColor }}>{personal_info.profession}</p>}
        </div>
        {professional_summary && (
          <p className="text-gray-600 mb-4 whitespace-pre-line">{professional_summary}</p>
        )}
        {experience?.length > 0 && (
          <div className="mb-4">
            <h2 className="font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Experience</h2>
            {experience.map((exp, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-baseline flex-wrap">
                  <p className="font-bold text-gray-900">{exp.position}</p>
                  <p className="text-gray-400">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</p>
                </div>
                <p style={{ color: accentColor }} className="font-medium">{exp.company}</p>
                {exp.description && <p className="text-gray-600 mt-1 whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        {project?.length > 0 && (
          <div>
            <h2 className="font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Projects</h2>
            {project.map((proj, i) => (
              <div key={i} className="mb-2">
                <p className="font-bold text-gray-900">{proj.name} {proj.type && <span className="font-normal text-gray-400">· {proj.type}</span>}</p>
                {proj.description && <p className="text-gray-600 whitespace-pre-line">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
