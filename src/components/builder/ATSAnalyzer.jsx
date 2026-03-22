import { useState } from 'react';
import {
  Target, Loader2, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, AlertCircle, RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useATSAnalysis } from '@/hooks/ai/useATSAnalysis.js';

// ATS Analyzer widget.
// Sits in the ResumeBuilder right panel below the CompletenessScore.
// User pastes a job description → clicks Analyze → sees:
//   - Circular score ring (0-100) with colour coding
//   - One-sentence summary
//   - Matched keywords (green pills)
//   - Missing keywords (red pills)
//   - 4 prioritised improvement tips

// ── Score ring ────────────────────────────────────────────────────────────────
const ScoreRing = ({ score, color }) => {
  const radius       = 38;
  const circumference = 2 * Math.PI * radius;
  const offset       = circumference - (score / 100) * circumference;

  return (
    <svg width='100' height='100' viewBox='0 0 100 100'>
      <circle cx='50' cy='50' r={radius}
        fill='none' stroke='currentColor' strokeWidth='7'
        className='text-border' />
      <circle cx='50' cy='50' r={radius}
        fill='none' stroke={color} strokeWidth='7'
        strokeLinecap='round'
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform='rotate(-90 50 50)'
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x='50' y='46' textAnchor='middle' dominantBaseline='central'
        fontSize='20' fontWeight='700' fill={color}>
        {score}
      </text>
      <text x='50' y='64' textAnchor='middle' dominantBaseline='central'
        fontSize='10' fill='currentColor' className='text-muted-foreground'>
        / 100
      </text>
    </svg>
  );
};

// ── Score colour + label ──────────────────────────────────────────────────────
const getScoreMeta = (score) => {
  if (score >= 90) return { color: '#10B981', label: 'Excellent',  labelClass: 'text-green-500',  bgClass: 'bg-green-500/10 border-green-500/20' };
  if (score >= 70) return { color: '#3B82F6', label: 'Good',       labelClass: 'text-blue-500',   bgClass: 'bg-blue-500/10  border-blue-500/20'  };
  if (score >= 50) return { color: '#F59E0B', label: 'Moderate',   labelClass: 'text-amber-500',  bgClass: 'bg-amber-500/10 border-amber-500/20' };
  if (score >= 30) return { color: '#F97316', label: 'Weak',       labelClass: 'text-orange-500', bgClass: 'bg-orange-500/10 border-orange-500/20' };
  return               { color: '#EF4444', label: 'Poor match', labelClass: 'text-red-500',    bgClass: 'bg-red-500/10   border-red-500/20'   };
};

// ── Priority icon ─────────────────────────────────────────────────────────────
const PriorityIcon = ({ priority }) => {
  if (priority === 'high')   return <XCircle      className='h-3.5 w-3.5 text-red-500    shrink-0' />;
  if (priority === 'medium') return <AlertCircle  className='h-3.5 w-3.5 text-amber-500  shrink-0' />;
  return                            <CheckCircle2 className='h-3.5 w-3.5 text-blue-500   shrink-0' />;
};

