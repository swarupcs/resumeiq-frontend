import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useResumeCompleteness } from '@/hooks/resume/useResumeCompleteness.js';

// Phase 3 — Feature 3: Resume completeness score widget.
// Sits below the preview in ResumeBuilder. Shows a circular progress ring,
// the numeric score, and up to 4 actionable tips for what to fill in next.
// Collapsible so it doesn't crowd the preview on smaller screens.

const getScoreColor = (score) => {
  if (score >= 80) return { ring: '#10B981', label: 'Great', labelClass: 'text-green-500' };
  if (score >= 50) return { ring: '#F59E0B', label: 'Good', labelClass: 'text-amber-500' };
  return { ring: '#EF4444', label: 'Needs work', labelClass: 'text-red-500' };
};

// SVG circular progress ring
const ScoreRing = ({ score, color }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width='96' height='96' viewBox='0 0 96 96'>
      {/* Track */}
      <circle
        cx='48' cy='48' r={radius}
        fill='none'
        stroke='currentColor'
        strokeWidth='7'
        className='text-border'
      />
      {/* Progress */}
      <circle
        cx='48' cy='48' r={radius}
        fill='none'
        stroke={color}
        strokeWidth='7'
        strokeLinecap='round'
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform='rotate(-90 48 48)'
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text
        x='48' y='44'
        textAnchor='middle'
        dominantBaseline='central'
        fontSize='18'
        fontWeight='700'
        fill={color}
      >
        {score}
      </text>
      <text
        x='48' y='62'
        textAnchor='middle'
        dominantBaseline='central'
        fontSize='10'
        fill='currentColor'
        className='text-muted-foreground'
      >
        / 100
      </text>
    </svg>
  );
};

const CompletenessScore = ({ resumeData }) => {
  const [expanded, setExpanded] = useState(true);
  const { score, tips, completedSections, totalSections, allSections } =
    useResumeCompleteness(resumeData);
  const { ring, label, labelClass } = getScoreColor(score);

  return (
    <div className='rounded-xl border border-border bg-card overflow-hidden'>
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className='w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/40 transition-colors'
      >
        <div className='flex items-center gap-2'>
          <span className='text-sm font-semibold text-foreground'>Resume Completeness</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
            score >= 80
              ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400'
              : score >= 50
                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400'
                : 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400'
          }`}>
            {score}%
          </span>
        </div>
        {expanded
          ? <ChevronUp className='h-4 w-4 text-muted-foreground' />
          : <ChevronDown className='h-4 w-4 text-muted-foreground' />
        }
      </button>

      {expanded && (
        <div className='px-4 pb-4 space-y-4'>
          {/* Score ring + label */}
          <div className='flex items-center gap-4'>
            <ScoreRing score={score} color={ring} />
            <div>
              <p className={`text-lg font-bold ${labelClass}`}>{label}</p>
              <p className='text-xs text-muted-foreground mt-0.5'>
                {completedSections.length} of {totalSections} sections complete
              </p>
              {score === 100 && (
                <p className='text-xs text-green-500 mt-1 font-medium'>
                  Your resume is ready to share!
                </p>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className='w-full bg-secondary rounded-full h-1.5'>
            <div
              className='h-1.5 rounded-full transition-all duration-700'
              style={{ width: `${score}%`, backgroundColor: ring }}
            />
          </div>

          {/* Tips */}
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
                    <p className='text-xs text-foreground leading-relaxed'>{tip.tip}</p>
                  </div>
                  <span className='text-xs font-semibold text-primary shrink-0'>
                    +{tip.points}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Section checklist — compact */}
          <div className='space-y-1.5'>
            <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
              All sections
            </p>
            <div className='grid grid-cols-2 gap-1'>
              {allSections.map((section) => (
                <div key={section.key} className='flex items-center gap-1.5'>
                  {section.done
                    ? <CheckCircle2 className='h-3 w-3 text-green-500 shrink-0' />
                    : <Circle className='h-3 w-3 text-muted-foreground/40 shrink-0' />
                  }
                  <span className={`text-xs truncate ${
                    section.done ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {section.label}
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

export default CompletenessScore;
