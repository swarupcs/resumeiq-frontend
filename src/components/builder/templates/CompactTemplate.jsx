import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const CompactTemplate = ({ data, accentColor }) => {
  const { personal_info, professional_summary, experience, education, project, skills } = data;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getImageSrc = () => {
    if (!personal_info?.image) return null;
    if (typeof personal_info.image === 'string') return personal_info.image;
    return URL.createObjectURL(personal_info.image);
  };

  const SectionTitle = ({ children }) => (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-1.5 pb-0.5 border-b"
      style={{ color: accentColor, borderColor: accentColor }}>
      {children}
    </h2>
  );

  return (
    <div className="p-6 text-gray-900 text-xs leading-snug h-full bg-white">
      {/* Header — compact single row */}
      <div className="flex items-center gap-4 mb-4 pb-3 border-b-2" style={{ borderColor: accentColor }}>
        {personal_info?.image && (
          <img src={getImageSrc()} alt="Profile"
            className="w-14 h-14 rounded-full object-cover border-2 flex-shrink-0"
            style={{ borderColor: accentColor }} />
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold leading-tight" style={{ color: accentColor }}>
            {personal_info?.full_name || 'Your Name'}
          </h1>
          {personal_info?.profession && (
            <p className="text-gray-500 text-xs">{personal_info.profession}</p>
          )}
        </div>
        <div className="text-right text-xs text-gray-500 space-y-0.5 flex-shrink-0">
          {personal_info?.email && <div className="flex items-center justify-end gap-1"><Mail className="w-2.5 h-2.5" />{personal_info.email}</div>}
          {personal_info?.phone && <div className="flex items-center justify-end gap-1"><Phone className="w-2.5 h-2.5" />{personal_info.phone}</div>}
          {personal_info?.location && <div className="flex items-center justify-end gap-1"><MapPin className="w-2.5 h-2.5" />{personal_info.location}</div>}
          {personal_info?.linkedin && <div className="flex items-center justify-end gap-1"><Linkedin className="w-2.5 h-2.5" />LinkedIn</div>}
          {personal_info?.website && <div className="flex items-center justify-end gap-1"><Globe className="w-2.5 h-2.5" />Portfolio</div>}
        </div>
      </div>

      {/* Summary */}
      {professional_summary && (
        <div className="mb-3">
          <SectionTitle>Summary</SectionTitle>
          <p className="text-gray-600 whitespace-pre-line">{professional_summary}</p>
        </div>
      )}

      {/* 3-column body */}
      <div className="grid grid-cols-3 gap-4">
        {/* Col 1: Experience */}
        <div className="col-span-1 space-y-3">
          {experience?.length > 0 && (
            <div>
              <SectionTitle>Experience</SectionTitle>
              <div className="space-y-2">
                {experience.map((exp, i) => (
                  <div key={i}>
                    <p className="font-semibold text-gray-900 leading-tight">{exp.position}</p>
                    <p className="text-gray-500">{exp.company}</p>
                    <p className="text-gray-400">{formatDate(exp.start_date)}–{exp.is_current ? 'Now' : formatDate(exp.end_date)}</p>
                    {exp.description && <p className="text-gray-600 mt-0.5 whitespace-pre-line">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Col 2: Projects + Education */}
        <div className="col-span-1 space-y-3">
          {project?.length > 0 && (
            <div>
              <SectionTitle>Projects</SectionTitle>
              <div className="space-y-2">
                {project.map((proj, i) => (
                  <div key={i}>
                    <p className="font-semibold text-gray-900">{proj.name}</p>
                    {proj.type && <p className="text-gray-400">{proj.type}</p>}
                    {proj.description && <p className="text-gray-600 whitespace-pre-line">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {education?.length > 0 && (
            <div>
              <SectionTitle>Education</SectionTitle>
              <div className="space-y-2">
                {education.map((edu, i) => (
                  <div key={i}>
                    <p className="font-semibold text-gray-900">{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</p>
                    <p className="text-gray-500">{edu.institution}</p>
                    <p className="text-gray-400">{formatDate(edu.graduation_date)}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Col 3: Skills */}
        <div className="col-span-1">
          {skills?.length > 0 && (
            <div>
              <SectionTitle>Skills</SectionTitle>
              <div className="flex flex-col gap-0.5">
                {skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                    <span className="text-gray-700">{skill}</span>
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

export default CompactTemplate;
