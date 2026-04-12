import { useState, useEffect } from 'react';
import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  FileX,
  Download,
  Share2,
  Sparkles,
  Copy,
  Check,
  FileText,
  RefreshCw,
} from 'lucide-react';
import ResumePreview from '@/components/builder/ResumePreview';
import { Button } from '@/components/ui/button';
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CTASection,
} from '@/components/LandingSections';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  usePublicResumeById,
  useExportResumePdfPublic,
} from '@/hooks/resume/index';
import { useResumeById } from '@/hooks/resume/index';
import { useGenerateCoverLetter } from '@/hooks/ai';
import { toast } from 'sonner';

// ── LandingPage ───────────────────────────────────────────────────────────────
export const LandingPage = () => (
  <div className='min-h-screen bg-background'>
    <Navbar />
    <main>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </main>
    <Footer />
  </div>
);

// ── NotFoundPage ──────────────────────────────────────────────────────────────
export const NotFoundPage = () => (
  <div className='flex min-h-screen items-center justify-center bg-background'>
    <div className='text-center'>
      <h1 className='mb-4 text-4xl font-bold text-foreground'>404</h1>
      <p className='mb-4 text-xl text-muted-foreground'>Oops! Page not found</p>
      <a href='/' className='text-primary underline hover:text-primary/90'>
        Return to Home
      </a>
    </div>
  </div>
);

// ── Preview ───────────────────────────────────────────────────────────────────
export const Preview = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const {
    data: response,
    isLoading,
    isError,
  } = usePublicResumeById(resumeId ?? '');
  const resumeData = response?.data?.resume ?? null;
  const { mutate: exportPdf, isPending: isDownloading } =
    useExportResumePdfPublic();

  const handleDownload = () =>
    exportPdf({
      resumeId: resumeId ?? '',
      fullName: resumeData?.personal_info?.full_name ?? 'Resume',
    });

  useEffect(() => {
    if (
      searchParams.get('download') === 'true' &&
      resumeData &&
      !isDownloading
    ) {
      setSearchParams({}, { replace: true });
      handleDownload();
    }
  }, [resumeData]);

  const shareUrl = `${window.location.origin}/preview/${resumeId}`;
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading)
    return (
      <div className='min-h-screen bg-muted/30 flex items-center justify-center'>
        <Loader2 className='h-10 w-10 animate-spin text-primary' />
      </div>
    );
  if (isError || !resumeData)
    return (
      <div className='min-h-screen bg-background flex flex-col items-center justify-center px-4'>
        <div className='text-center'>
          <FileX className='h-20 w-20 text-muted-foreground mx-auto mb-6' />
          <h1 className='text-4xl font-bold text-muted-foreground mb-4'>
            Resume Not Found
          </h1>
          <p className='text-muted-foreground mb-8 max-w-md'>
            This resume may be private or doesn't exist.
          </p>
          <Button asChild>
            <Link to='/'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Go to Home
            </Link>
          </Button>
        </div>
      </div>
    );

  return (
    <div className='min-h-screen bg-muted/30'>
      <div
        data-hide-on-export
        className='bg-background border-b border-border sticky top-0 z-20'
      >
        <div className='max-w-7xl mx-auto px-4 py-3'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-4 min-w-0'>
              <Link
                to='/'
                className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors shrink-0'
              >
                <ArrowLeft className='size-4' />
                <span className='hidden sm:inline'>Home</span>
              </Link>
              <div className='min-w-0'>
                <h1 className='font-semibold text-foreground truncate'>
                  {resumeData.personal_info?.full_name ?? resumeData.title}
                </h1>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <span className='px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'>
                    Public
                  </span>
                  <span>{resumeData.views?.toLocaleString() ?? 0} views</span>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleCopyLink}
                className='gap-2'
              >
                {copied ? (
                  <>
                    <Check className='size-4 text-green-500' />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className='size-4' />
                    Copy Link
                  </>
                )}
              </Button>
              <Button
                size='sm'
                onClick={handleDownload}
                disabled={isDownloading}
                className='gap-2'
              >
                {isDownloading ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  <Download className='size-4' />
                )}
                <span className='hidden sm:inline'>Download PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='py-10 px-4 flex justify-center'>
        <div data-resume-ready className='w-full max-w-[800px]'>
          <ResumePreview
            data={resumeData}
            template={resumeData.template}
            accentColor={resumeData.accent_color}
          />
        </div>
      </div>
      <div data-hide-on-export className='fixed bottom-6 right-6 z-10'>
        <Button onClick={() => navigate('/signup')} className='shadow-lg gap-2'>
          Create Your Resume
          <ArrowLeft className='size-4 rotate-180' />
        </Button>
      </div>
    </div>
  );
};

