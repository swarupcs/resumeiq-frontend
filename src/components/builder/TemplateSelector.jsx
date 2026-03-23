import { Check, Layout, X } from 'lucide-react';
import { useState } from 'react';

// Existing 7 templates
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import MinimalImageTemplate from './templates/MinimalImageTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';

// 20 new templates
import CompactTemplate from './templates/CompactTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import BoldTemplate from './templates/BoldTemplate';
import TimelineTemplate from './templates/TimelineTemplate';
import SidebarDarkTemplate from './templates/SidebarDarkTemplate';
import {
  TwoColumnTemplate, CardTemplate, MonochromeTemplate,
  TechTemplate, InfographicTemplate,
} from './templates/Templates6to10';
import {
  NewspaperTemplate, GradientTemplate, AcademicTemplate,
  StartupTemplate, CompactSidebarTemplate,
} from './templates/Templates11to15';
import {
  BoxedHeaderTemplate, UnderlineTemplate, SplitColorTemplate,
  MinimalistTemplate, PortfolioTemplate,
} from './templates/Templates16to20';

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
    {
      name: 'Analytics Dashboard',
      type: 'Client Work',
      description: 'Redesigned the analytics UI, reducing time-on-task by 30%.',
    },
  ],
  skills: ['Figma', 'React', 'Prototyping', 'User Research', 'Design Systems', 'TypeScript'],
};

export const TEMPLATES = [
  // Original 7
  { id: 'classic',       name: 'Classic',         component: ClassicTemplate,        description: 'Clean & traditional' },
  { id: 'modern',        name: 'Modern',           component: ModernTemplate,         description: 'Sidebar with color' },
  { id: 'minimal',       name: 'Minimal',          component: MinimalTemplate,        description: 'Ultra-clean type' },
  { id: 'minimal-image', name: 'Minimal Image',    component: MinimalImageTemplate,   description: 'Minimal with photo' },
  { id: 'executive',     name: 'Executive',        component: ExecutiveTemplate,      description: 'Bold header, timeline' },
  { id: 'creative',      name: 'Creative',         component: CreativeTemplate,       description: 'Dynamic, eye-catching' },
  { id: 'professional',  name: 'Professional',     component: ProfessionalTemplate,   description: 'Grid layout, accent' },

  // 20 new templates
  { id: 'compact',        name: 'Compact',         component: CompactTemplate,        description: '3-col, fits more' },
  { id: 'elegant',        name: 'Elegant',         component: ElegantTemplate,        description: 'Serif, whitespace' },
  { id: 'bold',           name: 'Bold',            component: BoldTemplate,           description: 'Large name, high contrast' },
  { id: 'timeline',       name: 'Timeline',        component: TimelineTemplate,       description: 'Career timeline spine' },
  { id: 'sidebar-dark',   name: 'Sidebar Dark',    component: SidebarDarkTemplate,    description: 'Dark sidebar, white body' },
  { id: 'two-column',     name: 'Two Column',      component: TwoColumnTemplate,      description: 'Symmetric 50/50 split' },
  { id: 'card',           name: 'Card',            component: CardTemplate,           description: 'Each section in a card' },
  { id: 'monochrome',     name: 'Monochrome',      component: MonochromeTemplate,     description: 'Pure B&W, stark' },
  { id: 'tech',           name: 'Tech / Terminal', component: TechTemplate,           description: 'Terminal code aesthetic' },
  { id: 'infographic',    name: 'Infographic',     component: InfographicTemplate,    description: 'Skill bars, stat counters' },
  { id: 'newspaper',      name: 'Newspaper',       component: NewspaperTemplate,      description: 'Multi-col masthead' },
  { id: 'gradient',       name: 'Gradient',        component: GradientTemplate,       description: 'Gradient header banner' },
  { id: 'academic',       name: 'Academic / CV',   component: AcademicTemplate,       description: 'CV-style, formal, dense' },
  { id: 'startup',        name: 'Startup',         component: StartupTemplate,        description: 'Pill tags, emoji icons' },
  { id: 'compact-sidebar',name: 'Compact Sidebar', component: CompactSidebarTemplate, description: 'Narrow left sidebar' },
  { id: 'boxed-header',   name: 'Boxed Header',    component: BoxedHeaderTemplate,    description: 'Full-width name box' },
  { id: 'underline',      name: 'Underline',       component: UnderlineTemplate,      description: 'Thick underline accents' },
  { id: 'split-color',    name: 'Split Color',     component: SplitColorTemplate,     description: 'Half accent, half white' },
  { id: 'minimalist',     name: 'Minimalist',      component: MinimalistTemplate,     description: 'Near-zero decoration' },
  { id: 'portfolio',      name: 'Portfolio',       component: PortfolioTemplate,      description: 'Projects shown first' },
];

