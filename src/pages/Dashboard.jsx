import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2, FileText, Search, Filter,
  Grid3X3, List, Sparkles, Plus, Upload,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ResumeCard } from '@/components/dashboard/ResumeCard';
import { CreateResumeModal } from '@/components/dashboard/CreateResumeModal';
import { UploadResumeModal } from '@/components/dashboard/UploadResumeModal';
import { EditResumeModal } from '@/components/dashboard/EditResumeModal';
import { DeleteConfirmDialog } from '@/components/dashboard/DeleteConfirmDialog';
import { LinkedInImportModal } from '@/components/dashboard/LinkedInImportModal';
import { ResumeAnalyticsModal } from '@/components/dashboard/ResumeAnalyticsModal';
import Navbar from '@/components/Navbar';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useUserResume } from '@/hooks/user/useUserResume.js';
import { useQueryClient } from '@tanstack/react-query';
import { resumeService } from '@/services/resume.service.js';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/authSlice.js';
import { useDuplicateResume } from '@/hooks/resume/useDuplicateResume.js';
import { Linkedin } from 'lucide-react';

const Dashboard = () => {
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();
  const user         = useSelector(selectCurrentUser);

  const [searchQuery, setSearchQuery]       = useState('');
  const [sortBy, setSortBy]                 = useState('updated');
  const [viewMode, setViewMode]             = useState('grid');
  const [createModalOpen, setCreateModalOpen]       = useState(false);
  const [uploadModalOpen, setUploadModalOpen]       = useState(false);
  const [linkedInModalOpen, setLinkedInModalOpen]   = useState(false);  // Phase 5 Feature 1
  const [renameModalOpen, setRenameModalOpen]       = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen]     = useState(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false); // Phase 5 Feature 3
  const [selectedResume, setSelectedResume]         = useState(null);

  const { data: resumes = [], isLoading } = useUserResume();
  const { mutate: duplicateResume }       = useDuplicateResume();

  const filteredResumes = useMemo(() => {
    return resumes
      .filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'title')   return a.title.localeCompare(b.title);
        if (sortBy === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
  }, [resumes, searchQuery, sortBy]);

  const handleToggleVisibility = async (resume) => {
    try {
      await resumeService.toggleResumeVisibility(resume._id);
      toast.success('Resume visibility updated');
      queryClient.invalidateQueries({ queryKey: ['userResume'] });
    } catch { toast.error('Failed to update visibility'); }
  };

  const handleShare = async (resume) => {
    if (!resume.isPublic) { toast.error('Make the resume public before sharing'); return; }
    const shareUrl = `${window.location.origin}/preview/${resume._id}`;
    await navigator.clipboard.writeText(shareUrl);
    toast.success('Resume link copied to clipboard');
  };

  const handleEdit      = (resume) => navigate(`/app/builder/${resume._id}`);
  const handlePreview   = (resume) => navigate(`/preview/${resume._id}`);
  const handleCardClick = (resume) => navigate(`/app/builder/${resume._id}`);
  const handleDownload  = (resume) => navigate(`/app/builder/${resume._id}?download=true`);
  const handleDuplicate = (resume) => duplicateResume(resume._id);

  // Phase 5 — Feature 3: Analytics
  const handleAnalytics = (resume) => {
    setSelectedResume(resume);
    setAnalyticsModalOpen(true);
  };

  const openRenameModal  = (resume) => { setSelectedResume(resume); setRenameModalOpen(true); };
  const openDeleteDialog = (resume) => { setSelectedResume(resume); setDeleteDialogOpen(true); };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />

      <div className='pt-16'>
        {/* Hero bar */}
        <div className='relative overflow-hidden border-b border-border bg-card/40'>
          <div className='absolute inset-0 bg-mesh opacity-20' />
          <div className='absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-primary/5 to-transparent' />
          <div className='container mx-auto px-4 py-8 relative z-10'>
            <div className='flex items-center justify-between gap-4 flex-wrap'>
              <div>
                <p className='text-sm text-muted-foreground font-medium mb-1'>
                  {greeting()}, {user?.firstName || 'there'} 👋
                </p>
                <h1 className='font-display text-2xl sm:text-3xl font-black text-foreground tracking-tight'>
                  My Resumes
                </h1>
                {!isLoading && resumes.length > 0 && (
                  <p className='text-sm text-muted-foreground mt-1'>
                    {resumes.length} resume{resumes.length !== 1 ? 's' : ''} ·{' '}
                    {resumes.filter((r) => r.isPublic).length} public
                  </p>
                )}
              </div>
              <div className='flex gap-2.5 flex-wrap'>
                {/* Phase 5 — Feature 1: LinkedIn import button */}
                <button
                  onClick={() => setLinkedInModalOpen(true)}
                  className='items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-secondary/60 hover:bg-secondary hover:border-[#0077B5]/40 text-sm font-medium text-foreground transition-all duration-200 hidden sm:flex'
                >
                  <Linkedin className='h-4 w-4 text-[#0077B5]' />
                  Import LinkedIn
                </button>
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className='items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-secondary/60 hover:bg-secondary hover:border-primary/30 text-sm font-medium text-foreground transition-all duration-200 hidden sm:flex'
                >
                  <Upload className='h-4 w-4' />
                  Upload PDF
                </button>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.02]'
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), oklch(0.65 0.28 305))',
                    boxShadow: '0 4px 16px oklch(0.72 0.22 280 / 0.3)',
                  }}
                >
                  <Plus className='h-4 w-4' /> New Resume
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        {resumes.length > 0 && (
          <div className='sticky top-16 z-10 bg-background/90 backdrop-blur-xl border-b border-border'>
            <div className='container mx-auto px-4'>
              <div className='flex gap-3 items-center py-3'>
                <div className='relative flex-1 max-w-sm'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                  <Input
                    placeholder='Search resumes...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-9 h-9 text-sm bg-secondary/50 border-border rounded-xl'
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className='w-[140px] h-9 text-sm bg-secondary/50 border-border rounded-xl'>
                    <Filter className='h-3.5 w-3.5 mr-1.5 text-muted-foreground' />
                    <SelectValue placeholder='Sort by' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='updated'>Last Updated</SelectItem>
                    <SelectItem value='created'>Date Created</SelectItem>
                    <SelectItem value='title'>Title A–Z</SelectItem>
                  </SelectContent>
                </Select>
                <div className='flex rounded-xl border border-border overflow-hidden'>
                  {[{ mode: 'grid', Icon: Grid3X3 }, { mode: 'list', Icon: List }].map(({ mode, Icon }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`p-2 transition-colors ${
                        viewMode === mode
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      <Icon className='h-3.5 w-3.5' />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <main className='container mx-auto px-4 py-8'>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-32 gap-4'>
              <div className='relative'>
                <div className='absolute inset-0 rounded-full bg-primary/15 blur-xl animate-pulse scale-150' />
                <Loader2 className='h-10 w-10 animate-spin text-primary relative z-10' />
              </div>
              <p className='text-sm text-muted-foreground animate-pulse'>Loading your resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 px-4'>
              <div className='relative mb-8'>
                <div className='absolute inset-0 bg-primary/15 rounded-3xl blur-2xl scale-150' />
                <div className='relative w-28 h-28 rounded-3xl bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/20 flex items-center justify-center'>
                  <FileText className='h-12 w-12 text-primary' />
                </div>
              </div>
              <h2 className='font-display text-2xl font-black text-foreground mb-2'>No resumes yet</h2>
              <p className='text-muted-foreground text-center max-w-sm mb-8 text-sm leading-relaxed'>
                Create your first AI-powered resume, upload an existing PDF, or import from LinkedIn.
              </p>
              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  onClick={() => setLinkedInModalOpen(true)}
                  className='flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#0077B5]/30 bg-[#0077B5]/5 hover:bg-[#0077B5]/10 text-sm font-medium text-foreground transition-all'
                >
                  <Linkedin className='h-4 w-4 text-[#0077B5]' /> Import LinkedIn
                </button>
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className='flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-secondary/60 hover:bg-secondary text-sm font-medium text-foreground transition-all'
                >
                  <Upload className='h-4 w-4' /> Upload PDF
                </button>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.02]'
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), oklch(0.65 0.28 305))',
                    boxShadow: '0 4px 16px oklch(0.72 0.22 280 / 0.3)',
                  }}
                >
                  <Sparkles className='h-4 w-4' /> Create with AI
                </button>
              </div>
            </div>
          ) : filteredResumes.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 gap-3'>
              <div className='w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center'>
                <Search className='h-7 w-7 text-muted-foreground/50' />
              </div>
              <p className='text-foreground font-semibold'>No results found</p>
              <p className='text-sm text-muted-foreground'>No resumes match "{searchQuery}"</p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                : 'flex flex-col gap-3'
            }>
              {filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                  onEdit={handleEdit}
                  onRename={openRenameModal}
                  onDelete={openDeleteDialog}
                  onClick={handleCardClick}
                  onShare={handleShare}
                  onDownload={handleDownload}
                  onPreview={handlePreview}
                  onToggleVisibility={handleToggleVisibility}
                  onDuplicate={handleDuplicate}
                  onAnalytics={handleAnalytics}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateResumeModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
      <UploadResumeModal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
      <LinkedInImportModal open={linkedInModalOpen} onClose={() => setLinkedInModalOpen(false)} />
      <EditResumeModal
        open={renameModalOpen}
        resume={selectedResume}
        onClose={() => { setRenameModalOpen(false); setSelectedResume(null); }}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        resume={selectedResume}
        onClose={() => { setDeleteDialogOpen(false); setSelectedResume(null); }}
      />
      <ResumeAnalyticsModal
        open={analyticsModalOpen}
        resume={selectedResume}
        onClose={() => { setAnalyticsModalOpen(false); setSelectedResume(null); }}
      />
    </div>
  );
};

export default Dashboard;
