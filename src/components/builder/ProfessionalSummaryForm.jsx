import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useEnhanceProfessionalSummary } from '@/hooks/ai/useEnhanceProfessionalSummary';

const ProfessionalSummaryForm = ({ data, onChange }) => {
  const { mutateAsync: enhanceSummary, isPending } =
    useEnhanceProfessionalSummary();

  const generateSummary = async () => {
    if (!data.trim()) {
      toast.error('Please write some content first to enhance');
      return;
    }

    const result = await enhanceSummary(data);
    onChange(result.data.enhancedContent);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-foreground'>
            Professional Summary
          </h3>
          <p className='text-sm text-muted-foreground'>
            Add a compelling summary for your resume
          </p>
        </div>
        <button
          disabled={isPending}
          onClick={generateSummary}
          className='flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 dark:bg-purple-900/30 dark:text-purple-300'
        >
          {isPending ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <Sparkles className='size-4' />
          )}
          {isPending ? 'Enhancing...' : 'AI Enhance'}
        </button>
      </div>

      <div className='mt-6'>
        <textarea
          value={data || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          className='w-full p-3 px-4 border text-sm border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-colors resize-none'
          placeholder='Write a compelling professional summary that highlights your key strengths and career objectives...'
        />
        <p className='text-xs text-muted-foreground text-center mt-2'>
          Tip: Keep it concise (3-4 sentences) and focus on your most relevant
          achievements and skills.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummaryForm;
