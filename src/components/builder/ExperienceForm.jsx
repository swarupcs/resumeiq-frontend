import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { useEnhanceJobDescription } from '@/hooks/ai/useEnhanceJobDescription';

const ExperienceForm = ({ data, onChange }) => {
  const {
    mutateAsync: enhanceJobDescription,
    isPending,
    variables,
  } = useEnhanceJobDescription();

  const addExperience = () => {
    onChange([
      ...data,
      {
        company: '',
        position: '',
        start_date: '',
        end_date: '',
        description: '',
        is_current: false,
      },
    ]);
  };

  const removeExperience = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  // Phase 3 — Feature 2: AI generate from blank.
  // When description IS empty → generate a starter description from scratch.
  // When description is NOT empty → enhance the existing content.
  // The prompt sent to the AI differs slightly: the generate prompt explicitly
  // asks for a fresh description; the enhance prompt includes the existing text.
  const generateOrEnhanceDescription = async (index) => {
    const experience = data[index];
    if (!experience.position || !experience.company) {
      toast.error('Please fill in company and position first');
      return;
    }

    const isEmpty = !experience.description?.trim();

    const userContent = isEmpty
      ? // Generate from blank — no existing description to reference
        `Company: ${experience.company}\nPosition: ${experience.position}\nGenerate a professional job description for this role.`
      : // Enhance existing content
        `Company: ${experience.company}\nPosition: ${experience.position}\nCurrent Description: ${experience.description}`;

    const result = await enhanceJobDescription(userContent);

    if (result?.data?.enhancedContent) {
      updateExperience(index, 'description', result.data.enhancedContent);
      toast.success(isEmpty ? 'Description generated' : 'Description enhanced');
    } else {
      toast.error('Failed to generate description');
    }
  };

  // Determine whether we're generating or enhancing for a specific index.
  // Used to show the correct button label.
  const isGeneratingIndex = (index) => {
    if (!isPending) return false;
    const exp = data[index];
    return (
      variables?.includes(exp.company) && variables?.includes(exp.position)
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-foreground'>
            Professional Experience
          </h3>
          <p className='text-sm text-muted-foreground'>Add your work experience</p>
        </div>
        <button
          onClick={addExperience}
          className='flex items-center gap-2 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors dark:bg-green-900/30 dark:text-green-300'
        >
          <Plus className='size-4' /> Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-8 text-muted-foreground'>
          <Briefcase className='w-12 h-12 mx-auto mb-3 opacity-30' />
          <p>No work experience added yet.</p>
          <p className='text-sm'>Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {data.map((experience, index) => {
            const isEmpty = !experience.description?.trim();

            return (
              <div
                key={index}
                className='p-4 border border-border rounded-lg space-y-3 bg-card'
              >
                <div className='flex justify-between items-start'>
                  <h4 className='font-medium text-foreground'>Experience #{index + 1}</h4>
                  <button
                    onClick={() => removeExperience(index)}
                    className='text-destructive hover:text-destructive/80 transition-colors'
                  >
                    <Trash2 className='size-4' />
                  </button>
                </div>

                <div className='grid md:grid-cols-2 gap-3'>
                  <input
                    value={experience.company || ''}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    type='text'
                    placeholder='Company Name'
                    className='px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none'
                  />
                  <input
                    value={experience.position || ''}
                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                    type='text'
                    placeholder='Job Title'
                    className='px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none'
                  />
                  <input
                    value={experience.start_date || ''}
                    onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                    type='month'
                    className='px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none'
                  />
                  <input
                    value={experience.end_date || ''}
                    onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                    type='month'
                    disabled={experience.is_current}
                    className='px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none disabled:bg-muted disabled:cursor-not-allowed'
                  />
                </div>

                <div className='flex items-center gap-2'>
                  <Checkbox
                    id={`current-${index}`}
                    checked={experience.is_current}
                    onCheckedChange={(checked) =>
                      updateExperience(index, 'is_current', checked)
                    }
                  />
                  <label
                    htmlFor={`current-${index}`}
                    className='text-sm text-muted-foreground cursor-pointer'
                  >
                    Currently working here
                  </label>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Job Description
                    </label>

                    {/* Phase 3 — Feature 2: Button label changes based on whether
                        description is empty (Generate) or has content (Enhance) */}
                    <button
                      onClick={() => generateOrEnhanceDescription(index)}
                      disabled={
                        isPending || !experience.position || !experience.company
                      }
                      className='flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50 dark:bg-purple-900/30 dark:text-purple-300'
                    >
                      {isGeneratingIndex(index) ? (
                        <Loader2 className='w-3 h-3 animate-spin' />
                      ) : (
                        <Sparkles className='w-3 h-3' />
                      )}
                      {isGeneratingIndex(index)
                        ? 'Working…'
                        : isEmpty
                          ? 'Generate with AI'
                          : 'Enhance with AI'}
                    </button>
                  </div>

                  <textarea
                    value={experience.description || ''}
                    onChange={(e) =>
                      updateExperience(index, 'description', e.target.value)
                    }
                    rows={4}
                    className='w-full text-sm px-3 py-2 rounded-lg resize-none border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none'
                    placeholder={
                      isEmpty
                        ? 'Leave blank and click "Generate with AI", or write your own description…'
                        : 'Describe your key responsibilities and achievements…'
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
