// ResumePreview.jsx
// Routes the template ID to the correct component.
// Also used by Puppeteer's /render route via window.__RESUME_DATA__.

// Existing 7
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import MinimalImageTemplate from './templates/MinimalImageTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';

// 20 new
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

const TEMPLATE_MAP = {
  // Original 7
  classic:        ClassicTemplate,
  modern:         ModernTemplate,
  minimal:        MinimalTemplate,
  'minimal-image': MinimalImageTemplate,
  executive:      ExecutiveTemplate,
  creative:       CreativeTemplate,
  professional:   ProfessionalTemplate,

  // New 20
  compact:         CompactTemplate,
  elegant:         ElegantTemplate,
  bold:            BoldTemplate,
  timeline:        TimelineTemplate,
  'sidebar-dark':  SidebarDarkTemplate,
  'two-column':    TwoColumnTemplate,
  card:            CardTemplate,
  monochrome:      MonochromeTemplate,
  tech:            TechTemplate,
  infographic:     InfographicTemplate,
  newspaper:       NewspaperTemplate,
  gradient:        GradientTemplate,
  academic:        AcademicTemplate,
  startup:         StartupTemplate,
  'compact-sidebar': CompactSidebarTemplate,
  'boxed-header':  BoxedHeaderTemplate,
  underline:       UnderlineTemplate,
  'split-color':   SplitColorTemplate,
  minimalist:      MinimalistTemplate,
  portfolio:       PortfolioTemplate,
};

const ResumePreview = ({ data, template = 'classic', accentColor = '#3B82F6' }) => {
  const TemplateComponent = TEMPLATE_MAP[template] ?? ClassicTemplate;

  return (
    <div
      className='bg-white shadow-lg rounded-lg overflow-hidden'
      style={{ width: '100%', minHeight: '297mm' }}
    >
      <TemplateComponent data={data} accentColor={accentColor} />
    </div>
  );
};

export default ResumePreview;
