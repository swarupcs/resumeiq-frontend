import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  Sparkles,
  Star,
  Brain,
  Target,
  Palette,
  Wand2,
  FileCheck,
  CheckCircle2,
  Upload,
  FileText,
} from 'lucide-react';

// ── HeroSection ───────────────────────────────────────────────────────────────
export const HeroSection = () => (
  <section className='relative min-h-screen flex items-center justify-center pt-16 overflow-hidden'>
    <div className='absolute inset-0 bg-mesh opacity-60' />
    <div className='absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float-slow pointer-events-none' />
    <div className='absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-600/8 blur-3xl animate-float pointer-events-none' />
    <div className='container relative mx-auto px-4 py-20 text-center'>
      <div className='inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-8 border border-primary/25 bg-primary/8 animate-fade-up'>
        <span className='flex h-2 w-2 rounded-full bg-primary animate-pulse' />
        <Zap className='h-3.5 w-3.5 text-primary' />
        <span className='text-sm text-primary font-medium font-display tracking-wide'>
          Powered by Advanced AI
        </span>
      </div>
      <h1 className='font-display text-5xl sm:text-7xl md:text-8xl font-black leading-[0.95] mb-6 animate-fade-up tracking-tight'>
        Build Your
        <br />
        <span className='text-gradient'>Perfect Resume</span>
        <br />
        <span className='text-foreground/80'>In Minutes.</span>
      </h1>
      <p className='max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10 animate-fade-up leading-relaxed'>
        Let AI craft a professional, ATS-optimized resume tailored to your dream
        job. Stand out and land more interviews.
      </p>
      <div className='flex flex-col sm:flex-row items-center justify-center gap-3 mb-20 animate-fade-up'>
        <Link to='/dashboard'>
          <button
            className='group relative flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-display font-semibold text-base text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl'
            style={{
              background:
                'linear-gradient(135deg, hsl(var(--primary)), hsl(271 76% 53%))',
              boxShadow: '0 4px 24px hsl(var(--primary) / 0.4)',
            }}
          >
            <Zap className='h-4 w-4 transition-transform group-hover:rotate-12' />
            Create Your Resume Free
            <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
          </button>
        </Link>
      </div>
      <div className='flex flex-wrap items-center justify-center gap-8 sm:gap-16 animate-fade-up mb-16'>
        {[
          { value: '50K+', label: 'Resumes Created' },
          { value: '94%', label: 'Success Rate' },
          { value: '< 2 Min', label: 'Average Time' },
        ].map((stat) => (
          <div key={stat.label} className='text-center'>
            <div className='font-display text-3xl sm:text-4xl font-black text-gradient'>
              {stat.value}
            </div>
            <div className='text-sm text-muted-foreground mt-1 font-medium'>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── FeaturesSection ───────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: 'AI-Powered Writing',
    description:
      'Our AI analyzes job descriptions and crafts compelling bullet points that highlight your achievements.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Target,
    title: 'ATS Optimization',
    description:
      'Beat applicant tracking systems with keyword optimization and proper formatting.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Palette,
    title: 'Beautiful Templates',
    description:
      'Choose from 27+ professionally designed templates that make your resume stand out.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Wand2,
    title: 'One-Click Generation',
    description:
      'Enter your details once and generate multiple versions tailored to different roles.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: FileCheck,
    title: 'Real-Time Feedback',
    description:
      "Get instant suggestions to improve your resume's impact and readability.",
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Create a professional resume in under 2 minutes with our streamlined process.',
    gradient: 'from-primary to-indigo-500',
  },
];

export const FeaturesSection = () => (
  <section id='features' className='relative py-24 sm:py-32 overflow-hidden'>
    <div className='absolute inset-0 bg-mesh opacity-30' />
    <div className='container relative mx-auto px-4'>
      <div className='text-center mb-16'>
        <div className='inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 border border-primary/20 bg-primary/6'>
          <Zap className='h-3.5 w-3.5 text-primary' />
          <span className='text-sm text-primary font-medium font-display'>
            Powerful Features
          </span>
        </div>
        <h2 className='font-display text-4xl sm:text-6xl font-black mb-5 leading-tight'>
          Everything You Need to
          <br />
          <span className='text-gradient'>Land Your Dream Job</span>
        </h2>
        <p className='max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed'>
          Powerful features designed to help you create the perfect resume and
          stand out from other candidates.
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {features.map((f) => (
          <div
            key={f.title}
            className='group relative rounded-2xl border border-border bg-card p-6 hover:border-transparent transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl shine overflow-hidden cursor-default'
          >
            <div
              className={`inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br ${f.gradient} mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110`}
            >
              <f.icon className='h-6 w-6 text-white' />
            </div>
            <h3 className='font-display text-lg font-bold text-foreground mb-2.5'>
              {f.title}
            </h3>
            <p className='text-muted-foreground leading-relaxed text-sm'>
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── HowItWorksSection ─────────────────────────────────────────────────────────
const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Import Your Details',
    description:
      'Upload your existing resume as a PDF or start fresh by entering your information manually.',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Sparkles,
    number: '02',
    title: 'AI Enhancement',
    description:
      'Our AI analyses your experience and crafts compelling, ATS-optimised content.',
    color: 'from-primary to-purple-600',
  },
  {
    icon: FileText,
    number: '03',
    title: 'Download & Apply',
    description:
      'Choose your template, pick an accent colour, and download your polished resume as PDF.',
    color: 'from-emerald-500 to-teal-400',
  },
];

export const HowItWorksSection = () => (
  <section
    id='how-it-works'
    className='relative py-24 sm:py-32 overflow-hidden'
  >
    <div className='absolute inset-0 bg-secondary/20' />
    <div className='container relative mx-auto px-4'>
      <div className='text-center mb-20'>
        <div className='inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 border border-primary/20 bg-primary/6'>
          <CheckCircle2 className='h-3.5 w-3.5 text-primary' />
          <span className='text-sm text-primary font-medium font-display'>
            Simple Process
          </span>
        </div>
        <h2 className='font-display text-4xl sm:text-6xl font-black mb-5 leading-tight'>
          Create Your Resume in
          <br />
          <span className='text-gradient'>Three Simple Steps</span>
        </h2>
        <p className='max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed'>
          No more staring at a blank page. Our streamlined process makes resume
          creation effortless.
        </p>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 max-w-5xl mx-auto'>
        {steps.map((step) => (
          <div key={step.number} className='group text-center'>
            <div className='relative inline-flex items-center justify-center mb-6'>
              <div
                className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:-translate-y-1`}
              >
                <step.icon className='h-8 w-8 text-white' />
              </div>
              <span className='absolute -top-3 -right-3 flex items-center justify-center w-8 h-8 rounded-xl bg-card border-2 border-border font-display font-black text-xs text-foreground shadow-sm'>
                {step.number}
              </span>
            </div>
            <h3 className='font-display text-xl font-bold text-foreground mb-3'>
              {step.title}
            </h3>
            <p className='text-muted-foreground leading-relaxed text-sm max-w-xs mx-auto'>
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── CTASection ────────────────────────────────────────────────────────────────
export const CTASection = () => (
  <section className='relative py-24 sm:py-32 overflow-hidden'>
    <div className='container relative mx-auto px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center border border-border bg-card'>
          <div
            className='absolute top-0 left-0 right-0 h-px'
            style={{
              background:
                'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
            }}
          />
          <div className='relative z-10'>
            <div className='inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border border-primary/30 bg-primary/10'>
              <Sparkles className='h-3.5 w-3.5 text-primary' />
              <span className='text-sm text-primary font-medium font-display'>
                Start Free Today — No Credit Card
              </span>
            </div>
            <h2 className='font-display text-4xl sm:text-6xl font-black mb-6 leading-tight'>
              Ready to Build Your
              <br />
              <span className='text-gradient'>Winning Resume?</span>
            </h2>
            <p className='text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed'>
              Join 50,000+ professionals who have transformed their job search
              with AI-powered resumes.
            </p>
            <Link to='/dashboard'>
              <button
                className='group flex items-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-base text-white mx-auto transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl'
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--primary)), hsl(271 76% 53%))',
                  boxShadow: '0 6px 32px hsl(var(--primary) / 0.45)',
                }}
              >
                <Zap className='h-5 w-5 transition-transform group-hover:rotate-12' />
                Create Your Resume Free
                <ArrowRight className='h-5 w-5 transition-transform group-hover:translate-x-1' />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);
