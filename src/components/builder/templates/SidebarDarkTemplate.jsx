import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const SidebarDarkTemplate = ({ data, accentColor }) => {
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
    <div className="h-full bg-white text-sm leading-relaxed flex">
      {/* Dark sidebar */}
      <div className="w-52 flex-shrink-0 bg-gray-900 text-white p-6 flex flex-col gap-5">
        {/* Profile */}
        <div className="text-center">
          {personal_info?.image && (
            <img src={getImageSrc()} alt="Profile"
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2"
              style={{ borderColor: accentColor }} />
          )}
          <h1 className="font-bold text-sm leading-tight">{personal_info?.full_name || 'Your Name'}</h1>
          {personal_info?.profession && (
            <p className="text-xs mt-1" style={{ color: accentColor }}>{personal_info.profession}</p>
          )}
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b border-white/10" style={{ color: accentColor }}>Contact</h2>
          <div className="space-y-1.5 text-xs text-gray-300">
            {personal_info?.email && <div className="flex items-start gap-2"><Mail className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: accentColor }} /><span className="break-all">{personal_info.email}</span></div>}
            {personal_info?.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />{personal_info.phone}</div>}
            {personal_info?.location && <div className="flex items-center gap-2"><MapPin className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />{personal_info.location}</div>}
            {personal_info?.linkedin && <div className="flex items-center gap-2"><Linkedin className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />LinkedIn</div>}
            {personal_info?.website && <div className="flex items-center gap-2"><Globe className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />Portfolio</div>}
          </div>
        </div>

        {/* Skills */}
        {skills?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b border-white/10" style={{ color: accentColor }}>Skills</h2>
            <div className="flex flex-col gap-1.5">
              {skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b border-white/10" style={{ color: accentColor }}>Education</h2>
            <div className="space-y-2">
              {education.map((edu, i) => (
                <div key={i} className="text-xs">
                  <p className="font-semibold text-white">{edu.degree}</p>
                  {edu.field && <p className="text-gray-300">{edu.field}</p>}
                  <p style={{ color: accentColor }}>{edu.institution}</p>
                  <p className="text-gray-400">{formatDate(edu.graduation_date)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-7 text-gray-900">
        {professional_summary && (
          <div className="mb-5 p-3 rounded bg-gray-50 border-l-3" style={{ borderLeft: `3px solid ${accentColor}` }}>
            <p className="text-xs text-gray-600 whitespace-pre-line">{professional_summary}</p>
          </div>
        )}

        {experience?.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-5 h-0.5 inline-block" style={{ backgroundColor: accentColor }} />
              <span style={{ color: accentColor }}>Experience</span>
            </h2>
            <div className="space-y-4">
              {experience.map((exp, i) => (
                <div key={i} className="pl-3 border-l" style={{ borderColor: `${accentColor}40` }}>
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-xs text-gray-400">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span>
                  </div>
                  <p className="text-xs font-medium" style={{ color: accentColor }}>{exp.company}</p>
                  {exp.description && <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {project?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-5 h-0.5 inline-block" style={{ backgroundColor: accentColor }} />
              <span style={{ color: accentColor }}>Projects</span>
            </h2>
            <div className="space-y-2">
              {project.map((proj, i) => (
                <div key={i} className="pl-3 border-l" style={{ borderColor: `${accentColor}40` }}>
                  <p className="font-semibold text-gray-900 text-xs">{proj.name} {proj.type && <span className="font-normal text-gray-400">· {proj.type}</span>}</p>
                  {proj.description && <p className="text-xs text-gray-600 whitespace-pre-line">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarDarkTemplate;