// ── Main component ────────────────────────────────────────────────────────────
const ATSAnalyzer = ({ resumeData }) => {
  const [expanded, setExpanded]           = useState(true);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis]           = useState(null);

  const { mutate: analyze, isPending } = useATSAnalysis();

  const handleAnalyze = () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 30) return;
    analyze(
      { resumeData, jobDescription },
      {
        onSuccess: (data) => setAnalysis(data.data.analysis),
      }
    );
  };

  const handleClear = () => {
    setAnalysis(null);
    setJobDescription('');
  };

  const scoreMeta = analysis ? getScoreMeta(analysis.score) : null;
  const charCount = jobDescription.length;
  const isReady   = charCount >= 30;

  return (
    <div className='rounded-xl border border-border bg-card overflow-hidden'>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className='w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/40 transition-colors'
      >
        <div className='flex items-center gap-2'>
          <Target className='h-4 w-4 text-primary' />
          <span className='text-sm font-semibold text-foreground'>ATS Score Checker</span>
          {analysis && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${scoreMeta.bgClass} ${scoreMeta.labelClass}`}>
              {analysis.score} — {scoreMeta.label}
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

          {/* ── Job description input ──────────────────────────────────────── */}
          {!analysis && (
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  Job Description
                </label>
                <span className={`text-xs ${isReady ? 'text-green-500' : 'text-muted-foreground'}`}>
                  {charCount} chars {!isReady && `(need ${30 - charCount} more)`}
                </span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                placeholder='Paste the full job description here — include the title, requirements, and responsibilities for the most accurate ATS score…'
                className='w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-colors resize-none leading-relaxed'
              />
              <Button
                onClick={handleAnalyze}
                disabled={isPending || !isReady}
                className='w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white'
              >
                {isPending ? (
                  <><Loader2 className='size-4 mr-2 animate-spin' /> Analysing…</>
                ) : (
                  <><Sparkles className='size-4 mr-2' /> Analyse ATS Compatibility</>
                )}
              </Button>
            </div>
          )}

          {/* ── Results ────────────────────────────────────────────────────── */}
          {analysis && (
            <div className='space-y-4'>

              {/* Score + summary */}
              <div className='flex items-center gap-4'>
                <ScoreRing score={analysis.score} color={scoreMeta.color} />
                <div className='flex-1 min-w-0'>
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-semibold mb-2 ${scoreMeta.bgClass} ${scoreMeta.labelClass}`}>
                    {scoreMeta.label} match
                  </div>
                  <p className='text-xs text-muted-foreground leading-relaxed'>
                    {analysis.summary}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className='w-full bg-secondary rounded-full h-1.5'>
                <div
                  className='h-1.5 rounded-full transition-all duration-700'
                  style={{ width: `${analysis.score}%`, backgroundColor: scoreMeta.color }}
                />
              </div>

              {/* Keyword columns */}
              <div className='grid grid-cols-2 gap-3'>

                {/* Matched */}
                <div className='space-y-2'>
                  <div className='flex items-center gap-1.5'>
                    <CheckCircle2 className='h-3.5 w-3.5 text-green-500' />
                    <p className='text-xs font-semibold text-foreground'>
                      Matched ({analysis.matched.length})
                    </p>
                  </div>
                  <div className='flex flex-wrap gap-1.5'>
                    {analysis.matched.length > 0 ? (
                      analysis.matched.map((kw, i) => (
                        <span
                          key={i}
                          className='px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-700 border border-green-500/20 dark:text-green-400'
                        >
                          {kw}
                        </span>
                      ))
                    ) : (
                      <p className='text-xs text-muted-foreground italic'>None found</p>
                    )}
                  </div>
                </div>

                {/* Missing */}
                <div className='space-y-2'>
                  <div className='flex items-center gap-1.5'>
                    <XCircle className='h-3.5 w-3.5 text-red-500' />
                    <p className='text-xs font-semibold text-foreground'>
                      Missing ({analysis.missing.length})
                    </p>
                  </div>
                  <div className='flex flex-wrap gap-1.5'>
                    {analysis.missing.length > 0 ? (
                      analysis.missing.map((kw, i) => (
                        <span
                          key={i}
                          className='px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-700 border border-red-500/20 dark:text-red-400'
                        >
                          {kw}
                        </span>
                      ))
                    ) : (
                      <p className='text-xs text-muted-foreground italic'>All covered!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tips */}
              {analysis.tips?.length > 0 && (
                <div className='space-y-2'>
                  <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    Improvement tips
                  </p>
                  {analysis.tips.map((item, i) => (
                    <div
                      key={i}
                      className='flex items-start gap-2.5 p-2.5 rounded-lg bg-secondary/50 border border-border'
                    >
                      <PriorityIcon priority={item.priority} />
                      <p className='text-xs text-foreground leading-relaxed'>{item.tip}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Re-analyse controls */}
              <div className='flex gap-2 pt-1'>
                <Button
                  variant='outline' size='sm'
                  onClick={() => { setAnalysis(null); }}
                  className='flex-1 text-xs'
                >
                  <RefreshCw className='h-3 w-3 mr-1.5' /> Re-analyse
                </Button>
                <Button
                  variant='ghost' size='sm'
                  onClick={handleClear}
                  className='flex-1 text-xs text-muted-foreground hover:text-foreground'
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Loading state overlay */}
          {isPending && (
            <div className='flex flex-col items-center gap-3 py-6'>
              <div className='relative'>
                <div className='absolute inset-0 rounded-full bg-primary/15 blur-xl animate-pulse scale-150' />
                <Loader2 className='h-8 w-8 animate-spin text-primary relative z-10' />
              </div>
              <p className='text-xs text-muted-foreground text-center'>
                Analysing your resume against the job description…
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ATSAnalyzer;
