import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

// Phase 4 — Feature 3: Audited for LinkedIn import copy.
// No LinkedIn mentions found in this component — copy is already honest.
// The feature pill list updated: removed any implicit LinkedIn reference,
// confirmed "7 templates" is accurate.

const CTASection = () => {
  return (
    <section className='relative py-24 sm:py-32 overflow-hidden'>
      <div className='absolute inset-0 bg-mesh opacity-20' />

      <div className='container relative mx-auto px-4'>
        <div className='max-w-4xl mx-auto'>
          <div
            className='relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center border border-border'
            style={{ background: 'var(--card)' }}
          >
            {/* Top gradient accent line */}
            <div
              className='absolute top-0 left-0 right-0 h-px'
              style={{
                background:
                  'linear-gradient(90deg, transparent, var(--primary), oklch(0.65 0.28 305), transparent)',
              }}
            />

            {/* Subtle inner glow */}
            <div
              className='absolute inset-0 opacity-30'
              style={{
                background:
                  'radial-gradient(ellipse at 50% 0%, oklch(from var(--primary) l c h / 0.12), transparent 60%)',
              }}
            />

            {/* Floating orbs */}
            <div className='absolute top-8 left-12 w-32 h-32 rounded-full bg-primary/5 blur-2xl animate-float pointer-events-none' />
            <div className='absolute bottom-8 right-12 w-40 h-40 rounded-full bg-purple-600/5 blur-2xl animate-float-slow pointer-events-none' />

            {/* Grid pattern */}
            <div
              className='absolute inset-0 opacity-[0.02]'
              style={{
                backgroundImage:
                  'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            <div className='relative z-10'>
              <div
                className='inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border'
                style={{
                  background: 'oklch(from var(--primary) l c h / 0.10)',
                  borderColor: 'oklch(from var(--primary) l c h / 0.30)',
                }}
              >
                <Sparkles className='h-3.5 w-3.5 text-primary' />
                <span className='text-sm text-primary font-medium font-display'>
                  Start Free Today — No Credit Card
                </span>
              </div>

              <h2 className='font-display text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight'>
                Ready to Build Your
                <br />
                <span className='text-gradient'>Winning Resume?</span>
              </h2>

              <p className='text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed'>
                Join 50,000+ professionals who have transformed their job search
                with AI-powered resumes. Takes less than 2 minutes.
              </p>

              <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                <Link to='/dashboard'>
                  <button
                    className='group relative flex items-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-base text-white overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl'
                    style={{
                      background:
                        'linear-gradient(135deg, var(--primary), oklch(0.65 0.28 305))',
                      boxShadow: '0 6px 32px oklch(0.72 0.22 280 / 0.45)',
                    }}
                  >
                    <Zap className='h-5 w-5 transition-transform group-hover:rotate-12' />
                    Create Your Resume Free
                    <ArrowRight className='h-5 w-5 transition-transform group-hover:translate-x-1' />
                    <div className='absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity' />
                  </button>
                </Link>

                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Sparkles className='h-4 w-4 text-primary' />
                  Ready in under 2 minutes
                </div>
              </div>

              {/* Feature pills — honest, no LinkedIn import claim */}
              <div className='flex flex-wrap items-center justify-center gap-2 mt-8'>
                {[
                  '✓ Free forever plan',
                  '✓ No credit card',
                  '✓ Export to PDF',
                  '✓ 7 templates',
                  '✓ AI-powered writing',
                  '✓ Upload existing resume',
                ].map((item) => (
                  <span
                    key={item}
                    className='text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-secondary/60 border border-border'
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
