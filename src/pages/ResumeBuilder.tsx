import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  FileText,
  FolderIcon,
  GraduationCap,
  Sparkles,
  User,
  Save,
  Loader2,
  Undo2,
  Redo2,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import {
  PersonalInfoForm,
  ProfessionalSummaryForm,
  ExperienceForm,
  EducationForm,
  ProjectForm,
  SkillsForm,
} from '@/components/builder/FormComponents';
import ResumePreview, {
  TemplateSelector,
  ColorPicker,
  AutosaveStatusBadge,
} from '@/components/builder/ResumePreview';
import {
  CompletenessScore,
  ATSAnalysisWidget,
  VersionHistory,
} from '@/components/builder/BuilderWidgets';
import { Button } from '@/components/ui/button';
import {
  useResumeById,
  useUpdateResume,
  useToggleResumeVisibility,
  useExportResumePdf,
} from '@/hooks/resume/index';
import { useAutosave, useUndoRedo } from '@/hooks/resume/useAutosave';
import type { ResumeData, UpdateResumePayload } from '@/types';

const SECTIONS = [
  { id: 'personal', name: 'Personal Info', icon: User },
  { id: 'summary', name: 'Summary', icon: FileText },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'projects', name: 'Projects', icon: FolderIcon },
  { id: 'skills', name: 'Skills', icon: Sparkles },
];

const DEFAULT_RESUME: ResumeData = {
  title: 'Untitled Resume',
  personal_info: {},
  professional_summary: '',
  experience: [],
  education: [],
  project: [],
  skills: [],
  template: 'classic',
  accent_color: '#3B82F6',
  public: false,
};

