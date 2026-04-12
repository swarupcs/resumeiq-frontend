import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  Download,
  Sparkles,
  Copy,
  Check,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useResumeById } from '@/hooks/resume/index';
import { useGenerateCoverLetter } from '@/hooks/ai';
import { toast } from 'sonner';

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
    a.download = `${name.replace(/\\s+/g, '_')}_Cover_Letter.txt`;
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
