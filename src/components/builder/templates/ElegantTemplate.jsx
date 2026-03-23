import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const ElegantTemplate = ({ data, accentColor }) => {
  const { personal_info, professional_summary, experience, education, project, skills } = data;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getImageSrc = () => {
    if (!personal_info?.image) return null;
    if (typeof personal_info.image === 'string') return personal_info.image;
    return URL.createObjectURL(personal_info.image);
  };

  return (
    <div className="p-10 text-gray-800 text-sm leading-relaxed h-full bg-white">
      {/* Header — centered, elegant */}
      <div className="text-center mb-8">
        {personal_info?.image && (
          <img src={getImageSrc()} alt="Profile"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
            style={{ border: `3px solid ${accentColor}` }} />
        )}
        <h1 className="text-3xl font-light tracking-[0.15em] uppercase text-gray-900">
          {personal_info?.full_name || 'Your Name'}
        </h1>
        {personal_info?.profession && (
          <p className="mt-2 text-sm tracking-widest uppercase" style={{ color: accentColor }}>
            {personal_info.profession}
          </p>
        )}
        {/* Decorative rule */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-16 bg-gray-300" />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
          <div className="h-px w-16 bg-gray-300" />
        </div>
        <div className="flex flex-wrap justify-center gap-5 mt-4 text-xs text-gray-500">
          {personal_info?.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{personal_info.email}</span>}
          {personal_info?.phone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{personal_info.phone}</span>}
          {personal_info?.location && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{personal_info.location}</span>}
          {personal_info?.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3 h-3" />LinkedIn</span>}
          {personal_info?.website && <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" />Portfolio</span>}
        </div>
      </div>

      {/* Summary */}
      {professional_summary && (
        <div className="mb-7 text-center max-w-lg mx-auto">
          <p className="text-gray-600 text-xs italic leading-relaxed whitespace-pre-line">{professional_summary}</p>
        </div>
      )}

      {/* Sections */}
      {[
        experience?.length > 0 && (
          <div key="exp" className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gray-200" />
              <h2 className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: accentColor }}>Experience</h2>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="space-y-5">
              {experience.map((exp, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-28 text-right flex-shrink-0">
                    <p className="text-xs text-gray-400 leading-tight">{formatDate(exp.start_date)}</p>
                    <p className="text-xs text-gray-400">— {exp.is_current ? 'Present' : formatDate(exp.end_date)}</p>
                  </div>
                  <div className="flex-1 border-l pl-5 border-gray-100">
                    <p className="font-semibold text-gray-900">{exp.position}</p>
                    <p className="text-xs mt-0.5" style={{ color: accentColor }}>{exp.company}</p>
                    {exp.description && <p className="text-xs text-gray-600 mt-1.5 whitespace-pre-line">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
        education?.length > 0 && (
          <div key="edu" className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gray-200" />
              <h2 className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: accentColor }}>Education</h2>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="space-y-3">
              {education.map((edu, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-28 text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">{formatDate(edu.graduation_date)}</p>
                  </div>
                  <div className="flex-1 border-l pl-5 border-gray-100">
                    <p className="font-semibold text-gray-900 text-xs">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                    <p className="text-xs" style={{ color: accentColor }}>{edu.institution}</p>
                    {edu.gpa && <p className="text-xs text-gray-400">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
        project?.length > 0 && (
          <div key="proj" className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gray-200" />
              <h2 className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: accentColor }}>Projects</h2>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="space-y-3">
              {project.map((proj, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-28 text-right flex-shrink-0">
                    {proj.type && <p className="text-xs text-gray-400 italic">{proj.type}</p>}
                  </div>
                  <div className="flex-1 border-l pl-5 border-gray-100">
                    <p className="font-semibold text-gray-900 text-xs">{proj.name}</p>
                    {proj.description && <p className="text-xs text-gray-600 mt-0.5 whitespace-pre-line">{proj.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
        skills?.length > 0 && (
          <div key="skills">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gray-200" />
              <h2 className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: accentColor }}>Skills</h2>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
              {skills.map((skill, i) => (
                <span key={i} className="text-xs text-gray-600">{skill}</span>
              ))}
            </div>
          </div>
        ),
      ]}
    </div>
  );
};

export default ElegantTemplate;
