import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Briefcase, ChevronLeft, ChevronRight,
  Download, Eye, EyeOff, FileText, FolderIcon,
  GraduationCap, Share2, Sparkles, User, Save,
  Loader2, Undo2, Redo2,
} from 'lucide-react';
import { toast } from 'sonner';

import Navbar from '@/components/Navbar';
import PersonalInfoForm from '@/components/builder/PersonalInfoForm';
import ProfessionalSummaryForm from '@/components/builder/ProfessionalSummaryForm';
import ExperienceForm from '@/components/builder/ExperienceForm';
import EducationForm from '@/components/builder/EducationForm';
import ProjectForm from '@/components/builder/ProjectForm';
import SkillsForm from '@/components/builder/SkillsForm';
import ResumePreview from '@/components/builder/ResumePreview';
import TemplateSelector from '@/components/builder/TemplateSelector';
import ColorPicker from '@/components/builder/ColorPicker';
import AutosaveStatusBadge from '@/components/builder/AutosaveStatusBadge';
import CompletenessScore from '@/components/builder/CompletenessScore';
import { Button } from '@/components/ui/button';
import { useResumeById } from '@/hooks/resume/useResumeById';
import { useUpdateResume } from '@/hooks/resume/useUpdateResume';
import { useAutosave } from '@/hooks/resume/useAutosave';
import { useUndoRedo } from '@/hooks/resume/useUndoRedo';
import { useExportResumePdf } from '@/hooks/resume/useExportResumePdf';
import { useToggleResumeVisibility } from '@/hooks/resume/useToggleResumeVisibility.js';

const sections = [
  { id: 'personal',   name: 'Personal Info', icon: User },
  { id: 'summary',    name: 'Summary',       icon: FileText },
  { id: 'experience', name: 'Experience',    icon: Briefcase },
  { id: 'education',  name: 'Education',     icon: GraduationCap },
  { id: 'projects',   name: 'Projects',      icon: FolderIcon },
  { id: 'skills',     name: 'Skills',        icon: Sparkles },
];

