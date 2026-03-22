import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Eye, Download, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';

// Phase 5 — Feature 3: Per-resume analytics modal.
// Shows total views and downloads for a resume.
// Data comes from the resume object already loaded in the dashboard —
// no extra API call needed. views and downloads are tracked server-side
// via $inc on getPublicResumeById and exportResumePDF(Public).

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`flex items-center gap-4 p-4 rounded-xl border border-border bg-card`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className='h-6 w-6' />
    </div>
    <div>
      <p className='text-2xl font-black font-display text-foreground'>
        {(value ?? 0).toLocaleString()}
      </p>
      <p className='text-xs text-muted-foreground font-medium'>{label}</p>
    </div>
  </div>
);

export const ResumeAnalyticsModal = ({ open, resume, onClose }) => {
  if (!resume) return null;

  const views     = resume.views     ?? 0;
  const downloads = resume.downloads ?? 0;
  const total     = views + downloads;

  // Simple engagement rate — what % of viewers also downloaded
  const downloadRate = views > 0
    ? Math.round((downloads / views) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <TrendingUp className='h-5 w-5 text-primary' />
            Resume Analytics
          </DialogTitle>
        </DialogHeader>

        <div className='py-4 space-y-4'>
          {/* Resume title */}
          <div className='px-1'>
            <p className='text-sm font-semibold text-foreground truncate'>{resume.title}</p>
            <p className='text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5'>
              <Calendar className='h-3 w-3' />
              Last updated {format(new Date(resume.updatedAt), 'MMM d, yyyy')}
            </p>
          </div>

          {/* Stat cards */}
          <div className='grid grid-cols-2 gap-3'>
            <StatCard
              icon={Eye}
              label='Total Views'
              value={views}
              color='bg-blue-500/10 text-blue-500'
            />
            <StatCard
              icon={Download}
              label='Downloads'
              value={downloads}
              color='bg-green-500/10 text-green-500'
            />
          </div>

          {/* Summary row */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='p-3 rounded-xl bg-secondary/50 border border-border text-center'>
              <p className='text-lg font-bold text-foreground'>{total.toLocaleString()}</p>
              <p className='text-xs text-muted-foreground'>Total interactions</p>
            </div>
            <div className='p-3 rounded-xl bg-secondary/50 border border-border text-center'>
              <p className='text-lg font-bold text-foreground'>{downloadRate}%</p>
              <p className='text-xs text-muted-foreground'>Download rate</p>
            </div>
          </div>

          {/* Visibility note */}
          {!resume.isPublic && (
            <div className='flex gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20'>
              <TrendingUp className='h-4 w-4 text-amber-500 shrink-0 mt-0.5' />
              <p className='text-xs text-muted-foreground'>
                This resume is private. Make it public to start tracking views from shared links.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
