import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

// ── Template 16: Boxed Header ─────────────────────────────────────────────────
export const BoxedHeaderTemplate = ({ data, accentColor }) => {
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

  const SectionTitle = ({ children }) => (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-2 mt-4 pb-1 border-b border-gray-200" style={{ color: accentColor }}>{children}</h2>
  );

  return (
    <div className="h-full bg-white text-gray-900 text-xs leading-relaxed">
      {/* Full-width boxed header */}
      <div className="text-white px-8 py-6" style={{ backgroundColor: accentColor }}>
        <div className="flex items-center gap-5">
          {personal_info?.image && (
            <img src={getImageSrc()} alt="Profile" className="w-20 h-20 rounded-xl object-cover border-2 border-white/40 flex-shrink-0" />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{personal_info?.full_name || 'Your Name'}</h1>
            {personal_info?.profession && <p className="text-white/80 mt-1">{personal_info.profession}</p>}
          </div>
          <div className="text-right space-y-1 text-white/70 flex-shrink-0">
            {personal_info?.email && <div className="flex items-center justify-end gap-1.5"><Mail className="w-3 h-3" />{personal_info.email}</div>}
            {personal_info?.phone && <div className="flex items-center justify-end gap-1.5"><Phone className="w-3 h-3" />{personal_info.phone}</div>}
            {personal_info?.location && <div className="flex items-center justify-end gap-1.5"><MapPin className="w-3 h-3" />{personal_info.location}</div>}
            {personal_info?.linkedin && <div className="flex items-center justify-end gap-1.5"><Linkedin className="w-3 h-3" />LinkedIn</div>}
            {personal_info?.website && <div className="flex items-center justify-end gap-1.5"><Globe className="w-3 h-3" />Portfolio</div>}
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        {professional_summary && (
          <>
            <SectionTitle>Summary</SectionTitle>
            <p className="text-gray-600 whitespace-pre-line">{professional_summary}</p>
          </>
        )}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            {experience?.length > 0 && (
              <>
                <SectionTitle>Experience</SectionTitle>
                {experience.map((exp, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <p className="font-bold text-gray-900">{exp.position}</p>
                      <p className="text-gray-400">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</p>
                    </div>
                    <p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
                    {exp.description && <p className="text-gray-600 mt-0.5 whitespace-pre-line">{exp.description}</p>}
                  </div>
                ))}
              </>
            )}
            {project?.length > 0 && (
              <>
                <SectionTitle>Projects</SectionTitle>
                {project.map((proj, i) => (
                  <div key={i} className="mb-2">
                    <p className="font-bold text-gray-900">{proj.name} {proj.type && <span className="font-normal text-gray-400">· {proj.type}</span>}</p>
                    {proj.description && <p className="text-gray-600 whitespace-pre-line">{proj.description}</p>}
                  </div>
                ))}
              </>
            )}
          </div>
          <div>
            {skills?.length > 0 && (
              <>
                <SectionTitle>Skills</SectionTitle>
                <div className="flex flex-col gap-1">
                  {skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                      {skill}
                    </div>
                  ))}
                </div>
              </>
            )}
            {education?.length > 0 && (
              <>
                <SectionTitle>Education</SectionTitle>
                {education.map((edu, i) => (
                  <div key={i} className="mb-2">
                    <p className="font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                    <p style={{ color: accentColor }}>{edu.institution}</p>
                    <p className="text-gray-400">{formatDate(edu.graduation_date)}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Template 17: Underline ────────────────────────────────────────────────────
export const UnderlineTemplate = ({ data, accentColor }) => {
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

  const SectionTitle = ({ children }) => (
    <h2 className="text-sm font-bold mb-3 inline-block" style={{ color: accentColor, borderBottom: `3px solid ${accentColor}`, paddingBottom: '2px' }}>
      {children}
    </h2>
  );

  return (
    <div className="p-8 bg-white text-gray-900 text-xs leading-relaxed h-full">
      {/* Header */}
      <div className="flex items-start gap-5 mb-7 pb-6 border-b border-gray-100">
        {personal_info?.image && (
          <img src={getImageSrc()} alt="Profile" className="w-20 h-20 rounded-full object-cover flex-shrink-0" style={{ border: `3px solid ${accentColor}` }} />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900" style={{ borderBottom: `4px solid ${accentColor}`, display: 'inline-block', paddingBottom: '2px' }}>
            {personal_info?.full_name || 'Your Name'}
          </h1>
          {personal_info?.profession && <p className="mt-2 text-sm font-medium text-gray-500">{personal_info.profession}</p>}
          <div className="flex flex-wrap gap-4 mt-2 text-gray-400">
            {personal_info?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personal_info.email}</span>}
            {personal_info?.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personal_info.phone}</span>}
            {personal_info?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personal_info.location}</span>}
            {personal_info?.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />LinkedIn</span>}
            {personal_info?.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />Portfolio</span>}
          </div>
        </div>
      </div>

      {professional_summary && (
        <div className="mb-6">
          <SectionTitle>Summary</SectionTitle>
          <p className="text-gray-600 whitespace-pre-line mt-2">{professional_summary}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-5">
          {experience?.length > 0 && (
            <div>
              <SectionTitle>Experience</SectionTitle>
              <div className="space-y-4 mt-2">
                {experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <p className="font-bold text-gray-900">{exp.position}</p>
                      <p className="text-gray-400">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</p>
                    </div>
                    <p className="font-medium mt-0.5" style={{ color: accentColor }}>{exp.company}</p>
                    {exp.description && <p className="text-gray-600 mt-1 whitespace-pre-line">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {project?.length > 0 && (
            <div>
              <SectionTitle>Projects</SectionTitle>
              <div className="space-y-2 mt-2">
                {project.map((proj, i) => (
                  <div key={i}>
                    <p className="font-bold text-gray-900">{proj.name} {proj.type && <span className="font-normal text-gray-400">· {proj.type}</span>}</p>
                    {proj.description && <p className="text-gray-600 whitespace-pre-line">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-5">
          {skills?.length > 0 && (
            <div>
              <SectionTitle>Skills</SectionTitle>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs rounded text-white" style={{ backgroundColor: accentColor }}>{skill}</span>
                ))}
              </div>
            </div>
          )}
          {education?.length > 0 && (
            <div>
              <SectionTitle>Education</SectionTitle>
              <div className="space-y-2 mt-2">
                {education.map((edu, i) => (
                  <div key={i}>
                    <p className="font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                    <p style={{ color: accentColor }}>{edu.institution}</p>
                    <p className="text-gray-400">{formatDate(edu.graduation_date)}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Template 18: Split Color ──────────────────────────────────────────────────
export const SplitColorTemplate = ({ data, accentColor }) => {
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
    <div className="h-full bg-white text-gray-900 text-xs leading-relaxed flex">
      {/* Left half — accent color */}
      <div className="w-2/5 p-7 flex flex-col gap-5 text-white" style={{ backgroundColor: accentColor }}>
        {personal_info?.image && (
          <img src={getImageSrc()} alt="Profile" className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-white/30" />
        )}
        <div>
          <h1 className="text-xl font-black text-white">{personal_info?.full_name || 'Your Name'}</h1>
          {personal_info?.profession && <p className="text-white/80 mt-0.5">{personal_info.profession}</p>}
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Contact</p>
          {personal_info?.email && <div className="flex items-start gap-2 text-white/80"><Mail className="w-3 h-3 flex-shrink-0 mt-0.5" /><span className="break-all">{personal_info.email}</span></div>}
          {personal_info?.phone && <div className="flex items-center gap-2 text-white/80"><Phone className="w-3 h-3 flex-shrink-0" />{personal_info.phone}</div>}
          {personal_info?.location && <div className="flex items-center gap-2 text-white/80"><MapPin className="w-3 h-3 flex-shrink-0" />{personal_info.location}</div>}
          {personal_info?.linkedin && <div className="flex items-center gap-2 text-white/80"><Linkedin className="w-3 h-3 flex-shrink-0" />LinkedIn</div>}
          {personal_info?.website && <div className="flex items-center gap-2 text-white/80"><Globe className="w-3 h-3 flex-shrink-0" />Portfolio</div>}
        </div>

        {skills?.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-xs bg-white/20 text-white">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {education?.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Education</p>
            {education.map((edu, i) => (
              <div key={i} className="mb-2">
                <p className="font-bold text-white">{edu.degree}</p>
                {edu.field && <p className="text-white/70">{edu.field}</p>}
                <p className="text-white/80">{edu.institution}</p>
                <p className="text-white/50">{formatDate(edu.graduation_date)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right half — white */}
      <div className="flex-1 p-7">
        {professional_summary && (
          <div className="mb-5 pb-4 border-b border-gray-100">
            <p className="text-gray-600 whitespace-pre-line">{professional_summary}</p>
          </div>
        )}
        {experience?.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Experience</h2>
            {experience.map((exp, i) => (
              <div key={i} className="mb-3 pl-2 border-l-2" style={{ borderColor: `${accentColor}30` }}>
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <p className="font-bold text-gray-900">{exp.position}</p>
                  <p className="text-gray-400">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</p>
                </div>
                <p style={{ color: accentColor }} className="font-medium">{exp.company}</p>
                {exp.description && <p className="text-gray-600 mt-0.5 whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        {project?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Projects</h2>
            {project.map((proj, i) => (
              <div key={i} className="mb-2 pl-2 border-l-2" style={{ borderColor: `${accentColor}30` }}>
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

// ── Template 19: Minimalist ───────────────────────────────────────────────────
export const MinimalistTemplate = ({ data, accentColor }) => {
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
    <div className="px-14 py-10 bg-white text-gray-800 text-xs leading-relaxed h-full">
      {/* Pure typographic header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide text-gray-900">{personal_info?.full_name || 'Your Name'}</h1>
        {personal_info?.profession && (
          <p className="text-xs tracking-widest uppercase mt-1" style={{ color: accentColor }}>{personal_info.profession}</p>
        )}
        <div className="flex flex-wrap gap-5 mt-3 text-gray-400 text-xs">
          {personal_info?.email && <span>{personal_info.email}</span>}
          {personal_info?.phone && <span>{personal_info.phone}</span>}
          {personal_info?.location && <span>{personal_info.location}</span>}
          {personal_info?.linkedin && <span>LinkedIn</span>}
          {personal_info?.website && <span>Portfolio</span>}
        </div>
      </div>

      {professional_summary && (
        <div className="mb-7">
          <p className="text-gray-500 leading-relaxed max-w-lg whitespace-pre-line">{professional_summary}</p>
        </div>
      )}

      {experience?.length > 0 && (
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gray-100" />
            <p className="text-xs tracking-widest uppercase text-gray-300">Experience</p>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          {experience.map((exp, i) => (
            <div key={i} className="flex gap-8 mb-4">
              <p className="w-28 text-right text-gray-300 flex-shrink-0 text-xs">
                {formatDate(exp.start_date)}<br />– {exp.is_current ? 'Present' : formatDate(exp.end_date)}
              </p>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{exp.position}</p>
                <p className="text-gray-400 mt-0.5" style={{ color: accentColor }}>{exp.company}</p>
                {exp.description && <p className="text-gray-400 mt-1 whitespace-pre-line">{exp.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {education?.length > 0 && (
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gray-100" />
            <p className="text-xs tracking-widest uppercase text-gray-300">Education</p>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          {education.map((edu, i) => (
            <div key={i} className="flex gap-8 mb-3">
              <p className="w-28 text-right text-gray-300 flex-shrink-0">{formatDate(edu.graduation_date)}</p>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                <p style={{ color: accentColor }}>{edu.institution}</p>
                {edu.gpa && <p className="text-gray-400">GPA: {edu.gpa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {project?.length > 0 && (
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gray-100" />
            <p className="text-xs tracking-widest uppercase text-gray-300">Projects</p>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          {project.map((proj, i) => (
            <div key={i} className="flex gap-8 mb-2">
              <p className="w-28 text-right text-gray-300 flex-shrink-0 italic">{proj.type}</p>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{proj.name}</p>
                {proj.description && <p className="text-gray-400 whitespace-pre-line">{proj.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {skills?.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gray-100" />
            <p className="text-xs tracking-widest uppercase text-gray-300">Skills</p>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <p className="text-gray-400">{skills.join('  ·  ')}</p>
        </div>
      )}
    </div>
  );
};

// ── Template 20: Portfolio ────────────────────────────────────────────────────
export const PortfolioTemplate = ({ data, accentColor }) => {
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
      {/* Header */}
      <div className="px-7 pt-7 pb-5 flex items-center gap-5">
        {personal_info?.image && (
          <img src={getImageSrc()} alt="Profile" className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" style={{ border: `2px solid ${accentColor}` }} />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900">{personal_info?.full_name || 'Your Name'}</h1>
          {personal_info?.profession && <p className="font-semibold mt-0.5" style={{ color: accentColor }}>{personal_info.profession}</p>}
          <div className="flex flex-wrap gap-4 mt-2 text-gray-400">
            {personal_info?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personal_info.email}</span>}
            {personal_info?.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personal_info.phone}</span>}
            {personal_info?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personal_info.location}</span>}
            {personal_info?.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />LinkedIn</span>}
            {personal_info?.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />Portfolio</span>}
          </div>
        </div>
      </div>

      {professional_summary && (
        <div className="px-7 pb-4 border-b border-gray-100">
          <p className="text-gray-600 whitespace-pre-line">{professional_summary}</p>
        </div>
      )}

      {/* Projects FIRST — portfolio-forward layout */}
      {project?.length > 0 && (
        <div className="px-7 py-4 border-b border-gray-100">
          <h2 className="font-black uppercase tracking-widest mb-3" style={{ color: accentColor }}>Featured Projects</h2>
          <div className="grid grid-cols-2 gap-3">
            {project.map((proj, i) => (
              <div key={i} className="p-3 rounded-xl border-l-4" style={{ borderColor: accentColor, backgroundColor: hexToRgba(accentColor, 0.04) }}>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-gray-900">{proj.name}</p>
                  {proj.type && (
                    <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accentColor }}>{proj.type}</span>
                  )}
                </div>
                {proj.description && <p className="text-gray-600 mt-1 whitespace-pre-line">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-7 py-4 grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {experience?.length > 0 && (
            <div>
              <h2 className="font-black uppercase tracking-widest mb-2" style={{ color: accentColor }}>Experience</h2>
              {experience.map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <p className="font-bold text-gray-900">{exp.position}</p>
                    <p className="text-gray-400">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</p>
                  </div>
                  <p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
                  {exp.description && <p className="text-gray-600 mt-0.5 whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          {skills?.length > 0 && (
            <div>
              <h2 className="font-black uppercase tracking-widest mb-2" style={{ color: accentColor }}>Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-white text-xs" style={{ backgroundColor: accentColor }}>{skill}</span>
                ))}
              </div>
            </div>
          )}
          {education?.length > 0 && (
            <div>
              <h2 className="font-black uppercase tracking-widest mb-2" style={{ color: accentColor }}>Education</h2>
              {education.map((edu, i) => (
                <div key={i} className="mb-2">
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
