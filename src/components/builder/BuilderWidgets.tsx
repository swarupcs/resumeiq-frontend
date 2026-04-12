import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Target,
  Loader2,
  RefreshCw,
  History,
  RotateCcw,
  XCircle,
  Lightbulb,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useResumeCompleteness } from '@/hooks/resume/useResumeCompleteness';
import { useRestoreVersion } from '@/hooks/resume/index';
import { useATSAnalysis } from '@/hooks/ai';
import type { ResumeData, ATSAnalysis } from '@/types';

// ── ScoreRing ─────────────────────────────────────────────────────────────────
const ScoreRing = ({
  score,
  color,
  size = 96,
}: {
  score: number;
  color: string;
  size?: number;
}) => {
  const r = size * 0.375;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const cx = size / 2,
    cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill='none'
        stroke='currentColor'
        strokeWidth='7'
        className='text-border'
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill='none'
        stroke={color}
        strokeWidth='7'
        strokeLinecap='round'
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text
        x={cx}
        y={cy - 4}
        textAnchor='middle'
        dominantBaseline='central'
        fontSize={size * 0.19}
        fontWeight='700'
        fill={color}
      >
        {score}
      </text>
      <text
        x={cx}
        y={cy + size * 0.16}
        textAnchor='middle'
        dominantBaseline='central'
        fontSize={size * 0.1}
        fill='currentColor'
        className='fill-muted-foreground'
      >
        / 100
      </text>
    </svg>
  );
};

const getScoreColor = (score: number) => {
  if (score >= 80)
    return { ring: '#10B981', label: 'Great', labelClass: 'text-green-500' };
  if (score >= 50)
    return { ring: '#F59E0B', label: 'Good', labelClass: 'text-amber-500' };
  return { ring: '#EF4444', label: 'Needs work', labelClass: 'text-red-500' };
};