const DEFAULT_RESUME = {
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
  const { resumeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const { data: fetchedResume, isLoading } = useResumeById(resumeId, {
    onError: (error) => toast.error(error.message || 'Failed to load resume'),
  });

  const serverResume = useMemo(() => {
    const resume = fetchedResume?.data?.resume;
    if (!resume) return null;
    return {
      _id:   resume._id,
      title: resume.title ?? DEFAULT_RESUME.title,
      personal_info: {
        full_name:  resume.personal_info?.full_name  ?? '',
        email:      resume.personal_info?.email      ?? '',
        phone:      resume.personal_info?.phone      ?? '',
        location:   resume.personal_info?.location   ?? '',
        profession: resume.personal_info?.profession ?? '',
        linkedin:   resume.personal_info?.linkedin   ?? '',
        website:    resume.personal_info?.website    ?? '',
        image:      resume.personal_info?.image      ?? '',
      },
      professional_summary: resume.professional_summary ?? '',
      experience: (resume.experience ?? []).map((exp) => ({
        company:     exp.company     ?? '',
        position:    exp.position    ?? '',
        start_date:  exp.start_date  ?? '',
        end_date:    exp.end_date    ?? '',
        description: exp.description ?? '',
        is_current:  exp.is_current  ?? false,
      })),
      education: (resume.education ?? []).map((edu) => ({
        institution:     edu.institution     ?? '',
        degree:          edu.degree          ?? '',
        field:           edu.field           ?? '',
        graduation_date: edu.graduation_date ?? '',
        gpa:             edu.gpa             ?? '',
      })),
      project: (resume.project ?? []).map((proj) => ({
        name:        proj.name        ?? '',
        type:        proj.type        ?? '',
        description: proj.description ?? '',
      })),
      skills:       (resume.skills ?? []).map((s) => String(s)),
      template:     resume.template     ?? DEFAULT_RESUME.template,
      accent_color: resume.accent_color ?? DEFAULT_RESUME.accent_color,
      public:       resume.isPublic     ?? DEFAULT_RESUME.public,
    };
  }, [fetchedResume]);

  // ─── Undo / Redo ──────────────────────────────────────────────────────────
  const {
    state: localOverrides,
    setState: setLocalOverrides,
    undo, redo,
    canUndo, canRedo,
    clearHistory,
  } = useUndoRedo({});

  const resumeData = useMemo(
    () => ({ ...DEFAULT_RESUME, ...serverResume, ...localOverrides }),
    [serverResume, localOverrides],
  );

  const setResumeData = (updater) => {
    setLocalOverrides((prev) => {
      const current = { ...DEFAULT_RESUME, ...serverResume, ...prev };
      return typeof updater === 'function' ? updater(current) : updater;
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const ctrl = isMac ? e.metaKey : e.ctrlKey;
      if (!ctrl) return;
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); if (canUndo) undo(); }
      else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); if (canRedo) redo(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  // ─── Save ─────────────────────────────────────────────────────────────────
  const { mutateAsync: updateResume } = useUpdateResume(resumeId);

  const performSave = useCallback(
    async (dataToSave) => {
      const hasNewImage = dataToSave.personal_info?.image instanceof File;
      const resumeDataToSend = {
        ...dataToSave,
        personal_info: {
          ...dataToSave.personal_info,
          ...(hasNewImage ? { image: undefined } : {}),
        },
      };
      const result = await updateResume({
        resumeId,
        resumeData: resumeDataToSend,
        image: hasNewImage ? dataToSave.personal_info.image : null,
        removeBackground,
      });
      setResumeData((prev) => ({
        ...prev,
        personal_info: result.data.resume.personal_info ?? prev.personal_info,
        public:        result.data.resume.isPublic       ?? prev.public,
      }));
      clearHistory();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resumeId, removeBackground],
  );

  const hasLocalImageFile = resumeData.personal_info?.image instanceof File;

  const { autosaveStatus, triggerSave, resetBaseline } = useAutosave({
    data:    resumeData,
    onSave:  performSave,
    delay:   2000,
    enabled: !!serverResume && !hasLocalImageFile,
  });

  const handleManualSave = async () => {
    await triggerSave(resumeData);
    resetBaseline(resumeData);
    clearHistory();
  };

  // ─── Download PDF ─────────────────────────────────────────────────────────
  const { mutate: exportPdf, isPending: isExporting } = useExportResumePdf();

  const handleDownloadPdf = () => {
    exportPdf({ resumeId, fullName: resumeData.personal_info?.full_name, resumeData });
  };

  useEffect(() => {
    if (searchParams.get('download') === 'true' && serverResume && !isExporting) {
      setSearchParams({}, { replace: true });
      handleDownloadPdf();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverResume]);

  // ─── Visibility ───────────────────────────────────────────────────────────
  const { mutate: toggleVisibility, isPending: isTogglingVisibility } =
    useToggleResumeVisibility();

  const changeResumeVisibility = () => {
    toggleVisibility(resumeId, {
      onSuccess: (data) => {
        setResumeData((prev) => ({ ...prev, public: data.data.resume.isPublic }));
      },
    });
  };

  // ─── Share ────────────────────────────────────────────────────────────────
  const handleShare = () => {
    const resumeUrl = `${window.location.origin}/preview/${resumeId}`;
    if (navigator.share) {
      navigator.share({ url: resumeUrl, title: resumeData.title });
    } else {
      navigator.clipboard.writeText(resumeUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  const progressPercent = (activeSectionIndex / (sections.length - 1)) * 100;

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />

      <div className='max-w-7xl mx-auto px-4 py-6 mt-16'>
        <Link to='/dashboard' className='inline-flex gap-2 items-center text-muted-foreground hover:text-foreground transition-colors'>
          <ArrowLeft className='size-4' /> Back to Dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>

          {/* ── Left Panel ──────────────────────────────────────────── */}
          <div className='relative lg:col-span-5'>
            <div className='bg-card rounded-xl shadow-sm border border-border p-6 pt-4 relative overflow-hidden'>
              <div className='absolute top-0 left-0 right-0 h-1 bg-muted'>
                <div
                  className='h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500'
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Toolbar */}
              <div className='flex justify-between items-center mb-6 border-b border-border pb-3 pt-2'>
                <div className='flex items-center gap-2'>
                  {/* Phase 4 — Feature 1: Pass accentColor to TemplateSelector
                      so the live thumbnails reflect the current accent color */}
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    accentColor={resumeData.accent_color}
                    onChange={(template) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({ ...prev, accent_color: color }))
                    }
                  />
                  <div className='flex items-center gap-1'>
                    <Button
                      variant='ghost' size='icon'
                      onClick={undo} disabled={!canUndo}
                      className='h-8 w-8 text-muted-foreground hover:text-foreground'
                      title='Undo (Ctrl+Z)'
                    >
                      <Undo2 className='size-3.5' />
                    </Button>
                    <Button
                      variant='ghost' size='icon'
                      onClick={redo} disabled={!canRedo}
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
                    <Button variant='ghost' size='sm'
                      onClick={() => setActiveSectionIndex((p) => Math.max(p - 1, 0))}
                      className='text-muted-foreground'
                    >
                      <ChevronLeft className='size-4 mr-1' /> Prev
                    </Button>
                  )}
                  <Button variant='ghost' size='sm'
                    onClick={() =>
                      setActiveSectionIndex((p) => Math.min(p + 1, sections.length - 1))
                    }
                    disabled={activeSectionIndex === sections.length - 1}
                    className='text-muted-foreground'
                  >
                    Next <ChevronRight className='size-4 ml-1' />
                  </Button>
                </div>
              </div>

              {/* Section Indicators */}
              <div className='flex justify-center gap-2 mb-6'>
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSectionIndex(index)}
                      className={`p-2 rounded-lg transition-colors ${
                        index === activeSectionIndex
                          ? 'bg-primary text-primary-foreground'
                          : index < activeSectionIndex
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-muted text-muted-foreground'
                      }`}
                      title={section.name}
                    >
                      <Icon className='size-4' />
                    </button>
                  );
                })}
              </div>

              {/* Form Content */}
              <div className='space-y-6 min-h-[400px]'>
                {sections[activeSectionIndex].id === 'personal' && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, personal_info: data }))}
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {sections[activeSectionIndex].id === 'summary' && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, professional_summary: data }))}
                  />
                )}
                {sections[activeSectionIndex].id === 'experience' && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, experience: data }))}
                  />
                )}
                {sections[activeSectionIndex].id === 'education' && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, education: data }))}
                  />
                )}
                {sections[activeSectionIndex].id === 'projects' && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, project: data }))}
                  />
                )}
                {sections[activeSectionIndex].id === 'skills' && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, skills: data }))}
                  />
                )}
              </div>

              <Button
                onClick={handleManualSave}
                disabled={autosaveStatus === 'saving'}
                className='w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              >
                {autosaveStatus === 'saving'
                  ? <Loader2 className='size-4 animate-spin mr-2' />
                  : <Save className='size-4 mr-2' />
                }
                {autosaveStatus === 'saving' ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* ── Right Panel ─────────────────────────────────────────── */}
          <div className='lg:col-span-7 space-y-4'>
            <div className='flex items-center justify-end gap-2'>
              {resumeData.public && (
                <Button variant='outline' size='sm' onClick={handleShare}
                  className='bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                >
                  <Share2 className='size-4 mr-2' /> Share
                </Button>
              )}
              <Button variant='outline' size='sm'
                onClick={changeResumeVisibility}
                disabled={isTogglingVisibility}
                className='bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
              >
                {isTogglingVisibility
                  ? <Loader2 className='size-4 mr-2 animate-spin' />
                  : resumeData.public ? <Eye className='size-4 mr-2' /> : <EyeOff className='size-4 mr-2' />
                }
                {resumeData.public ? 'Public' : 'Private'}
              </Button>
              <Button variant='outline' size='sm'
                onClick={handleDownloadPdf}
                disabled={isExporting}
                className='bg-green-50 text-green-600 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 disabled:opacity-50'
              >
                {isExporting
                  ? <Loader2 className='size-4 mr-2 animate-spin' />
                  : <Download className='size-4 mr-2' />
                }
                {isExporting ? 'Generating…' : 'Download PDF'}
              </Button>
            </div>

            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />

            <CompletenessScore resumeData={resumeData} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
