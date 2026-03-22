import { useState } from 'react';
import {
  Target, Loader2, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Lightbulb, RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useATSAnalysis } from '@/hooks/ai/useATSAnalysis.js';

// ATS Score colour thresholds
const getScoreStyle = (score) => {
  if (score >= 80) return { color: '#10B981', label: 'Excellent', ring: '#10B981' };
  if (score >= 60) return { color: '#3B82F6', label: 'Good',      ring: '#3B82F6' };
  if (score >= 40) return { color: '#F59E0B', label: 'Fair',      ring: '#F59E0B' };
  return             { color: '#EF4444', label: 'Needs work', ring: '#EF4444' };
};

// SVG circular progress ring — same design as CompletenessScore
const ScoreRing = ({ score, color }) => {
  const radius       = 40;
  const circumference = 2 * Math.PI * radius;
  const offset        = circumference - (score / 100) * circumference;

  return (
    <svg width='104' height='104' viewBox='0 0 104 104'>
      <circle cx='52' cy='52' r={radius} fill='none'
        stroke='currentColor' strokeWidth='7' className='text-border' />
      <circle cx='52' cy='52' r={radius} fill='none'
        stroke={color} strokeWidth='7' strokeLinecap='round'
        strokeDasharray={circumference} strokeDashoffset={offset}
        transform='rotate(-90 52 52)'
        style={{ transition: 'stroke-dashoffset 0.7s ease' }}
      />
      <text x='52' y='47' textAnchor='middle' dominantBaseline='central'
        fontSize='20' fontWeight='700' fill={color}>{score}</text>
      <text x='52' y='66' textAnchor='middle' dominantBaseline='central'
        fontSize='10' fill='currentColor' className='fill-muted-foreground'>/ 100</text>
    </svg>
  );
};