const ResumeBuilder = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const { data: fetchedResume, isLoading } = useResumeById(resumeId ?? '');
  const serverResume = useMemo((): ResumeData | null => {
    const r = fetchedResume?.data?.resume;
    if (!r) return null;
    return { ...r, public: r.isPublic ?? false, versions: r.versions ?? [] };
  }, [fetchedResume]);

  const {
    state: localOverrides,
    setState: setLocalOverrides,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
  } = useUndoRedo<Partial<ResumeData>>({});
  const resumeData = useMemo(
    (): ResumeData => ({
      ...DEFAULT_RESUME,
      ...serverResume,
      ...localOverrides,
    }),
    [serverResume, localOverrides],
  );
  const setResumeData = (
    updater: ResumeData | ((prev: ResumeData) => ResumeData),
  ) => {
    setLocalOverrides((prev) => {
      const current = {
        ...DEFAULT_RESUME,
        ...serverResume,
        ...prev,
      } as ResumeData;
      return typeof updater === 'function' ? updater(current) : updater;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = navigator.platform.toUpperCase().includes('MAC')
        ? e.metaKey
        : e.ctrlKey;
      if (!ctrl) return;
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  const { mutateAsync: updateResume } = useUpdateResume(resumeId ?? '');
  const updateResumeRef = useRef(updateResume);
  useEffect(() => {
    updateResumeRef.current = updateResume;
  }, [updateResume]);
  const removeBackgroundRef = useRef(removeBackground);
  useEffect(() => {
    removeBackgroundRef.current = removeBackground;
  }, [removeBackground]);

  const performSave = async (dataToSave: ResumeData) => {
    const hasNewImage = dataToSave.personal_info?.image instanceof File;
    const payload: UpdateResumePayload = {
      resumeId: resumeId ?? '',
      resumeData: {
        ...dataToSave,
        personal_info: hasNewImage
          ? { ...dataToSave.personal_info, image: undefined }
          : dataToSave.personal_info,
      },
      image: hasNewImage ? (dataToSave.personal_info.image as File) : null,
      removeBackground: removeBackgroundRef.current,
    };
    const result = await updateResumeRef.current(payload);
    if (result.data?.resume) {
      setResumeData((prev) => ({
        ...prev,
        personal_info: result.data!.resume.personal_info ?? prev.personal_info,
        public: result.data!.resume.isPublic ?? prev.public,
        versions:
          (
            result.data!.resume as ResumeData & {
              versions?: ResumeData['versions'];
            }
          ).versions ?? prev.versions,
      }));
    }
    clearHistory();
    setLocalOverrides({});
  };

  const hasLocalImageFile = resumeData.personal_info?.image instanceof File;
  const { autosaveStatus, triggerSave, resetBaseline } = useAutosave({
    data: resumeData,
    onSave: performSave,
    delay: 2000,
    enabled:
      !!serverResume &&
      !hasLocalImageFile &&
      Object.keys(localOverrides).length > 0,
  });

  const handleManualSave = async () => {
    await triggerSave(resumeData);
    resetBaseline(resumeData);
    clearHistory();
    setLocalOverrides({});
  };

  const { mutate: exportPdf, isPending: isExporting } = useExportResumePdf();
  const handleDownloadPdf = () =>
    exportPdf({
      resumeId: resumeId ?? '',
      fullName: resumeData.personal_info?.full_name ?? 'Resume',
      resumeData,
    });

  useEffect(() => {
    if (
      searchParams.get('download') === 'true' &&
      serverResume &&
      !isExporting
    ) {
      setSearchParams({}, { replace: true });
      handleDownloadPdf();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverResume]);

  const { mutate: toggleVisibility, isPending: isToggling } =
    useToggleResumeVisibility();
  const changeVisibility = () =>
    toggleVisibility(resumeId ?? '', {
      onSuccess: (data) => {
        if (data.data)
          setResumeData((p) => ({ ...p, public: data.data!.resume.isPublic }));
      },
    });

  const handleShare = () => {
    const url = `${window.location.origin}/preview/${resumeId}`;
    if (navigator.share) {
      navigator.share({ url, title: resumeData.title }).catch(() => {});
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => toast.success('Link copied!'));
    }
  };

  const progressPercent = (activeSectionIndex / (SECTIONS.length - 1)) * 100;

  if (isLoading)
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    );

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <div className='max-w-7xl mx-auto px-4 py-6 mt-16'>
        <Link
          to='/dashboard'
          className='inline-flex gap-2 items-center text-muted-foreground hover:text-foreground transition-colors'
        >
          <ArrowLeft className='size-4' />
          Back to Dashboard
        </Link>
      </div>
      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          {/* Left Panel */}
          <div className='relative lg:col-span-5'>
            <div className='bg-card rounded-xl shadow-sm border border-border p-6 pt-4 relative overflow-hidden'>
              <div className='absolute top-0 left-0 right-0 h-1 bg-muted'>
                <div
                  className='h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500'
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className='flex justify-between items-center mb-6 border-b border-border pb-3 pt-2'>
                <div className='flex items-center gap-2'>
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    accentColor={resumeData.accent_color}
                    onChange={(t) =>
                      setResumeData((p) => ({ ...p, template: t }))
                    }
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(c) =>
                      setResumeData((p) => ({ ...p, accent_color: c }))
                    }
                  />
                  <div className='flex items-center gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={undo}
                      disabled={!canUndo}
                      className='h-8 w-8 text-muted-foreground hover:text-foreground'
                      title='Undo (Ctrl+Z)'
                    >
                      <Undo2 className='size-3.5' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={redo}
                      disabled={!canRedo}
                      className='h-8 w-8 text-muted-foreground hover:text-foreground'
                      title='Redo (Ctrl+Y)'
                    >
                      <Redo2 className='size-3.5' />
                    </Button>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <AutosaveStatusBadge status={autosaveStatus} />
                  {activeSectionIndex !== 0 && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() =>
                        setActiveSectionIndex((p) => Math.max(p - 1, 0))
                      }
                      className='text-muted-foreground'
                    >
                      <ChevronLeft className='size-4 mr-1' />
                      Prev
                    </Button>
                  )}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() =>
                      setActiveSectionIndex((p) =>
                        Math.min(p + 1, SECTIONS.length - 1),
                      )
                    }
                    disabled={activeSectionIndex === SECTIONS.length - 1}
                    className='text-muted-foreground'
                  >
                    Next
                    <ChevronRight className='size-4 ml-1' />
                  </Button>
                </div>
              </div>
              <div className='flex justify-center gap-2 mb-6'>
                {SECTIONS.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSectionIndex(index)}
                      className={`p-2 rounded-lg transition-colors ${index === activeSectionIndex ? 'bg-primary text-primary-foreground' : index < activeSectionIndex ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-muted text-muted-foreground'}`}
                      title={section.name}
                    >
                      <Icon className='size-4' />
                    </button>
                  );
                })}
              </div>
              <div className='space-y-6 min-h-[400px]'>
                {SECTIONS[activeSectionIndex]?.id === 'personal' && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(d) =>
                      setResumeData((p) => ({ ...p, personal_info: d }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {SECTIONS[activeSectionIndex]?.id === 'summary' && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(d) =>
                      setResumeData((p) => ({ ...p, professional_summary: d }))
                    }
                  />
                )}
                {SECTIONS[activeSectionIndex]?.id === 'experience' && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(d) =>
                      setResumeData((p) => ({ ...p, experience: d }))
                    }
                  />
                )}
                {SECTIONS[activeSectionIndex]?.id === 'education' && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(d) =>
                      setResumeData((p) => ({ ...p, education: d }))
                    }
                  />
                )}
                {SECTIONS[activeSectionIndex]?.id === 'projects' && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(d) =>
                      setResumeData((p) => ({ ...p, project: d }))
                    }
                  />
                )}
                {SECTIONS[activeSectionIndex]?.id === 'skills' && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(d) =>
                      setResumeData((p) => ({ ...p, skills: d }))
                    }
                  />
                )}
              </div>
              <Button
                onClick={() => void handleManualSave()}
                disabled={autosaveStatus === 'saving'}
                className='w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
              >
                {autosaveStatus === 'saving' ? (
                  <>
                    <Loader2 className='size-4 animate-spin mr-2' />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className='size-4 mr-2' />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
          {/* Right Panel */}
          <div className='lg:col-span-7 space-y-4'>
            <div className='flex items-center justify-end gap-2 flex-wrap'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => navigate(`/app/cover-letter/${resumeId}`)}
                className='bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800'
              >
                <Mail className='size-4 mr-2' />
                Cover Letter
              </Button>
              {resumeData.public && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleShare}
                  className='bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                >
                  <Share className='size-4 mr-2' />
                  Share
                </Button>
              )}
              <Button
                variant='outline'
                size='sm'
                onClick={changeVisibility}
                disabled={isToggling}
                className='bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
              >
                {isToggling ? (
                  <Loader2 className='size-4 mr-2 animate-spin' />
                ) : resumeData.public ? (
                  <Eye className='size-4 mr-2' />
                ) : (
                  <EyeOff className='size-4 mr-2' />
                )}
                {resumeData.public ? 'Public' : 'Private'}
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleDownloadPdf}
                disabled={isExporting}
                className='bg-green-50 text-green-600 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 disabled:opacity-50'
              >
                {isExporting ? (
                  <>
                    <Loader2 className='size-4 mr-2 animate-spin' />
                    Generating…
                  </>
                ) : (
                  <>
                    <Download className='size-4 mr-2' />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
            <CompletenessScore resumeData={resumeData} />
            <ATSAnalysisWidget resumeData={resumeData} />
            <VersionHistory
              resumeId={resumeId ?? ''}
              versions={
                (
                  resumeData as ResumeData & {
                    versions?: ResumeData['versions'];
                  }
                ).versions ?? []
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Need Share import
const Share = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
    />
  </svg>
);

export default ResumeBuilder;
