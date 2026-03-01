import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Upload,
  Loader2,
  FileText,
  Search,
  Filter,
  Grid3X3,
  List,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResumeCard } from '@/components/dashboard/ResumeCard';
import { CreateResumeModal } from '@/components/dashboard/CreateResumeModal';
import { UploadResumeModal } from '@/components/dashboard/UploadResumeModal';
import { EditResumeModal } from '@/components/dashboard/EditResumeModal';
import { DeleteConfirmDialog } from '@/components/dashboard/DeleteConfirmDialog';
import Navbar from '@/components/Navbar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

// ✅ Real hooks
import { useUserResume } from '@/hooks/user/useUserResume.js';
import { useCreateResume } from '@/hooks/resume/useCreateResume.js';
import { useDeleteResume } from '@/hooks/resume/useDeleteResume.js';
import { useQueryClient } from '@tanstack/react-query';
import { resumeService } from '@/services/resume.service.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [viewMode, setViewMode] = useState('grid');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

  // ── Queries ──
  const { data: resumes = [], isLoading } = useUserResume();

  // ── Mutations ──
  const { mutate: createResume, isPending: isCreating } = useCreateResume();
  const { mutate: deleteResume, isPending: isDeleting } = useDeleteResume();

  // ── Filter & sort ──
  const filteredResumes = useMemo(() => {
    return resumes
      .filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'created')
          return new Date(b.createdAt) - new Date(a.createdAt);
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
  }, [resumes, searchQuery, sortBy]);

  // ── Handlers ──
  const handleCreateResume = (title) => {
    createResume(title, {
      onSuccess: (data) => navigate(`/app/builder/${data.data.resume._id}`),
    });
  };

  const handleUploadResume = async (title, pdfText) => {
    try {
      const data = await resumeService.uploadResume({
        title,
        resumeText: pdfText,
      });
      toast.success('Resume uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['userResume'] });
      navigate(`/app/builder/${data.data.resume._id}`);
    } catch {
      toast.error('Failed to upload resume');
    }
  };

  const handleEditResume = async (id, title) => {
    try {
      await resumeService.updateResumeTitle(id, title);
      toast.success('Resume updated successfully');
      queryClient.invalidateQueries({ queryKey: ['userResume'] });
    } catch {
      toast.error('Failed to update resume');
    }
  };

  const handleDeleteResume = () => {
    if (!selectedResume) return;
    deleteResume(selectedResume._id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedResume(null);
      },
    });
  };

  const handleToggleVisibility = async (resume) => {
    try {
      await resumeService.toggleResumeVisibility(resume._id);
      toast.success('Resume visibility updated');
      queryClient.invalidateQueries({ queryKey: ['userResume'] });
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const handleShare = async (resume) => {
    const shareUrl = `${window.location.origin}/preview/${resume._id}`;
    await navigator.clipboard.writeText(shareUrl);
    toast.success('Resume link copied to clipboard');
  };

  const handlePreview = (resume) => navigate(`/preview/${resume._id}`);
  const handleCardClick = (resume) => navigate(`/app/builder/${resume._id}`);
  const handleDownload = (resume) =>
    navigate(`/app/builder/${resume._id}?download=true`);

  const openEditModal = (resume) => {
    setSelectedResume(resume);
    setEditModalOpen(true);
  };
  const openDeleteDialog = (resume) => {
    setSelectedResume(resume);
    setDeleteDialogOpen(true);
  };

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />

      <div className='pt-16'>
        {/* ── Unified sticky toolbar ── */}
        <div className='sticky top-16 z-10 bg-background/95 backdrop-blur-sm border-b border-border'>
          <div className='container mx-auto px-4'>
            {/* Top row */}
            <div className='flex items-center justify-between py-4'>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center'>
                  <FileText className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <h1 className='text-lg font-bold text-foreground leading-tight'>
                    My Resumes
                  </h1>
                  {!isLoading && (
                    <p className='text-xs text-muted-foreground'>
                      {resumes.length}{' '}
                      {resumes.length === 1 ? 'resume' : 'resumes'}
                    </p>
                  )}
                </div>
              </div>

              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setUploadModalOpen(true)}
                  className='gap-2 hidden sm:inline-flex'
                >
                  <Upload className='h-4 w-4' />
                  Upload
                </Button>
                <Button
                  size='sm'
                  onClick={() => setCreateModalOpen(true)}
                  disabled={isCreating}
                  className='gap-2'
                >
                  {isCreating ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <Plus className='h-4 w-4' />
                  )}
                  New Resume
                </Button>
              </div>
            </div>

            {/* Bottom row: search + filters */}
            {resumes.length > 0 && (
              <div className='flex gap-3 items-center pb-3'>
                <div className='relative flex-1'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                  <Input
                    placeholder='Search resumes...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-9 h-9 text-sm bg-secondary/50'
                  />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className='w-[130px] h-9 text-sm bg-secondary/50'>
                    <Filter className='h-3.5 w-3.5 mr-1.5 text-muted-foreground' />
                    <SelectValue placeholder='Sort by' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='updated'>Last Updated</SelectItem>
                    <SelectItem value='created'>Date Created</SelectItem>
                    <SelectItem value='title'>Title A–Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className='flex rounded-lg border border-border overflow-hidden'>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Grid3X3 className='h-3.5 w-3.5' />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <List className='h-3.5 w-3.5' />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Main content ── */}
        <main className='container mx-auto px-4 py-8'>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-32 gap-3'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <p className='text-sm text-muted-foreground'>
                Loading your resumes...
              </p>
            </div>
          ) : resumes.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-24 px-4'>
              <div className='relative mb-8'>
                <div className='absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150' />
                <div className='relative w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center'>
                  <FileText className='h-10 w-10 text-primary' />
                </div>
              </div>
              <h2 className='text-2xl font-bold text-foreground mb-2'>
                No resumes yet
              </h2>
              <p className='text-muted-foreground text-center max-w-sm mb-8'>
                Create your first AI-powered resume or upload an existing one to
                get started.
              </p>
              <div className='flex flex-col sm:flex-row gap-3'>
                <Button
                  variant='outline'
                  onClick={() => setUploadModalOpen(true)}
                  className='gap-2'
                >
                  <Upload className='h-4 w-4' /> Upload Existing
                </Button>
                <Button
                  onClick={() => setCreateModalOpen(true)}
                  className='gap-2'
                >
                  <Sparkles className='h-4 w-4' /> Create with AI
                </Button>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full max-w-2xl'>
                {[
                  {
                    icon: '✨',
                    title: 'AI-Powered',
                    desc: 'Smart content suggestions tailored to your role',
                  },
                  {
                    icon: '🎯',
                    title: 'ATS Optimized',
                    desc: 'Beat applicant tracking systems automatically',
                  },
                  {
                    icon: '⚡',
                    title: 'Ready in 2 min',
                    desc: 'Fast, professional results every time',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className='rounded-xl border border-border bg-card/50 p-4 text-center'
                  >
                    <div className='text-2xl mb-2'>{item.icon}</div>
                    <p className='text-sm font-semibold text-foreground mb-1'>
                      {item.title}
                    </p>
                    <p className='text-xs text-muted-foreground'>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredResumes.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 gap-2'>
              <Search className='h-8 w-8 text-muted-foreground/50' />
              <p className='text-foreground font-medium'>No results found</p>
              <p className='text-sm text-muted-foreground'>
                No resumes match "
                <span className='text-foreground'>{searchQuery}</span>"
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
                  onEdit={openEditModal}
                  onDelete={openDeleteDialog}
                  onClick={handleCardClick}
                  onShare={handleShare}
                  onDownload={handleDownload}
                  onPreview={handlePreview}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateResumeModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateResume}
      />
      <UploadResumeModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSubmit={handleUploadResume}
      />
      <EditResumeModal
        open={editModalOpen}
        resume={selectedResume}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedResume(null);
        }}
        onSubmit={handleEditResume}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        resume={selectedResume}
        loading={isDeleting}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedResume(null);
        }}
        onConfirm={handleDeleteResume}
      />
    </div>
  );
};

export default Dashboard;
