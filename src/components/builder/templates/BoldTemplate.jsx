import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const BoldTemplate = ({ data, accentColor }) => {
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

  return (
    <div className="h-full bg-white text-gray-900 text-sm leading-relaxed flex">
      {/* Thick left accent bar */}
      <div className="w-2 flex-shrink-0" style={{ backgroundColor: accentColor }} />

      <div className="flex-1 p-8">
        {/* Bold header */}
        <div className="mb-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight leading-none text-gray-900">
                {personal_info?.full_name?.split(' ')[0] || 'First'}
              </h1>
              <h1 className="text-4xl font-black tracking-tight leading-none" style={{ color: accentColor }}>
                {personal_info?.full_name?.split(' ').slice(1).join(' ') || 'Last Name'}
              </h1>
              {personal_info?.profession && (
                <p className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {personal_info.profession}
                </p>
              )}
            </div>
            {personal_info?.image && (
              <img src={getImageSrc()} alt="Profile"
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                style={{ outline: `3px solid ${accentColor}` }} />
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
            {personal_info?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personal_info.email}</span>}
            {personal_info?.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personal_info.phone}</span>}
            {personal_info?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personal_info.location}</span>}
            {personal_info?.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />LinkedIn</span>}
            {personal_info?.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />Portfolio</span>}
          </div>
        </div>

        {professional_summary && (
          <div className="mb-6 p-3 border-l-4" style={{ borderColor: accentColor, backgroundColor: `${accentColor}08` }}>
            <p className="text-gray-700 text-xs whitespace-pre-line">{professional_summary}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-5">
            {experience?.length > 0 && (
              <div>
                <h2 className="text-base font-black uppercase mb-3 flex items-center gap-2">
                  <span className="w-4 h-0.5 inline-block" style={{ backgroundColor: accentColor }} />
                  Experience
                </h2>
                <div className="space-y-4">
                  {experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                        <span className="text-xs text-gray-400">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span>
                      </div>
                      <p className="text-xs font-semibold" style={{ color: accentColor }}>{exp.company}</p>
                      {exp.description && <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {project?.length > 0 && (
              <div>
                <h2 className="text-base font-black uppercase mb-3 flex items-center gap-2">
                  <span className="w-4 h-0.5 inline-block" style={{ backgroundColor: accentColor }} />
                  Projects
                </h2>
                <div className="space-y-3">
                  {project.map((proj, i) => (
                    <div key={i}>
                      <h3 className="font-bold text-gray-900">{proj.name} {proj.type && <span className="font-normal text-gray-400 text-xs">· {proj.type}</span>}</h3>
                      {proj.description && <p className="text-xs text-gray-600 whitespace-pre-line">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-5">
            {skills?.length > 0 && (
              <div>
                <h2 className="text-base font-black uppercase mb-3 flex items-center gap-2">
                  <span className="w-4 h-0.5 inline-block" style={{ backgroundColor: accentColor }} />
                  Skills
                </h2>
                <div className="space-y-1">
                  {skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: accentColor }} />
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {education?.length > 0 && (
              <div>
                <h2 className="text-base font-black uppercase mb-3 flex items-center gap-2">
                  <span className="w-4 h-0.5 inline-block" style={{ backgroundColor: accentColor }} />
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu, i) => (
                    <div key={i}>
                      <p className="font-bold text-xs">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                      <p className="text-xs" style={{ color: accentColor }}>{edu.institution}</p>
                      <p className="text-xs text-gray-400">{formatDate(edu.graduation_date)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoldTemplate;
