import { useState } from 'react';
import { Check, Layout, X, Palette, Clock, Loader2, AlertCircle } from 'lucide-react';
import { ClassicTemplate, ModernTemplate, MinimalTemplate, ExecutiveTemplate } from './templates/Templates';
import type { ResumeData } from '@/types';
import type { AutosaveStatus } from '@/hooks/resume/useAutosave';

// ── ResumePreview ─────────────────────────────────────────────────────────────
const TEMPLATE_MAP: Record<string, React.ComponentType<{ data: ResumeData; accentColor: string }>> = {
  classic:     ClassicTemplate,
  modern:      ModernTemplate,
  minimal:     MinimalTemplate,
  executive:   ExecutiveTemplate,
};

interface ResumePreviewProps { data: ResumeData; template?: string; accentColor?: string; }
const ResumePreview = ({ data, template = 'classic', accentColor = '#3B82F6' }: ResumePreviewProps) => {
  const TemplateComponent = TEMPLATE_MAP[template] ?? ClassicTemplate;
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ width: '100%', minHeight: '297mm' }} data-resume-ready>
      <TemplateComponent data={data} accentColor={accentColor} />
    </div>
  );
};
export default ResumePreview;

// ── TemplateSelector ──────────────────────────────────────────────────────────
const SAMPLE_DATA: ResumeData = {
  title: 'Sample', template: 'classic', accent_color: '#3B82F6',
  professional_summary: 'Creative product designer with 5 years of experience crafting intuitive digital experiences.',
  personal_info: { full_name: 'Alex Johnson', profession: 'Product Designer', email: 'alex@example.com', phone: '+1 555 0100', location: 'San Francisco, CA', linkedin: '', website: '', image: '' },
  experience: [{ company: 'Stripe', position: 'Senior Product Designer', start_date: '2021-03', end_date: '', is_current: true, description: 'Led end-to-end design for the payments dashboard.' }],
  education: [{ institution: 'Carnegie Mellon', degree: 'B.S.', field: 'HCI', graduation_date: '2019-05', gpa: '3.8' }],
  project: [{ name: 'Design System', type: 'Open Source', description: 'Built a scalable component library.' }],
  skills: ['Figma', 'React', 'Prototyping', 'User Research'],
};

export const TEMPLATES = [
  { id: 'classic',   name: 'Classic',   description: 'Clean & traditional' },
  { id: 'modern',    name: 'Modern',    description: 'Sidebar with color' },
  { id: 'minimal',   name: 'Minimal',   description: 'Ultra-clean type' },
  { id: 'executive', name: 'Executive', description: 'Bold header, timeline' },
];

const THUMB_SCALE = 0.196;
const THUMB_WIDTH = 160;
const THUMB_HEIGHT = Math.round(THUMB_WIDTH * (11 / 8.5));