// Keyword chip — green for matched, red for missing
const KeywordChip = ({ keyword, matched }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
    matched
      ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400'
      : 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400'
  }`}>
    {matched
      ? <CheckCircle2 className='h-2.5 w-2.5 shrink-0' />
      : <XCircle      className='h-2.5 w-2.5 shrink-0' />
    }
    {keyword}
  </span>
);

const ATSAnalysis = ({ resumeData }) => {
  const [expanded, setExpanded]         = useState(true);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis]         = useState(null);

  const { mutate: analyze, isPending } = useATSAnalysis();

  const handleAnalyze = () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 50) return;
    analyze(
      { resumeData, jobDescription },
      {
        onSuccess: (data) => setAnalysis(data.data.analysis),
      }
    );
  };

  const handleReset = () => {
    setAnalysis(null);
    setJobDescription('');
  };

  const scoreStyle = analysis ? getScoreStyle(analysis.score) : null;
  const charCount  = jobDescription.length;
  const isReady    = charCount >= 50;

  return (
    <div className='rounded-xl border border-border bg-card overflow-hidden'>
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className='w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/40 transition-colors'
      >
        <div className='flex items-center gap-2'>
          <Target className='h-4 w-4 text-primary' />
          <span className='text-sm font-semibold text-foreground'>ATS Score</span>
          {analysis && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
              analysis.score >= 80
                ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400'
                : analysis.score >= 60
                  ? 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400'
                  : analysis.score >= 40
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400'
                    : 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400'
            }`}>
              {analysis.score}/100
            </span>
          )}
        </div>
        {expanded
          ? <ChevronUp   className='h-4 w-4 text-muted-foreground' />
          : <ChevronDown className='h-4 w-4 text-muted-foreground' />
        }
      </button>

      {expanded && (
        <div className='px-4 pb-4 space-y-4'>

          {/* Input state — no analysis yet */}
          {!analysis ? (
            <>
              <p className='text-xs text-muted-foreground'>
                Paste a job description to get an ATS compatibility score, matched keywords, and specific suggestions to improve your resume.
              </p>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <label className='text-xs font-semibold text-foreground'>Job Description</label>
                  <span className={`text-xs ${isReady ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {charCount} chars {!isReady && `(need ${50 - charCount} more)`}
                  </span>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={7}
                  placeholder='Paste the full job description here — include requirements, responsibilities, and skills…'
                  className='w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-colors resize-none leading-relaxed'
                />
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={!isReady || isPending}
                className='w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white text-xs h-9'
              >
                {isPending
                  ? <><Loader2 className='h-3.5 w-3.5 mr-2 animate-spin' /> Analysing…</>
                  : <><Target  className='h-3.5 w-3.5 mr-2' /> Analyse ATS Score</>
                }
              </Button>
            </>
          ) : (
            /* Results state */
            <>
              {/* Score ring + summary */}
              <div className='flex items-center gap-4 p-3 rounded-xl bg-secondary/40 border border-border'>
                <ScoreRing score={analysis.score} color={scoreStyle.ring} />
                <div className='flex-1 min-w-0'>
                  <p className='text-base font-bold' style={{ color: scoreStyle.color }}>
                    {scoreStyle.label}
                  </p>
                  <p className='text-xs text-muted-foreground mt-0.5 leading-relaxed'>
                    {analysis.summary}
                  </p>

                  {/* Progress bar */}
                  <div className='mt-2 w-full bg-secondary rounded-full h-1.5'>
                    <div
                      className='h-1.5 rounded-full transition-all duration-700'
                      style={{ width: `${analysis.score}%`, backgroundColor: scoreStyle.ring }}
                    />
                  </div>
                </div>
              </div>

              {/* Matched keywords */}
              {analysis.matchedKeywords.length > 0 && (
                <div className='space-y-2'>
                  <div className='flex items-center gap-1.5'>
                    <CheckCircle2 className='h-3.5 w-3.5 text-green-500' />
                    <p className='text-xs font-semibold text-foreground'>
                      Matched keywords
                      <span className='ml-1 text-muted-foreground font-normal'>
                        ({analysis.matchedKeywords.length})
                      </span>
                    </p>
                  </div>
                  <div className='flex flex-wrap gap-1.5'>
                    {analysis.matchedKeywords.map((kw) => (
                      <KeywordChip key={kw} keyword={kw} matched={true} />
                    ))}
                  </div>
                </div>
              )}

              {/* Missing keywords */}
              {analysis.missingKeywords.length > 0 && (
                <div className='space-y-2'>
                  <div className='flex items-center gap-1.5'>
                    <XCircle className='h-3.5 w-3.5 text-red-500' />
                    <p className='text-xs font-semibold text-foreground'>
                      Missing keywords
                      <span className='ml-1 text-muted-foreground font-normal'>
                        ({analysis.missingKeywords.length})
                      </span>
                    </p>
                  </div>
                  <div className='flex flex-wrap gap-1.5'>
                    {analysis.missingKeywords.map((kw) => (
                      <KeywordChip key={kw} keyword={kw} matched={false} />
                    ))}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Add these keywords naturally to your skills, summary, or experience descriptions.
                  </p>
                </div>
              )}

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div className='space-y-2'>
                  <div className='flex items-center gap-1.5'>
                    <Lightbulb className='h-3.5 w-3.5 text-amber-500' />
                    <p className='text-xs font-semibold text-foreground'>Suggestions</p>
                  </div>
                  <div className='space-y-1.5'>
                    {analysis.suggestions.map((suggestion, i) => (
                      <div
                        key={i}
                        className='flex gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15'
                      >
                        <AlertTriangle className='h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5' />
                        <p className='text-xs text-foreground leading-relaxed'>{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Re-analyse / clear buttons */}
              <div className='flex gap-2 pt-1'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setAnalysis(null);
                    // Keep the job description so the user can re-analyse after edits
                  }}
                  disabled={isPending}
                  className='flex-1 h-8 text-xs'
                >
                  <RefreshCw className='h-3 w-3 mr-1.5' /> Re-analyse
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleReset}
                  className='flex-1 h-8 text-xs text-muted-foreground'
                >
                  Clear
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ATSAnalysis;
