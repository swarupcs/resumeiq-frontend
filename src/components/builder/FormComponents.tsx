import { useState } from 'react';
import { Plus, Trash2, Briefcase, GraduationCap, FolderIcon, Sparkles, X, Loader2 } from 'lucide-react';
import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/primitives';
import { Switch } from '@/components/ui/primitives';
import { Label } from '@/components/ui/label';
import { useEnhanceProfessionalSummary, useEnhanceJobDescription } from '@/hooks/ai';
import type { PersonalInfo, ExperienceEntry, EducationEntry, ProjectEntry } from '@/types';

// ── PersonalInfoForm ──────────────────────────────────────────────────────────
interface PersonalInfoFormProps {
  data: Partial<PersonalInfo>;
  onChange: (data: Partial<PersonalInfo>) => void;
  removeBackground: boolean;
  setRemoveBackground: (v: boolean) => void;
}

export const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }: PersonalInfoFormProps) => {
  const handleChange = (field: keyof PersonalInfo, value: string | File) => onChange({ ...data, [field]: value });
  const getImageSrc = () => {
    if (!data.image) return null;
    if (typeof data.image === 'string') return data.image;
    return URL.createObjectURL(data.image);
  };
  const fields: { key: keyof PersonalInfo; label: string; icon: React.ElementType; type: string; required?: boolean }[] = [
    { key: 'full_name', label: 'Full Name', icon: User, type: 'text', required: true },
    { key: 'email', label: 'Email Address', icon: Mail, type: 'email', required: true },
    { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel' },
    { key: 'location', label: 'Location', icon: MapPin, type: 'text' },
    { key: 'profession', label: 'Profession', icon: BriefcaseBusiness, type: 'text' },
    { key: 'linkedin', label: 'LinkedIn Profile', icon: Linkedin, type: 'url' },
    { key: 'website', label: 'Personal Website', icon: Globe, type: 'url' },
  ];
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
      <p className="text-sm text-muted-foreground">Get started with personal information</p>
      <div className="flex items-center gap-4 mt-4">
        <label className="cursor-pointer">
          {data.image ? (
            <img src={getImageSrc() ?? ''} alt="Profile" className="w-16 h-16 rounded-full object-cover ring-2 ring-border hover:opacity-80 transition-opacity" />
          ) : (
            <div className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              <User className="size-10 p-2.5 border border-border rounded-full" />
              <span className="text-sm">Upload photo</span>
            </div>
          )}
          <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => e.target.files?.[0] && handleChange('image', e.target.files[0])} />
        </label>
        {typeof data.image === 'object' && data.image !== null && (
          <div className="flex items-center gap-3 pl-4">
            <Label htmlFor="remove-bg" className="text-sm text-muted-foreground">Remove Background</Label>
            <Switch id="remove-bg" checked={removeBackground} onCheckedChange={setRemoveBackground} />
          </div>
        )}
      </div>
      {fields.map(({ key, label, icon: Icon, type, required }) => (
        <div key={key} className="space-y-1 mt-5">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Icon className="size-4" />{label}{required && <span className="text-destructive">*</span>}
          </label>
          <input
            type={type}
            value={typeof data[key] === 'string' ? (data[key] as string) : ''}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={`Enter your ${label.toLowerCase()}`}
            required={required}
            className="mt-1 w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-colors text-sm"
          />
        </div>
      ))}
    </div>
  );
};

// ── ProfessionalSummaryForm ───────────────────────────────────────────────────
export const ProfessionalSummaryForm = ({ data, onChange }: { data: string; onChange: (v: string) => void }) => {
  const { mutateAsync: enhance, isPending } = useEnhanceProfessionalSummary();
  const handleEnhance = async () => {
    if (!data.trim()) { toast.error('Please write some content first'); return; }
    const result = await enhance(data);
    if (result.data?.enhancedContent) onChange(result.data.enhancedContent);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Professional Summary</h3>
          <p className="text-sm text-muted-foreground">Add a compelling summary</p>
        </div>
        <button disabled={isPending} onClick={() => void handleEnhance()} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 dark:bg-purple-900/30 dark:text-purple-300">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {isPending ? 'Enhancing...' : 'AI Enhance'}
        </button>
      </div>
      <textarea value={data ?? ''} onChange={(e) => onChange(e.target.value)} rows={7} placeholder="Write a compelling professional summary..." className="w-full p-3 px-4 border text-sm border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-colors resize-none" />
    </div>
  );
};

