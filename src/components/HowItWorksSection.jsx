import {
  ArrowRight,
  FileText,
  Sparkles,
  Upload,
  CheckCircle2,
} from 'lucide-react';

// Phase 4 — Feature 3: Remove false LinkedIn import promise.
// The previous copy said "Upload your existing resume or LinkedIn profile"
// implying LinkedIn import works — it doesn't exist yet (it's Phase 5).
// Updated to honest copy: "Upload your existing resume or start from scratch".

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Import Your Details',
    description:
      'Upload your existing resume as a PDF to auto-fill your details, or start fresh by entering your information manually.',
    color: 'from-blue-500 to-cyan-400',
    dotColor: 'bg-blue-500',
  },
  {
    icon: Sparkles,
    number: '02',
    title: 'AI Enhancement',
    description:
      'Our AI analyses your experience and crafts compelling, ATS-optimised content — including job descriptions and your professional summary.',
    color: 'from-primary to-purple-600',
    dotColor: 'bg-primary',
  },
  {
    icon: FileText,
    number: '03',
    title: 'Download & Apply',
    description:
      'Choose your template, pick an accent colour, make final tweaks, and download your polished resume in PDF format.',
    color: 'from-emerald-500 to-teal-400',
    dotColor: 'bg-emerald-500',
  },
];

const HowItWorksSection = () => {
  return (
    <section id='how-it-works' className='relative py-24 sm:py-32 overflow-hidden'>
      <div className='absolute inset-0 bg-secondary/20' />
      <div className='absolute inset-0 bg-mesh opacity-20' />

      <div className='container relative mx-auto px-4'>
        {/* Section header */}
        <div className='text-center mb-20'>
          <div
            className='inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 border'
            style={{
              background: 'oklch(from var(--primary) l c h / 0.06)',
              borderColor: 'oklch(from var(--primary) l c h / 0.2)',
            }}
          >
            <CheckCircle2 className='h-3.5 w-3.5 text-primary' />
            <span className='text-sm text-primary font-medium font-display'>
              Simple Process
            </span>
          </div>

          <h2 className='font-display text-4xl sm:text-5xl md:text-6xl font-black mb-5 leading-tight'>
            Create Your Resume in
            <br />
            <span className='text-gradient'>Three Simple Steps</span>
          </h2>
          <p className='max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed'>
            No more staring at a blank page. Our streamlined process makes
            resume creation effortless.
          </p>
        </div>

        {/* Steps */}
        <div className='relative max-w-5xl mx-auto'>
          {/* Connecting line (desktop) */}
          <div className='absolute top-[3.75rem] left-[calc(16.67%+2.5rem)] right-[calc(16.67%+2.5rem)] h-px hidden lg:block overflow-hidden'>
            <div className='h-full w-full bg-gradient-to-r from-blue-500 via-primary to-emerald-500 opacity-30' />
            <div
              className='absolute inset-0 bg-gradient-to-r from-blue-500 via-primary to-emerald-500 opacity-60 animate-pulse'
              style={{
                maskImage:
                  'linear-gradient(90deg, transparent, white 20%, white 80%, transparent)',
              }}
            />
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8'>
            {steps.map((step, index) => (
              <div key={step.number} className='relative group'>
                {index < steps.length - 1 && (
                  <div className='hidden lg:flex absolute top-[3rem] -right-4 z-10 w-8 h-8 items-center justify-center rounded-full bg-card border border-border shadow-sm'>
                    <ArrowRight className='h-3.5 w-3.5 text-muted-foreground' />
                  </div>
                )}

                <div className='text-center'>
                  <div className='relative inline-flex items-center justify-center mb-6'>
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-150`}
                    />
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

                  {index < steps.length - 1 && (
                    <div className='lg:hidden flex justify-center mt-8'>
                      <div className='w-px h-8 bg-gradient-to-b from-border to-transparent' />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
