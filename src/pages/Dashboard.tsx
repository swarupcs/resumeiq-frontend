import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  FileText,
  Search,
  Plus,
  Upload,
  Grid3X3,
  List,
  Filter,
} from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/brand-icons';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/primitives';
import { ResumeCard } from '@/components/dashboard/ResumeCard';
import {
  CreateResumeModal,
  UploadResumeModal,
  EditResumeModal,
  DeleteConfirmDialog,
  LinkedInImportModal,
  ResumeAnalyticsModal,
} from '@/components/dashboard/Modals';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { useUserResumes } from '@/hooks/user/useUserResumes';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/authSlice';
import {
  useDuplicateResume,
  useToggleResumeVisibility,
} from '@/hooks/resume/index';
import { resumeService } from '@/services/resume.service';
import { useQueryClient } from '@tanstack/react-query';
import type { ResumeListItem } from '@/types';

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector(selectCurrentUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [linkedInModalOpen, setLinkedInModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<ResumeListItem | null>(
    null,
  );

  const { data: resumes = [], isLoading } = useUserResumes();
  const { mutate: duplicateResume } = useDuplicateResume();
  const { mutate: toggleVisibility } = useToggleResumeVisibility();

  const filteredResumes = useMemo(() => {
    return [...resumes]
      .filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'created')
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
  }, [resumes, searchQuery, sortBy]);

  const handleToggleVisibility = (resume: ResumeListItem) => {
    toggleVisibility(resume._id, {
      onSuccess: () =>
        void queryClient.invalidateQueries({ queryKey: ['userResume'] }),
      onError: () => toast.error('Failed to update visibility'),
    });
  };

  const handleShare = async (resume: ResumeListItem) => {
    if (!resume.isPublic) {
      toast.error('Make the resume public before sharing');
      return;
    }
    const shareUrl = `${window.location.origin}/preview/${resume._id}`;
    await navigator.clipboard.writeText(shareUrl);
    toast.success('Resume link copied to clipboard');
  };

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
        <div className='relative overflow-hidden border-b border-border bg-card/40'>
          <div className='absolute inset-0 bg-mesh opacity-20' />
          <div className='container mx-auto px-4 py-8 relative z-10'>
            <div className='flex items-center justify-between gap-4 flex-wrap'>
              <div>
                <p className='text-sm text-muted-foreground font-medium mb-1'>
                  {greeting()}, {user?.firstName ?? 'there'} 👋
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
                <button
                  onClick={() => setLinkedInModalOpen(true)}
                  className='hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-secondary/60 hover:bg-secondary text-sm font-medium text-foreground transition-all'
                >
                  <LinkedinIcon className='h-4 w-4 text-[#0077B5]' />
                  Import LinkedIn
                </button>
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className='hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-secondary/60 hover:bg-secondary text-sm font-medium text-foreground transition-all'
                >
                  <Upload className='h-4 w-4' />
                  Upload PDF
                </button>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:scale-[1.02]'
                  style={{
                    background:
                      'linear-gradient(135deg, hsl(var(--primary)), hsl(271 76% 53%))',
                    boxShadow: '0 4px 16px hsl(var(--primary) / 0.3)',
                  }}
                >
                  <Plus className='h-4 w-4' />
                  New Resume
                </button>
              </div>
            </div>
          </div>
        </div>

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
                    className='pl-9 h-9 text-sm bg-secondary/50 rounded-xl'
                  />
                </div>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Filter className='h-3.5 w-3.5' />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectItem value='updated'>Last Updated</SelectItem>
                    <SelectItem value='created'>Date Created</SelectItem>
                    <SelectItem value='title'>Title A–Z</SelectItem>
                  </Select>
                </div>
                <div className='flex rounded-xl border border-border overflow-hidden'>
                  {(['grid', 'list'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`p-2 transition-colors ${viewMode === mode ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}
                    >
                      {mode === 'grid' ? (
                        <Grid3X3 className='h-3.5 w-3.5' />
                      ) : (
                        <List className='h-3.5 w-3.5' />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <main className='container mx-auto px-4 py-8'>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-32 gap-4'>
              <Loader2 className='h-10 w-10 animate-spin text-primary' />
              <p className='text-sm text-muted-foreground animate-pulse'>
                Loading your resumes...
              </p>
            </div>
          ) : resumes.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 px-4'>
              <div className='w-28 h-28 rounded-3xl bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/20 flex items-center justify-center mb-8'>
                <FileText className='h-12 w-12 text-primary' />
              </div>
              <h2 className='font-display text-2xl font-black text-foreground mb-2'>
                No resumes yet
              </h2>
              <p className='text-muted-foreground text-center max-w-sm mb-8 text-sm leading-relaxed'>
                Create your first AI-powered resume, upload an existing PDF, or
                import from LinkedIn.
              </p>
              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  onClick={() => setLinkedInModalOpen(true)}
                  className='flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#0077B5]/30 bg-[#0077B5]/5 hover:bg-[#0077B5]/10 text-sm font-medium text-foreground'
                >
                  <LinkedinIcon className='h-4 w-4 text-[#0077B5]' />
                  Import LinkedIn
                </button>
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className='flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-secondary/60 hover:bg-secondary text-sm font-medium text-foreground'
                >
                  <Upload className='h-4 w-4' />
                  Upload PDF
                </button>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold'
                  style={{
                    background:
                      'linear-gradient(135deg, hsl(var(--primary)), hsl(271 76% 53%))',
                  }}
                >
                  <Plus className='h-4 w-4' />
                  New Resume
                </button>
              </div>
            </div>
          ) : filteredResumes.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 gap-3'>
              <Search className='h-10 w-10 text-muted-foreground/40' />
              <p className='text-foreground font-semibold'>No results found</p>
              <p className='text-sm text-muted-foreground'>
                No resumes match "{searchQuery}"
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                  : 'flex flex-col gap-3'
              }
            >
              {filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                  onEdit={(r) => navigate(`/app/builder/${r._id}`)}
                  onRename={(r) => {
                    setSelectedResume(r);
                    setRenameModalOpen(true);
                  }}
                  onDelete={(r) => {
                    setSelectedResume(r);
                    setDeleteDialogOpen(true);
                  }}
                  onClick={(r) => navigate(`/app/builder/${r._id}`)}
                  onShare={handleShare}
                  onDownload={(r) =>
                    navigate(`/app/builder/${r._id}?download=true`)
                  }
                  onPreview={(r) => navigate(`/preview/${r._id}`)}
                  onToggleVisibility={handleToggleVisibility}
                  onDuplicate={(r) => duplicateResume(r._id)}
                  onAnalytics={(r) => {
                    setSelectedResume(r);
                    setAnalyticsModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <CreateResumeModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <UploadResumeModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
      <LinkedInImportModal
        open={linkedInModalOpen}
        onClose={() => setLinkedInModalOpen(false)}
      />
      <EditResumeModal
        open={renameModalOpen}
        resume={selectedResume}
        onClose={() => {
          setRenameModalOpen(false);
          setSelectedResume(null);
        }}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        resume={selectedResume}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedResume(null);
        }}
      />
      <ResumeAnalyticsModal
        open={analyticsModalOpen}
        resume={selectedResume}
        onClose={() => {
          setAnalyticsModalOpen(false);
          setSelectedResume(null);
        }}
      />
    </div>
  );
};

export default Dashboard;