// ── ExperienceForm ────────────────────────────────────────────────────────────
export const ExperienceForm = ({ data, onChange }: { data: ExperienceEntry[]; onChange: (v: ExperienceEntry[]) => void }) => {
  const { mutateAsync: enhance, isPending } = useEnhanceJobDescription();
  const add = () => onChange([...data, { company: '', position: '', start_date: '', end_date: '', description: '', is_current: false }]);
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof ExperienceEntry, value: string | boolean) => {
    const updated = [...data];
    updated[i] = { ...updated[i]!, [field]: value };
    onChange(updated);
  };
  const handleEnhance = async (i: number) => {
    const exp = data[i];
    if (!exp?.position || !exp?.company) { toast.error('Please fill in company and position first'); return; }
    const content = exp.description?.trim() ? `Company: ${exp.company}\nPosition: ${exp.position}\nCurrent Description: ${exp.description}` : `Company: ${exp.company}\nPosition: ${exp.position}\nGenerate a professional job description.`;
    const result = await enhance(content);
    if (result.data?.enhancedContent) update(i, 'description', result.data.enhancedContent);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-semibold text-foreground">Professional Experience</h3><p className="text-sm text-muted-foreground">Add your work experience</p></div>
        <button onClick={add} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors dark:bg-green-900/30 dark:text-green-300"><Plus className="size-4" />Add Experience</button>
      </div>
      {data.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground"><Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No experience added yet.</p></div>
      ) : (
        <div className="space-y-4">
          {data.map((exp, i) => (
            <div key={i} className="p-4 border border-border rounded-lg space-y-3 bg-card">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-foreground">Experience #{i + 1}</h4>
                <button onClick={() => remove(i)} className="text-destructive hover:text-destructive/80"><Trash2 className="size-4" /></button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {(['company', 'position'] as const).map((f) => (
                  <input key={f} value={exp[f] ?? ''} onChange={(e) => update(i, f, e.target.value)} placeholder={f === 'company' ? 'Company Name' : 'Job Title'} className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none" />
                ))}
                <input value={exp.start_date ?? ''} onChange={(e) => update(i, 'start_date', e.target.value)} type="month" className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none" />
                <input value={exp.end_date ?? ''} onChange={(e) => update(i, 'end_date', e.target.value)} type="month" disabled={exp.is_current} className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none disabled:bg-muted disabled:cursor-not-allowed" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id={`current-${i}`} checked={exp.is_current} onCheckedChange={(c) => update(i, 'is_current', c)} />
                <label htmlFor={`current-${i}`} className="text-sm text-muted-foreground cursor-pointer">Currently working here</label>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Job Description</label>
                  <button onClick={() => void handleEnhance(i)} disabled={isPending || !exp.position || !exp.company} className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50 dark:bg-purple-900/30 dark:text-purple-300">
                    {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    {!exp.description?.trim() ? 'Generate with AI' : 'Enhance with AI'}
                  </button>
                </div>
                <textarea value={exp.description ?? ''} onChange={(e) => update(i, 'description', e.target.value)} rows={4} className="w-full text-sm px-3 py-2 rounded-lg resize-none border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none" placeholder="Describe your key responsibilities..." />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── EducationForm ─────────────────────────────────────────────────────────────
export const EducationForm = ({ data, onChange }: { data: EducationEntry[]; onChange: (v: EducationEntry[]) => void }) => {
  const add = () => onChange([...data, { institution: '', degree: '', field: '', graduation_date: '', gpa: '' }]);
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof EducationEntry, value: string) => { const u = [...data]; u[i] = { ...u[i]!, [field]: value }; onChange(u); };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-semibold text-foreground">Education</h3><p className="text-sm text-muted-foreground">Add your education details</p></div>
        <button onClick={add} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors dark:bg-green-900/30 dark:text-green-300"><Plus className="size-4" />Add Education</button>
      </div>
      {data.length === 0 ? <div className="text-center py-8 text-muted-foreground"><GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No education added yet.</p></div> : (
        <div className="space-y-4">
          {data.map((edu, i) => (
            <div key={i} className="p-4 border border-border rounded-lg space-y-3 bg-card">
              <div className="flex justify-between items-start"><h4 className="font-medium">Education #{i + 1}</h4><button onClick={() => remove(i)} className="text-destructive hover:text-destructive/80"><Trash2 className="size-4" /></button></div>
              <div className="grid md:grid-cols-2 gap-3">
                <input value={edu.institution ?? ''} onChange={(e) => update(i, 'institution', e.target.value)} placeholder="Institution Name" className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring outline-none" />
                <input value={edu.degree ?? ''} onChange={(e) => update(i, 'degree', e.target.value)} placeholder="Degree (e.g., Bachelor's)" className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring outline-none" />
                <input value={edu.field ?? ''} onChange={(e) => update(i, 'field', e.target.value)} placeholder="Field of Study" className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring outline-none" />
                <input value={edu.graduation_date ?? ''} onChange={(e) => update(i, 'graduation_date', e.target.value)} type="month" className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring outline-none" />
              </div>
              <input value={edu.gpa ?? ''} onChange={(e) => update(i, 'gpa', e.target.value)} placeholder="GPA (optional)" className="w-full md:w-1/2 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring outline-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── ProjectForm ───────────────────────────────────────────────────────────────
export const ProjectForm = ({ data, onChange }: { data: ProjectEntry[]; onChange: (v: ProjectEntry[]) => void }) => {
  const add = () => onChange([...data, { name: '', type: '', description: '' }]);
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof ProjectEntry, value: string) => { const u = [...data]; u[i] = { ...u[i]!, [field]: value }; onChange(u); };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-semibold text-foreground">Projects</h3><p className="text-sm text-muted-foreground">Add your notable projects</p></div>
        <button onClick={add} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors dark:bg-green-900/30 dark:text-green-300"><Plus className="size-4" />Add Project</button>
      </div>
      {data.length === 0 ? <div className="text-center py-8 text-muted-foreground"><FolderIcon className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No projects added yet.</p></div> : (
        <div className="space-y-4">
          {data.map((proj, i) => (
            <div key={i} className="p-4 border border-border rounded-lg space-y-3 bg-card">
              <div className="flex justify-between items-start"><h4 className="font-medium">Project #{i + 1}</h4><button onClick={() => remove(i)} className="text-destructive hover:text-destructive/80"><Trash2 className="size-4" /></button></div>
              <div className="grid gap-3">
                <input value={proj.name ?? ''} onChange={(e) => update(i, 'name', e.target.value)} placeholder="Project Name" className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none" />
                <input value={proj.type ?? ''} onChange={(e) => update(i, 'type', e.target.value)} placeholder="Project Type (e.g., Web App)" className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none" />
                <textarea rows={4} value={proj.description ?? ''} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Describe your project..." className="w-full px-3 py-2 text-sm rounded-lg resize-none border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── SkillsForm ────────────────────────────────────────────────────────────────
export const SkillsForm = ({ data, onChange }: { data: string[]; onChange: (v: string[]) => void }) => {
  const [newSkill, setNewSkill] = useState('');
  const add = () => { if (newSkill.trim() && !data.includes(newSkill.trim())) { onChange([...data, newSkill.trim()]); setNewSkill(''); } };
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-4">
      <div><h3 className="text-lg font-semibold text-foreground">Skills</h3><p className="text-sm text-muted-foreground">Add your technical and soft skills</p></div>
      <div className="flex gap-2">
        <input type="text" placeholder="Enter a skill (e.g., JavaScript)" className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring outline-none" onChange={(e) => setNewSkill(e.target.value)} value={newSkill} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} />
        <button onClick={add} disabled={!newSkill.trim()} className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><Plus className="size-4" />Add</button>
      </div>
      {data.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {data.map((skill, i) => (
            <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
              {skill}
              <button onClick={() => remove(i)} className="ml-1 hover:bg-primary/20 rounded-full p-0.5"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground"><Sparkles className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>No skills added yet.</p></div>
      )}
      <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
        <p className="text-sm text-primary"><strong>Tip:</strong> Add 8-12 relevant skills including both technical and soft skills.</p>
      </div>
    </div>
  );
};
