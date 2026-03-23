import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const TimelineTemplate = ({ data, accentColor }) => {
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

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  return (
    <div className="h-full bg-white text-gray-900 text-sm leading-relaxed">
      {/* Header */}
      <div className="px-8 pt-8 pb-5" style={{ background: `linear-gradient(135deg, ${hexToRgba(accentColor, 0.08)}, white)` }}>
        <div className="flex items-center gap-5">
          {personal_info?.image && (
            <img src={getImageSrc()} alt="Profile"
              className="w-20 h-20 rounded-full object-cover flex-shrink-0"
              style={{ border: `3px solid ${accentColor}` }} />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{personal_info?.full_name || 'Your Name'}</h1>
            {personal_info?.profession && (
              <p className="font-medium text-sm mt-0.5" style={{ color: accentColor }}>{personal_info.profession}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
              {personal_info?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personal_info.email}</span>}
              {personal_info?.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personal_info.phone}</span>}
              {personal_info?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personal_info.location}</span>}
              {personal_info?.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />LinkedIn</span>}
              {personal_info?.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />Portfolio</span>}
            </div>
          </div>
        </div>
        {professional_summary && (
          <p className="mt-4 text-xs text-gray-600 whitespace-pre-line">{professional_summary}</p>
        )}
      </div>

      <div className="px-8 pb-8 grid grid-cols-5 gap-6">
        {/* Left: Timeline experience */}
        <div className="col-span-3">
          {experience?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accentColor }}>Career Timeline</h2>
              <div className="relative">
                {/* Spine */}
                <div className="absolute left-[7px] top-2 bottom-0 w-0.5" style={{ backgroundColor: hexToRgba(accentColor, 0.2) }} />
                <div className="space-y-5">
                  {experience.map((exp, i) => (
                    <div key={i} className="flex gap-4">
                      {/* Timeline node */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-3.5 h-3.5 rounded-full border-2 bg-white z-10" style={{ borderColor: accentColor }} />
                      </div>
                      <div className="pb-2">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                          <span className="text-xs px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: accentColor }}>
                            {exp.is_current ? 'Current' : formatDate(exp.end_date)}
                          </span>
                        </div>
                        <p className="text-xs font-medium mt-0.5" style={{ color: accentColor }}>{exp.company}</p>
                        <p className="text-xs text-gray-400">{formatDate(exp.start_date)}</p>
                        {exp.description && <p className="text-xs text-gray-600 mt-1.5 whitespace-pre-line">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {project?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Projects</h2>
              <div className="space-y-2">
                {project.map((proj, i) => (
                  <div key={i} className="border-l-2 pl-3" style={{ borderColor: hexToRgba(accentColor, 0.4) }}>
                    <p className="font-semibold text-gray-900 text-xs">{proj.name} {proj.type && <span className="font-normal text-gray-400">· {proj.type}</span>}</p>
                    {proj.description && <p className="text-xs text-gray-600 whitespace-pre-line">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: sidebar */}
        <div className="col-span-2 space-y-5 pt-4">
          {skills?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: hexToRgba(accentColor, 0.1), color: accentColor }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {education?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Education</h2>
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <div key={i} className="p-2.5 rounded-lg" style={{ backgroundColor: hexToRgba(accentColor, 0.05) }}>
                    <p className="font-semibold text-gray-900 text-xs">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                    <p className="text-xs mt-0.5" style={{ color: accentColor }}>{edu.institution}</p>
                    <p className="text-xs text-gray-400">{formatDate(edu.graduation_date)}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</p>
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

export default TimelineTemplate;
