import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

// ── Template 6: Two Column ────────────────────────────────────────────────────
export const TwoColumnTemplate = ({ data, accentColor }) => {
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
    <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>
      {children}
    </h2>
  );

  return (
    <div className="p-7 bg-white text-gray-900 text-xs leading-relaxed h-full">
      {/* Header */}
      <div className="text-center mb-5 pb-4 border-b" style={{ borderColor: accentColor }}>
        {personal_info?.image && (
          <img src={getImageSrc()} alt="Profile" className="w-16 h-16 rounded-full object-cover mx-auto mb-3" style={{ border: `2px solid ${accentColor}` }} />
        )}
        <h1 className="text-xl font-bold text-gray-900">{personal_info?.full_name || 'Your Name'}</h1>
        {personal_info?.profession && <p className="text-xs mt-0.5" style={{ color: accentColor }}>{personal_info.profession}</p>}
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-gray-500">
          {personal_info?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personal_info.email}</span>}
          {personal_info?.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personal_info.phone}</span>}
          {personal_info?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personal_info.location}</span>}
          {personal_info?.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />LinkedIn</span>}
          {personal_info?.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />Portfolio</span>}
        </div>
      </div>
      {professional_summary && <p className="text-gray-600 mb-4 text-center italic whitespace-pre-line">{professional_summary}</p>}

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          {experience?.length > 0 && (
            <div><SectionTitle>Experience</SectionTitle>
              {experience.map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between"><p className="font-bold text-gray-900">{exp.position}</p><p className="text-gray-400">{formatDate(exp.start_date)}–{exp.is_current ? 'Now' : formatDate(exp.end_date)}</p></div>
                  <p style={{ color: accentColor }}>{exp.company}</p>
                  {exp.description && <p className="text-gray-600 mt-0.5 whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
          {project?.length > 0 && (
            <div><SectionTitle>Projects</SectionTitle>
              {project.map((proj, i) => (
                <div key={i} className="mb-2">
                  <p className="font-bold text-gray-900">{proj.name} {proj.type && <span className="font-normal text-gray-400">· {proj.type}</span>}</p>
                  {proj.description && <p className="text-gray-600 whitespace-pre-line">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          {skills?.length > 0 && (
            <div><SectionTitle>Skills</SectionTitle>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-white text-xs" style={{ backgroundColor: accentColor }}>{skill}</span>
                ))}
              </div>
            </div>
          )}
          {education?.length > 0 && (
            <div><SectionTitle>Education</SectionTitle>
              {education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <p className="font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p style={{ color: accentColor }}>{edu.institution}</p>
                  <p className="text-gray-400">{formatDate(edu.graduation_date)}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Template 7: Card Template ─────────────────────────────────────────────────
export const CardTemplate = ({ data, accentColor }) => {
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

  const Card = ({ children, className = '' }) => (
    <div className={`rounded-xl border border-gray-100 p-4 shadow-sm ${className}`}>{children}</div>
  );

  const SectionTitle = ({ children }) => (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>{children}</h2>
  );

  return (
    <div className="p-6 bg-gray-50 text-gray-900 text-xs leading-relaxed h-full">
      {/* Header card */}
      <Card className="bg-white mb-4 text-center">
        {personal_info?.image && (
          <img src={getImageSrc()} alt="Profile" className="w-16 h-16 rounded-full object-cover mx-auto mb-2" style={{ border: `2px solid ${accentColor}` }} />
        )}
        <h1 className="text-lg font-bold" style={{ color: accentColor }}>{personal_info?.full_name || 'Your Name'}</h1>
        {personal_info?.profession && <p className="text-gray-500 mt-0.5">{personal_info.profession}</p>}
        <div className="flex flex-wrap justify-center gap-3 mt-2 text-gray-400">
          {personal_info?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personal_info.email}</span>}
          {personal_info?.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personal_info.phone}</span>}
          {personal_info?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personal_info.location}</span>}
        </div>
      </Card>

      {professional_summary && (
        <Card className="bg-white mb-4">
          <p className="text-gray-600 italic whitespace-pre-line">{professional_summary}</p>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-3">
          {experience?.length > 0 && (
            <Card className="bg-white">
              <SectionTitle>Experience</SectionTitle>
              <div className="space-y-3">
                {experience.map((exp, i) => (
                  <div key={i} className="p-2 rounded-lg" style={{ backgroundColor: hexToRgba(accentColor, 0.04) }}>
                    <div className="flex justify-between flex-wrap gap-1">
                      <p className="font-bold text-gray-900">{exp.position}</p>
                      <p className="text-gray-400">{formatDate(exp.start_date)}–{exp.is_current ? 'Now' : formatDate(exp.end_date)}</p>
                    </div>
                    <p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
                    {exp.description && <p className="text-gray-600 mt-1 whitespace-pre-line">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </Card>
          )}
          {project?.length > 0 && (
            <Card className="bg-white">
              <SectionTitle>Projects</SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                {project.map((proj, i) => (
                  <div key={i} className="p-2 rounded-lg border border-gray-100">
                    <p className="font-bold text-gray-900">{proj.name}</p>
                    {proj.type && <p className="text-gray-400">{proj.type}</p>}
                    {proj.description && <p className="text-gray-600 mt-0.5 whitespace-pre-line">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
        <div className="space-y-3">
          {skills?.length > 0 && (
            <Card className="bg-white">
              <SectionTitle>Skills</SectionTitle>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accentColor }}>{skill}</span>
                ))}
              </div>
            </Card>
          )}
          {education?.length > 0 && (
            <Card className="bg-white">
              <SectionTitle>Education</SectionTitle>
              {education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <p className="font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p style={{ color: accentColor }}>{edu.institution}</p>
                  <p className="text-gray-400">{formatDate(edu.graduation_date)}</p>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Template 8: Monochrome ────────────────────────────────────────────────────
export const MonochromeTemplate = ({ data, accentColor }) => {
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
    <div className="p-8 bg-white text-gray-900 text-sm leading-relaxed h-full">
      <div className="flex items-start justify-between mb-6 pb-6 border-b-4 border-gray-900">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">{personal_info?.full_name || 'Your Name'}</h1>
          {personal_info?.profession && <p className="text-gray-500 mt-1 font-medium">{personal_info.profession}</p>}
        </div>
        <div className="text-right text-xs text-gray-500 space-y-0.5">
          {personal_info?.email && <div>{personal_info.email}</div>}
          {personal_info?.phone && <div>{personal_info.phone}</div>}
          {personal_info?.location && <div>{personal_info.location}</div>}
          {personal_info?.linkedin && <div>LinkedIn</div>}
        </div>
      </div>

      {professional_summary && (
        <div className="mb-6">
          <p className="text-gray-700 text-xs whitespace-pre-line border-l-4 border-gray-200 pl-4">{professional_summary}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-5">
          {experience?.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-0.5 border-b-2" style={{ borderColor: accentColor, color: 'black' }}>Experience</h2>
              {experience.map((exp, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold">{exp.position}</p>
                    <p className="text-xs text-gray-400">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</p>
                  </div>
                  <p className="text-gray-600 text-xs font-medium">{exp.company}</p>
                  {exp.description && <p className="text-gray-600 text-xs mt-1 whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
          {project?.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-0.5 border-b-2" style={{ borderColor: accentColor, color: 'black' }}>Projects</h2>
              {project.map((proj, i) => (
                <div key={i} className="mb-2">
                  <p className="font-bold text-xs">{proj.name} {proj.type && <span className="font-normal text-gray-400">({proj.type})</span>}</p>
                  {proj.description && <p className="text-gray-600 text-xs whitespace-pre-line">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-5">
          {skills?.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-0.5 border-b-2" style={{ borderColor: accentColor, color: 'black' }}>Skills</h2>
              <div className="space-y-1">
                {skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-px bg-gray-400" />
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
          {education?.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-0.5 border-b-2" style={{ borderColor: accentColor, color: 'black' }}>Education</h2>
              {education.map((edu, i) => (
                <div key={i} className="mb-2 text-xs">
                  <p className="font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p className="text-gray-600">{edu.institution}</p>
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

// ── Template 9: Tech Template ─────────────────────────────────────────────────
export const TechTemplate = ({ data, accentColor }) => {
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
    <div className="p-7 bg-gray-950 text-green-400 text-xs leading-relaxed h-full font-mono">
      {/* Terminal header */}
      <div className="mb-5 p-4 rounded-lg border" style={{ borderColor: hexToRgba(accentColor, 0.3), backgroundColor: hexToRgba(accentColor, 0.05) }}>
        <p className="text-gray-500 mb-1">$ whoami</p>
        <div className="flex items-center gap-4">
          {personal_info?.image && (
            <img src={getImageSrc()} alt="Profile" className="w-14 h-14 rounded object-cover" style={{ border: `1px solid ${accentColor}` }} />
          )}
          <div>
            <p className="text-lg font-bold" style={{ color: accentColor }}>{personal_info?.full_name || 'Your Name'}</p>
            {personal_info?.profession && <p className="text-gray-400 text-xs"># {personal_info.profession}</p>}
            <div className="flex flex-wrap gap-3 mt-1 text-gray-500">
              {personal_info?.email && <span>✉ {personal_info.email}</span>}
              {personal_info?.phone && <span>☎ {personal_info.phone}</span>}
              {personal_info?.location && <span>📍 {personal_info.location}</span>}
            </div>
          </div>
        </div>
      </div>

      {professional_summary && (
        <div className="mb-4">
          <p className="text-gray-500 mb-1">$ cat about.txt</p>
          <p className="text-gray-300 pl-2 border-l" style={{ borderColor: accentColor }}>{professional_summary}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          {experience?.length > 0 && (
            <div>
              <p className="text-gray-500 mb-2">$ ls experience/</p>
              {experience.map((exp, i) => (
                <div key={i} className="mb-3 pl-2 border-l" style={{ borderColor: hexToRgba(accentColor, 0.4) }}>
                  <p style={{ color: accentColor }}>{exp.position} @ {exp.company}</p>
                  <p className="text-gray-500"># {formatDate(exp.start_date)} → {exp.is_current ? 'present' : formatDate(exp.end_date)}</p>
                  {exp.description && <p className="text-gray-300 mt-0.5 whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
          {project?.length > 0 && (
            <div>
              <p className="text-gray-500 mb-2">$ ls projects/</p>
              {project.map((proj, i) => (
                <div key={i} className="mb-2 pl-2 border-l" style={{ borderColor: hexToRgba(accentColor, 0.4) }}>
                  <p style={{ color: accentColor }}>→ {proj.name} {proj.type && <span className="text-gray-500">({proj.type})</span>}</p>
                  {proj.description && <p className="text-gray-300 whitespace-pre-line">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          {skills?.length > 0 && (
            <div>
              <p className="text-gray-500 mb-2">$ cat skills.json</p>
              <div className="text-gray-300">[</div>
              {skills.map((skill, i) => (
                <div key={i} className="pl-3" style={{ color: accentColor }}>
                  "{skill}"{i < skills.length - 1 ? ',' : ''}
                </div>
              ))}
              <div className="text-gray-300">]</div>
            </div>
          )}
          {education?.length > 0 && (
            <div>
              <p className="text-gray-500 mb-2">$ cat education.txt</p>
              {education.map((edu, i) => (
                <div key={i} className="mb-2 text-gray-300">
                  <p style={{ color: accentColor }}>{edu.degree}</p>
                  {edu.field && <p># {edu.field}</p>}
                  <p>{edu.institution}</p>
                  <p className="text-gray-500">{formatDate(edu.graduation_date)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Template 10: Infographic ──────────────────────────────────────────────────
export const InfographicTemplate = ({ data, accentColor }) => {
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
      {/* Header with accent bg */}
      <div className="px-7 py-6 flex items-center gap-5" style={{ backgroundColor: hexToRgba(accentColor, 0.08) }}>
        {personal_info?.image && (
          <img src={getImageSrc()} alt="Profile" className="w-18 h-18 rounded-full object-cover flex-shrink-0"
            style={{ width: 72, height: 72, border: `3px solid ${accentColor}` }} />
        )}
        <div className="flex-1">
          <h1 className="text-xl font-black text-gray-900">{personal_info?.full_name || 'Your Name'}</h1>
          {personal_info?.profession && <p className="font-medium mt-0.5" style={{ color: accentColor }}>{personal_info.profession}</p>}
          <div className="flex flex-wrap gap-4 mt-2 text-gray-500">
            {personal_info?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personal_info.email}</span>}
            {personal_info?.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personal_info.phone}</span>}
            {personal_info?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personal_info.location}</span>}
          </div>
        </div>
        {/* Quick stats */}
        <div className="flex gap-3 flex-shrink-0">
          {[
            { val: experience?.length || 0, label: 'Roles' },
            { val: skills?.length || 0, label: 'Skills' },
            { val: project?.length || 0, label: 'Projects' },
          ].map((stat) => (
            <div key={stat.label} className="text-center w-12">
              <div className="text-xl font-black" style={{ color: accentColor }}>{stat.val}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-7 pb-7 pt-4">
        {professional_summary && (
          <p className="text-gray-600 mb-4 italic whitespace-pre-line">{professional_summary}</p>
        )}

        {/* Skills bars */}
        {skills?.length > 0 && (
          <div className="mb-5">
            <h2 className="font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Skills</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-gray-700">{skill}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${70 + (i % 4) * 7.5}%`, backgroundColor: accentColor, opacity: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-4">
            {experience?.length > 0 && (
              <div>
                <h2 className="font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Experience</h2>
                {experience.map((exp, i) => (
                  <div key={i} className="mb-3 flex gap-3">
                    <div className="w-10 text-center flex-shrink-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xs" style={{ backgroundColor: accentColor }}>
                        {(exp.position || 'P').charAt(0)}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{exp.position}</p>
                      <p style={{ color: accentColor }}>{exp.company}</p>
                      <p className="text-gray-400">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</p>
                      {exp.description && <p className="text-gray-600 mt-0.5 whitespace-pre-line">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-4">
            {education?.length > 0 && (
              <div>
                <h2 className="font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Education</h2>
                {education.map((edu, i) => (
                  <div key={i} className="mb-2 p-2 rounded-lg" style={{ backgroundColor: hexToRgba(accentColor, 0.05) }}>
                    <p className="font-bold text-gray-900">{edu.degree}</p>
                    {edu.field && <p className="text-gray-600">{edu.field}</p>}
                    <p style={{ color: accentColor }}>{edu.institution}</p>
                    <p className="text-gray-400">{formatDate(edu.graduation_date)}</p>
                  </div>
                ))}
              </div>
            )}
            {project?.length > 0 && (
              <div>
                <h2 className="font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Projects</h2>
                {project.map((proj, i) => (
                  <div key={i} className="mb-2">
                    <p className="font-bold text-gray-900">{proj.name}</p>
                    {proj.type && <p className="text-gray-400">{proj.type}</p>}
                    {proj.description && <p className="text-gray-600 whitespace-pre-line">{proj.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