// ── Render (Puppeteer-only) ───────────────────────────────────────────────────
export const Render = () => {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);
  const resumeData =
    ((window as Record<string, unknown>).__RESUME_DATA__ as
      | Parameters<typeof ResumePreview>[0]['data']
      | null) ?? null;
  if (!resumeData)
    return (
      <div style={{ padding: 40, fontFamily: 'sans-serif', color: '#666' }}>
        No resume data provided.
      </div>
    );
  return (
    <div
      data-resume-ready
      style={{ background: 'white', margin: 0, padding: 0 }}
    >
      <ResumePreview
        data={resumeData}
        template={(resumeData as { template?: string }).template ?? 'classic'}
        accentColor={
          (resumeData as { accent_color?: string }).accent_color ?? '#3B82F6'
        }
      />
    </div>
  );
};

// ── CoverLetter ───────────────────────────────────────────────────────────────
export const CoverLetter = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState(false);
  const { data: fetchedResume } = useResumeById(resumeId ?? '');
  const resume = fetchedResume?.data?.resume;
  const { mutate: generate, isPending } = useGenerateCoverLetter();

  const handleGenerate = () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 30) {
      toast.error(
        'Please paste the full job description (at least 30 characters)',
      );
      return;
    }
    generate(
      { resumeId: resumeId ?? '', jobDescription },
      {
        onSuccess: (data) => {
          if (data.data?.coverLetter) {
            setCoverLetter(data.data.coverLetter);
            toast.success('Cover letter generated!');
          }
        },
      },
    );
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const name = resume?.personal_info?.full_name ?? 'Cover_Letter';
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}_Cover_Letter.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <div className='max-w-5xl mx-auto px-4 py-6 mt-16'>
        <Link
          to={`/app/builder/${resumeId}`}
          className='inline-flex gap-2 items-center text-muted-foreground hover:text-foreground transition-colors mb-6'
        >
          <ArrowLeft className='size-4' />
          Back to Builder
        </Link>
        <div className='mb-8'>
          <h1 className='font-display text-2xl font-black text-foreground flex items-center gap-2'>
            <FileText className='h-6 w-6 text-primary' />
            Cover Letter Generator
          </h1>
          {resume && (
            <p className='text-sm text-muted-foreground mt-1'>
              Generating for:{' '}
              <span className='font-medium text-foreground'>
                {resume.title}
              </span>
            </p>
          )}
        </div>
        <div className='grid lg:grid-cols-2 gap-6'>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-semibold text-foreground'>
                Job Description
              </label>
              <span className='text-xs text-muted-foreground'>
                {jobDescription.length} chars
              </span>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={16}
              placeholder='Paste the full job description here…'
              className='w-full px-4 py-3 text-sm rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition-colors resize-none'
            />
            <Button
              onClick={handleGenerate}
              disabled={isPending || !jobDescription.trim()}
              className='w-full bg-gradient-to-r from-primary to-purple-600 text-white'
            >
              {isPending ? (
                <>
                  <Loader2 className='size-4 mr-2 animate-spin' />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className='size-4 mr-2' />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </div>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-semibold text-foreground'>
                Generated Cover Letter
              </label>
              {coverLetter && (
                <div className='flex items-center gap-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleGenerate}
                    disabled={isPending}
                    className='h-7 px-2 text-xs text-muted-foreground'
                  >
                    <RefreshCw className='h-3 w-3 mr-1' />
                    Regenerate
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleCopy}
                    className='h-7 px-2 text-xs'
                  >
                    {copied ? (
                      <>
                        <Check className='h-3 w-3 mr-1 text-green-500' />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className='h-3 w-3 mr-1' />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleDownload}
                    className='h-7 px-2 text-xs text-muted-foreground'
                  >
                    <Download className='h-3 w-3 mr-1' />
                    Download
                  </Button>
                </div>
              )}
            </div>
            {coverLetter ? (
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={16}
                className='w-full px-4 py-3 text-sm rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition-colors resize-none leading-relaxed'
              />
            ) : (
              <div className='h-64 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20 text-center p-8 gap-3'>
                <FileText className='h-12 w-12 text-muted-foreground/30' />
                <p className='text-sm text-muted-foreground'>
                  Paste a job description and click Generate
                </p>
                <p className='text-xs text-muted-foreground/60'>
                  The AI uses your resume data to personalise the letter
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
