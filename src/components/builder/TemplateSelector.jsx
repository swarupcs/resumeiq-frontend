import { Check, Layout, X } from 'lucide-react';
import { useState } from 'react';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import MinimalImageTemplate from './templates/MinimalImageTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';

// Phase 4 — Feature 1: Template thumbnails.
// Each template is rendered live at a small scale using the actual template
// component, so the user sees a real preview rather than reading a description.
// We use a fixed sample resume so every thumbnail looks populated and consistent.

const SAMPLE_DATA = {
  personal_info: {
    full_name: 'Alex Johnson',
    profession: 'Product Designer',
    email: 'alex@example.com',
    phone: '+1 555 0100',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexj',
    website: 'alexj.design',
    image: '',
  },
  professional_summary:
    'Creative product designer with 5 years of experience crafting intuitive digital experiences for SaaS products.',
  experience: [
    {
      company: 'Stripe',
      position: 'Senior Product Designer',
      start_date: '2021-03',
      end_date: '',
      is_current: true,
      description: 'Led end-to-end design for the payments dashboard, improving conversion by 18%.',
    },
    {
      company: 'Figma',
      position: 'UI Designer',
      start_date: '2019-06',
      end_date: '2021-02',
      is_current: false,
      description: 'Designed core components for the design system used by 4M+ users.',
    },
  ],
  education: [
    {
      institution: 'Carnegie Mellon University',
      degree: 'B.S.',
      field: 'Human-Computer Interaction',
      graduation_date: '2019-05',
      gpa: '3.8',
    },
  ],
  project: [
    {
      name: 'Design System',
      type: 'Open Source',
      description: 'Built a scalable component library used by 200+ developers.',
    },
  ],
  skills: ['Figma', 'React', 'Prototyping', 'User Research', 'Design Systems'],
};

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    component: ClassicTemplate,
    description: 'Clean and professional',
  },
  {
    id: 'modern',
    name: 'Modern',
    component: ModernTemplate,
    description: 'Sidebar layout with color',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    component: MinimalTemplate,
    description: 'Ultra-clean typography',
  },
  {
    id: 'minimal-image',
    name: 'Minimal Image',
    component: MinimalImageTemplate,
    description: 'Minimal with photo',
  },
  {
    id: 'executive',
    name: 'Executive',
    component: ExecutiveTemplate,
    description: 'Bold header, timeline',
  },
  {
    id: 'creative',
    name: 'Creative',
    component: CreativeTemplate,
    description: 'Dynamic, eye-catching',
  },
  {
    id: 'professional',
    name: 'Professional',
    component: ProfessionalTemplate,
    description: 'Grid layout, accent line',
  },
];

// Scale factor: thumbnail width is 160px, resume is 816px wide
// So we scale to 160/816 ≈ 0.196 — rounded to 0.20 for a clean size
const THUMB_SCALE = 0.196;
const THUMB_WIDTH = 160;
const THUMB_HEIGHT = Math.round(THUMB_WIDTH * (11 / 8.5)); // letter ratio ≈ 207px

const TemplateThumbnail = ({ template, accentColor, isSelected, onClick }) => {
  const TemplateComponent = template.component;

  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg flex-shrink-0 ${
        isSelected
          ? 'border-primary shadow-md shadow-primary/20'
          : 'border-border hover:border-primary/50'
      }`}
      style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT }}
      title={template.name}
    >
      {/* Live template rendered at scale */}
      <div
        className='absolute top-0 left-0 origin-top-left pointer-events-none bg-white'
        style={{
          width: `${100 / THUMB_SCALE}%`,
          height: `${100 / THUMB_SCALE}%`,
          transform: `scale(${THUMB_SCALE})`,
        }}
      >
        <TemplateComponent data={SAMPLE_DATA} accentColor={accentColor} />
      </div>

      {/* Selected checkmark */}
      {isSelected && (
        <div className='absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm'>
          <Check className='h-3 w-3 text-white' />
        </div>
      )}

      {/* Name label at bottom */}
      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 z-10'>
        <p className='text-white text-xs font-medium truncate leading-tight'>
          {template.name}
        </p>
      </div>
    </button>
  );
};

const TemplateSelector = ({ selectedTemplate, onChange, accentColor = '#3B82F6' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selected = TEMPLATES.find((t) => t.id === selectedTemplate) ?? TEMPLATES[0];

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-1.5 text-sm text-primary bg-primary/10 hover:bg-primary/20 transition-all px-3 py-2 rounded-lg'
      >
        <Layout size={14} />
        <span className='max-sm:hidden'>Template</span>
        <span className='text-xs text-muted-foreground hidden sm:inline'>
          — {selected.name}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className='fixed inset-0 z-10' onClick={() => setIsOpen(false)} />

          {/* Panel */}
          <div className='absolute top-full left-0 mt-2 z-20 bg-popover rounded-xl border border-border shadow-xl p-4 w-[380px]'>
            {/* Header */}
            <div className='flex items-center justify-between mb-3'>
              <p className='text-sm font-semibold text-foreground'>Choose a template</p>
              <button
                onClick={() => setIsOpen(false)}
                className='p-1 rounded-lg hover:bg-secondary text-muted-foreground transition-colors'
              >
                <X className='h-4 w-4' />
              </button>
            </div>

            {/* Thumbnail grid */}
            <div className='grid grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-0.5'>
              {TEMPLATES.map((template) => (
                <div key={template.id} className='flex flex-col items-center gap-1.5'>
                  <TemplateThumbnail
                    template={template}
                    accentColor={accentColor}
                    isSelected={selectedTemplate === template.id}
                    onClick={() => {
                      onChange(template.id);
                      setIsOpen(false);
                    }}
                  />
                  <p className='text-xs text-muted-foreground text-center leading-tight'>
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateSelector;
