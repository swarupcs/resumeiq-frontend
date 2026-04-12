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
  Copy,
  Check,
} from 'lucide-react';
import ResumePreview from '@/components/builder/ResumePreview';
import { Button } from '@/components/ui/button';
import {
  usePublicResumeById,
  useExportResumePdfPublic,
} from '@/hooks/resume/index';
import { toast } from 'sonner';

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