const TemplateThumbnail = ({ template, accentColor, isSelected, onClick }: { template: typeof TEMPLATES[0]; accentColor: string; isSelected: boolean; onClick: () => void }) => {
  const TC = TEMPLATE_MAP[template.id] ?? ClassicTemplate;
  return (
    <button onClick={onClick} className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg flex-shrink-0 ${isSelected ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'}`} style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT }} title={template.name}>
      <div className="absolute top-0 left-0 origin-top-left pointer-events-none bg-white" style={{ width: `${100 / THUMB_SCALE}%`, height: `${100 / THUMB_SCALE}%`, transform: `scale(${THUMB_SCALE})` }}>
        <TC data={SAMPLE_DATA} accentColor={accentColor} />
      </div>
      {isSelected && <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm"><Check className="h-3 w-3 text-white" /></div>}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 z-10"><p className="text-white text-xs font-medium truncate leading-tight">{template.name}</p></div>
    </button>
  );
};

export const TemplateSelector = ({ selectedTemplate, onChange, accentColor = '#3B82F6' }: { selectedTemplate: string; onChange: (id: string) => void; accentColor?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = TEMPLATES.find((t) => t.id === selectedTemplate) ?? TEMPLATES[0]!;
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1.5 text-sm text-primary bg-primary/10 hover:bg-primary/20 transition-all px-3 py-2 rounded-lg">
        <Layout size={14} /><span className="text-xs text-muted-foreground hidden sm:inline">Template — {selected.name}</span>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 z-20 bg-card rounded-xl border border-border shadow-xl p-4 w-[380px]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">Choose a template <span className="text-xs text-muted-foreground font-normal">({TEMPLATES.length} total)</span></p>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
              {TEMPLATES.map((t) => (
                <div key={t.id} className="flex flex-col items-center gap-1.5">
                  <TemplateThumbnail template={t} accentColor={accentColor} isSelected={selectedTemplate === t.id} onClick={() => { onChange(t.id); setIsOpen(false); }} />
                  <p className="text-xs text-muted-foreground text-center leading-tight">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ── ColorPicker ───────────────────────────────────────────────────────────────
const COLORS = [
  { name: 'Royal Blue', value: '#3B82F6' }, { name: 'Violet', value: '#7C3AED' },
  { name: 'Emerald', value: '#10B981' }, { name: 'Rose', value: '#E11D48' },
  { name: 'Amber', value: '#D97706' }, { name: 'Teal', value: '#0D9488' },
  { name: 'Sky', value: '#0EA5E9' }, { name: 'Purple', value: '#9333EA' },
  { name: 'Crimson', value: '#DC2626' }, { name: 'Charcoal', value: '#374151' },
];

export const ColorPicker = ({ selectedColor, onChange }: { selectedColor: string; onChange: (color: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [custom, setCustom] = useState(selectedColor);
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1.5 text-sm text-primary bg-primary/10 hover:bg-primary/20 transition-all px-3 py-2 rounded-lg" title="Accent color">
        <Palette size={14} />
        <div className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: selectedColor }} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 z-20 bg-card rounded-xl border border-border shadow-xl p-4 w-56">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">Accent Color</p>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {COLORS.map((c) => (
                <button key={c.value} onClick={() => { onChange(c.value); setIsOpen(false); }} title={c.name} className={`w-9 h-9 rounded-lg border-2 transition-all hover:scale-110 ${selectedColor === c.value ? 'border-white scale-110 ring-2 ring-primary/50 shadow-md' : 'border-transparent hover:border-white/60'}`} style={{ backgroundColor: c.value }}>
                  {selectedColor === c.value && <Check className="m-auto h-4 w-4 text-white drop-shadow" />}
                </button>
              ))}
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Custom</p>
              <div className="flex items-center gap-2">
                <input type="color" value={custom} onChange={(e) => { setCustom(e.target.value); onChange(e.target.value); }} className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent p-0.5" />
                <input type="text" value={custom} onChange={(e) => { const v = e.target.value; setCustom(v); if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v); }} placeholder="#3B82F6" maxLength={7} className="flex-1 px-2 py-1.5 text-xs rounded-lg border border-border bg-secondary/50 text-foreground outline-none focus:ring-2 focus:ring-ring font-mono" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ── AutosaveStatusBadge ───────────────────────────────────────────────────────
const STATUS_CONFIG: Record<AutosaveStatus, { icon: React.ElementType; label: string; className: string; spin?: boolean } | null> = {
  idle:    null,
  pending: { icon: Clock, label: 'Unsaved changes', className: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  saving:  { icon: Loader2, label: 'Saving…', className: 'text-blue-500 bg-blue-500/10 border-blue-500/20', spin: true },
  saved:   { icon: Check, label: 'Saved', className: 'text-green-500 bg-green-500/10 border-green-500/20' },
  error:   { icon: AlertCircle, label: 'Save failed', className: 'text-destructive bg-destructive/10 border-destructive/20' },
};

export const AutosaveStatusBadge = ({ status }: { status: AutosaveStatus }) => {
  const item = STATUS_CONFIG[status];
  if (!item) return null;
  const Icon = item.icon;
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all duration-300 ${item.className}`}>
      <Icon className={`h-3 w-3 ${item.spin ? 'animate-spin' : ''}`} />
      {item.label}
    </div>
  );
};