// ── CompletenessScore ─────────────────────────────────────────────────────────
export const CompletenessScore = ({
  resumeData,
}: {
  resumeData: ResumeData;
}) => {
  const [expanded, setExpanded] = useState(true);
  const { score, tips, completedSections, totalSections, allSections } =
    useResumeCompleteness(resumeData);
  const { ring, label, labelClass } = getScoreColor(score);
  return (
    <div className='rounded-xl border border-border bg-card overflow-hidden'>
      <button
        onClick={() => setExpanded((v) => !v)}
        className='w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/40 transition-colors'
      >
        <div className='flex items-center gap-2'>
          <span className='text-sm font-semibold text-foreground'>
            Resume Completeness
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${score >= 80 ? 'bg-green-500/10 text-green-600 border-green-500/20' : score >= 50 ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}
          >
            {score}%
          </span>
        </div>
        {expanded ? (
          <ChevronUp className='h-4 w-4 text-muted-foreground' />
        ) : (
          <ChevronDown className='h-4 w-4 text-muted-foreground' />
        )}
      </button>
      {expanded && (
        <div className='px-4 pb-4 space-y-4'>
          <div className='flex items-center gap-4'>
            <ScoreRing score={score} color={ring} />
            <div>
              <p className={`text-lg font-bold ${labelClass}`}>{label}</p>
              <p className='text-xs text-muted-foreground mt-0.5'>
                {completedSections.length} of {totalSections} sections complete
              </p>
            </div>
          </div>
          <div className='w-full bg-secondary rounded-full h-1.5'>
            <div
              className='h-1.5 rounded-full transition-all duration-700'
              style={{ width: `${score}%`, backgroundColor: ring }}
            />
          </div>
          {tips.length > 0 && (
            <div className='space-y-2'>
              <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Top suggestions
              </p>
              {tips.map((tip) => (
                <div
                  key={tip.key}
                  className='flex items-start gap-2.5 p-2.5 rounded-lg bg-secondary/50 border border-border'
                >
                  <Circle className='h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs text-foreground leading-relaxed'>
                      {tip.tip}
                    </p>
                  </div>
                  <span className='text-xs font-semibold text-primary shrink-0'>
                    +{tip.points}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className='space-y-1.5'>
            <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
              All sections
            </p>
            <div className='grid grid-cols-2 gap-1'>
              {allSections.map((s) => (
                <div key={s.key} className='flex items-center gap-1.5'>
                  {s.done ? (
                    <CheckCircle2 className='h-3 w-3 text-green-500 shrink-0' />
                  ) : (
                    <Circle className='h-3 w-3 text-muted-foreground/40 shrink-0' />
                  )}
                  <span
                    className={`text-xs truncate ${s.done ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── ATSAnalysis ───────────────────────────────────────────────────────────────
export const ATSAnalysisWidget = ({
  resumeData,
}: {
  resumeData: ResumeData;
}) => {
  const [expanded, setExpanded] = useState(true);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const { mutate: analyze, isPending } = useATSAnalysis();

  const handleAnalyze = () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 50) return;
    analyze(
      { resumeData, jobDescription },
      {
        onSuccess: (data) => {
          if (data.data?.analysis) setAnalysis(data.data.analysis);
        },
      },
    );
  };

  const getStyle = (score: number) => {
    if (score >= 80)
      return { color: '#10B981', label: 'Excellent', ring: '#10B981' };
    if (score >= 60)
      return { color: '#3B82F6', label: 'Good', ring: '#3B82F6' };
    if (score >= 40)
      return { color: '#F59E0B', label: 'Fair', ring: '#F59E0B' };
    return { color: '#EF4444', label: 'Needs work', ring: '#EF4444' };
  };

  const scoreStyle = analysis ? getStyle(analysis.score) : null;
  const isReady = jobDescription.length >= 50;

  return (
    <div className='rounded-xl border border-border bg-card overflow-hidden'>
      <button
        onClick={() => setExpanded((v) => !v)}
        className='w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/40 transition-colors'
      >
        <div className='flex items-center gap-2'>
          <Target className='h-4 w-4 text-primary' />
          <span className='text-sm font-semibold text-foreground'>
            ATS Score
          </span>
          {analysis && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${analysis.score >= 80 ? 'bg-green-500/10 text-green-600 border-green-500/20' : analysis.score >= 60 ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}
            >
              {analysis.score}/100
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className='h-4 w-4 text-muted-foreground' />
        ) : (
          <ChevronDown className='h-4 w-4 text-muted-foreground' />
        )}
      </button>
      {expanded && (
        <div className='px-4 pb-4 space-y-4'>
          {!analysis ? (
            <>
              <p className='text-xs text-muted-foreground'>
                Paste a job description to get an ATS compatibility score and
                keyword analysis.
              </p>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <label className='text-xs font-semibold text-foreground'>
                    Job Description
                  </label>
                  <span
                    className={`text-xs ${isReady ? 'text-green-500' : 'text-muted-foreground'}`}
                  >
                    {jobDescription.length} chars{' '}
                    {!isReady && `(need ${50 - jobDescription.length} more)`}
                  </span>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={7}
                  placeholder='Paste the full job description here…'
                  className='w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-colors resize-none leading-relaxed'
                />
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={!isReady || isPending}
                className='w-full bg-gradient-to-r from-primary to-purple-600 text-white text-xs h-9'
              >
                {isPending ? (
                  <>
                    <Loader2 className='h-3.5 w-3.5 mr-2 animate-spin' />
                    Analysing…
                  </>
                ) : (
                  <>
                    <Target className='h-3.5 w-3.5 mr-2' />
                    Analyse ATS Score
                  </>
                )}
              </Button>
            </>
          ) : (
            scoreStyle && (
              <>
                <div className='flex items-center gap-4 p-3 rounded-xl bg-secondary/40 border border-border'>
                  <ScoreRing
                    score={analysis.score}
                    color={scoreStyle.ring}
                    size={104}
                  />
                  <div className='flex-1 min-w-0'>
                    <p
                      className='text-base font-bold'
                      style={{ color: scoreStyle.color }}
                    >
                      {scoreStyle.label}
                    </p>
                    <p className='text-xs text-muted-foreground mt-0.5 leading-relaxed'>
                      {analysis.summary}
                    </p>
                    <div className='mt-2 w-full bg-secondary rounded-full h-1.5'>
                      <div
                        className='h-1.5 rounded-full transition-all duration-700'
                        style={{
                          width: `${analysis.score}%`,
                          backgroundColor: scoreStyle.ring,
                        }}
                      />
                    </div>
                  </div>
                </div>
                {analysis.matchedKeywords.length > 0 && (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-1.5'>
                      <CheckCircle2 className='h-3.5 w-3.5 text-green-500' />
                      <p className='text-xs font-semibold text-foreground'>
                        Matched ({analysis.matchedKeywords.length})
                      </p>
                    </div>
                    <div className='flex flex-wrap gap-1.5'>
                      {analysis.matchedKeywords.map((kw) => (
                        <span
                          key={kw}
                          className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20'
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.missingKeywords.length > 0 && (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-1.5'>
                      <XCircle className='h-3.5 w-3.5 text-red-500' />
                      <p className='text-xs font-semibold text-foreground'>
                        Missing ({analysis.missingKeywords.length})
                      </p>
                    </div>
                    <div className='flex flex-wrap gap-1.5'>
                      {analysis.missingKeywords.map((kw) => (
                        <span
                          key={kw}
                          className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-600 border border-red-500/20'
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.suggestions.length > 0 && (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-1.5'>
                      <Lightbulb className='h-3.5 w-3.5 text-amber-500' />
                      <p className='text-xs font-semibold text-foreground'>
                        Suggestions
                      </p>
                    </div>
                    {analysis.suggestions.map((s, i) => (
                      <div
                        key={i}
                        className='flex gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15'
                      >
                        <AlertTriangle className='h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5' />
                        <p className='text-xs text-foreground leading-relaxed'>
                          {s}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <div className='flex gap-2 pt-1'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setAnalysis(null)}
                    disabled={isPending}
                    className='flex-1 h-8 text-xs'
                  >
                    <RefreshCw className='h-3 w-3 mr-1.5' />
                    Re-analyse
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      setAnalysis(null);
                      setJobDescription('');
                    }}
                    className='flex-1 h-8 text-xs text-muted-foreground'
                  >
                    Clear
                  </Button>
                </div>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

// ── VersionHistory ────────────────────────────────────────────────────────────
export const VersionHistory = ({
  resumeId,
  versions = [],
}: {
  resumeId: string;
  versions: Array<{
    savedAt: string;
    label: string;
    snapshot: Partial<ResumeData>;
  }>;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);
  const { mutate: restoreVersion, isPending } = useRestoreVersion(resumeId);

  if (versions.length === 0) return null;

  return (
    <>
      <div className='rounded-xl border border-border bg-card overflow-hidden'>
        <button
          onClick={() => setExpanded((v) => !v)}
          className='w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/40 transition-colors'
        >
          <div className='flex items-center gap-2'>
            <History className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-semibold text-foreground'>
              Version History
            </span>
            <span className='text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full'>
              {versions.length}
            </span>
          </div>
          {expanded ? (
            <ChevronUp className='h-4 w-4 text-muted-foreground' />
          ) : (
            <ChevronDown className='h-4 w-4 text-muted-foreground' />
          )}
        </button>
        {expanded && (
          <div className='px-4 pb-4 space-y-2'>
            <p className='text-xs text-muted-foreground mb-3'>
              Current state is saved before restoring a version.
            </p>
            {[...versions].reverse().map((version, reversedIdx) => {
              const originalIdx = versions.length - 1 - reversedIdx;
              return (
                <div
                  key={originalIdx}
                  className='flex items-center justify-between gap-3 p-2.5 rounded-lg bg-secondary/40 border border-border hover:border-primary/30 transition-colors'
                >
                  <div className='min-w-0'>
                    <p className='text-xs font-medium text-foreground truncate'>
                      {version.label || `Version ${originalIdx + 1}`}
                    </p>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      {new Date(version.savedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setConfirmIndex(originalIdx)}
                    disabled={isPending}
                    className='h-7 px-2 text-xs text-muted-foreground hover:text-primary shrink-0'
                  >
                    <RotateCcw className='h-3 w-3 mr-1' />
                    Restore
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Dialog
        open={confirmIndex !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmIndex(null);
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Restore this version?</DialogTitle>
            <DialogDescription>
              Your current resume content will be saved as a new version before
              restoring. The builder will reload with the restored content.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              disabled={isPending}
              onClick={() => setConfirmIndex(null)}
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={() =>
                confirmIndex !== null &&
                restoreVersion(confirmIndex, {
                  onSuccess: () => setConfirmIndex(null),
                })
              }
            >
              {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Restore Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
