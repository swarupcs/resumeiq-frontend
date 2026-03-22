import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, Loader2, Copy, Check,
  Download, FileText, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { useGenerateCoverLetter } from '@/hooks/ai/useGenerateCoverLetter.js';
import { useResumeById } from '@/hooks/resume/useResumeById.js';

// Phase 5 — Feature 4: Cover letter generator page.
// Route: /app/cover-letter/:resumeId
// User pastes a job description → AI generates a tailored cover letter
// using the resume data as context. Output can be copied or downloaded as .txt.

const CoverLetter = () => {
  const { resumeId } = useParams();
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter]       = useState('');
  const [copied, setCopied]                 = useState(false);

  const { data: fetchedResume } = useResumeById(resumeId);
  const resume = fetchedResume?.data?.resume;

  const { mutate: generate, isPending } = useGenerateCoverLetter();

  const handleGenerate = () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 30) {
      toast.error('Please paste the full job description (at least 30 characters)');
      return;
    }
    generate(
      { resumeId, jobDescription },
      {
        onSuccess: (data) => {
          setCoverLetter(data.data.coverLetter);
          toast.success('Cover letter generated!');
        },
      }
    );
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const name = resume?.personal_info?.full_name ?? 'Cover_Letter';
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
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
          <ArrowLeft className='size-4' /> Back to Builder
        </Link>

        {/* Header */}
        <div className='mb-8'>
          <h1 className='font-display text-2xl font-black text-foreground flex items-center gap-2'>
            <FileText className='h-6 w-6 text-primary' />
            Cover Letter Generator
          </h1>
          {resume && (
            <p className='text-sm text-muted-foreground mt-1'>
              Generating for:{' '}
              <span className='font-medium text-foreground'>{resume.title}</span>
            </p>
          )}
        </div>

        <div className='grid lg:grid-cols-2 gap-6'>
          {/* Left — Job description input */}
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
              placeholder='Paste the full job description here…&#10;&#10;Include the job title, responsibilities, requirements, and company info for the best results.'
              className='w-full px-4 py-3 text-sm rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition-colors resize-none'
            />
            <Button
              onClick={handleGenerate}
              disabled={isPending || !jobDescription.trim()}
              className='w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white'
            >
              {isPending ? (
                <><Loader2 className='size-4 mr-2 animate-spin' /> Generating…</>
              ) : (
                <><Sparkles className='size-4 mr-2' /> Generate Cover Letter</>
              )}
            </Button>
          </div>

          {/* Right — Generated cover letter */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-semibold text-foreground'>
                Generated Cover Letter
              </label>
              {coverLetter && (
                <div className='flex items-center gap-2'>
                  <Button
                    variant='ghost' size='sm'
                    onClick={handleGenerate}
                    disabled={isPending}
                    className='h-7 px-2 text-xs text-muted-foreground hover:text-foreground'
                  >
                    <RefreshCw className='h-3 w-3 mr-1' /> Regenerate
                  </Button>
                  <Button
                    variant='ghost' size='sm'
                    onClick={handleCopy}
                    className='h-7 px-2 text-xs text-muted-foreground hover:text-foreground'
                  >
                    {copied
                      ? <><Check className='h-3 w-3 mr-1 text-green-500' /> Copied</>
                      : <><Copy className='h-3 w-3 mr-1' /> Copy</>
                    }
                  </Button>
                  <Button
                    variant='ghost' size='sm'
                    onClick={handleDownload}
                    className='h-7 px-2 text-xs text-muted-foreground hover:text-foreground'
                  >
                    <Download className='h-3 w-3 mr-1' /> Download
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
              <div className='h-[calc(16*1.5rem+1.5rem)] flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20 text-center p-8 gap-3'>
                <FileText className='h-12 w-12 text-muted-foreground/30' />
                <p className='text-sm text-muted-foreground'>
                  Paste a job description and click Generate
                </p>
                <p className='text-xs text-muted-foreground/60'>
                  The AI uses your resume data to personalise the letter
                </p>
              </div>
            )}

            {coverLetter && (
              <div className='flex gap-3'>
                <Button
                  onClick={handleCopy}
                  variant='outline'
                  className='flex-1'
                >
                  {copied
                    ? <><Check className='size-4 mr-2 text-green-500' /> Copied!</>
                    : <><Copy className='size-4 mr-2' /> Copy to Clipboard</>
                  }
                </Button>
                <Button onClick={handleDownload} variant='outline' className='flex-1'>
                  <Download className='size-4 mr-2' /> Download .txt
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetter;