// Scale: thumbnail width 160px, resume 816px → 0.196
const THUMB_SCALE  = 0.196;
const THUMB_WIDTH  = 160;
const THUMB_HEIGHT = Math.round(THUMB_WIDTH * (11 / 8.5));

const TemplateThumbnail = ({ template, accentColor, isSelected, onClick }) => {
  const TemplateComponent = template.component;
  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg flex-shrink-0 ${
        isSelected ? 'border-primary shadow-md shadow-primary/20' : 'border-border hover:border-primary/50'
      }`}
      style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT }}
      title={template.name}
    >
      <div
        className='absolute top-0 left-0 origin-top-left pointer-events-none bg-white'
        style={{ width: `${100 / THUMB_SCALE}%`, height: `${100 / THUMB_SCALE}%`, transform: `scale(${THUMB_SCALE})` }}
      >
        <TemplateComponent data={SAMPLE_DATA} accentColor={accentColor} />
      </div>
      {isSelected && (
        <div className='absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm'>
          <Check className='h-3 w-3 text-white' />
        </div>
      )}
      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 z-10'>
        <p className='text-white text-xs font-medium truncate leading-tight'>{template.name}</p>
      </div>
    </button>
  );
};

const TemplateSelector = ({ selectedTemplate, onChange, accentColor = '#3B82F6' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = TEMPLATES.find((t) => t.id === selectedTemplate) ?? TEMPLATES[0];
  const filtered = TEMPLATES.filter(
    (t) =>
      search === '' ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-1.5 text-sm text-primary bg-primary/10 hover:bg-primary/20 transition-all px-3 py-2 rounded-lg'
      >
        <Layout size={14} />
        <span className='max-sm:hidden'>Template</span>
        <span className='text-xs text-muted-foreground hidden sm:inline'>— {selected.name}</span>
      </button>

      {isOpen && (
        <>
          <div className='fixed inset-0 z-10' onClick={() => setIsOpen(false)} />
          <div className='absolute top-full left-0 mt-2 z-20 bg-popover rounded-xl border border-border shadow-xl p-4 w-[520px]'>
            <div className='flex items-center justify-between mb-3'>
              <p className='text-sm font-semibold text-foreground'>
                Choose a template
                <span className='ml-2 text-xs text-muted-foreground font-normal'>({TEMPLATES.length} total)</span>
              </p>
              <button onClick={() => setIsOpen(false)} className='p-1 rounded-lg hover:bg-secondary text-muted-foreground'>
                <X className='h-4 w-4' />
              </button>
            </div>

            {/* Search */}
            <input
              type='text'
              placeholder='Search templates…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-secondary/50 text-foreground outline-none focus:ring-2 focus:ring-ring mb-3'
            />

            <div className='grid grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-0.5'>
              {filtered.map((template) => (
                <div key={template.id} className='flex flex-col items-center gap-1.5'>
                  <TemplateThumbnail
                    template={template}
                    accentColor={accentColor}
                    isSelected={selectedTemplate === template.id}
                    onClick={() => { onChange(template.id); setIsOpen(false); }}
                  />
                  <p className='text-xs text-muted-foreground text-center leading-tight'>{template.description}</p>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className='col-span-3 text-center py-8 text-muted-foreground text-sm'>No templates match "{search}"</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateSelector;
