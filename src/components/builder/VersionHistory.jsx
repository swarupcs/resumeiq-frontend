import { useState } from 'react';
import { History, RotateCcw, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRestoreVersion } from '@/hooks/resume/useRestoreVersion.js';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Phase 5 — Feature 5: Version history panel.
// Shows up to 10 saved snapshots. Clicking "Restore" on a version:
//   1. Shows a confirmation dialog (current work will be saved as a version first)
//   2. Calls POST /resume/:id/restore/:versionIndex on the backend
//   3. Invalidates the resume query so the builder reloads with restored data

const VersionHistory = ({ resumeId, versions = [] }) => {
  const [expanded, setExpanded]           = useState(false);
  const [confirmIndex, setConfirmIndex]   = useState(null);
  const { mutate: restoreVersion, isPending } = useRestoreVersion(resumeId);

  const handleRestore = (index) => {
    restoreVersion(index, {
      onSuccess: () => setConfirmIndex(null),
    });
  };

  if (versions.length === 0) return null;

  return (
    <>
      <div className='rounded-xl border border-border bg-card overflow-hidden'>
        {/* Header */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className='w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/40 transition-colors'
        >
          <div className='flex items-center gap-2'>
            <History className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-semibold text-foreground'>Version History</span>
            <span className='text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full'>
              {versions.length}
            </span>
          </div>
          {expanded
            ? <ChevronUp className='h-4 w-4 text-muted-foreground' />
            : <ChevronDown className='h-4 w-4 text-muted-foreground' />
          }
        </button>

        {expanded && (
          <div className='px-4 pb-4 space-y-2'>
            <p className='text-xs text-muted-foreground mb-3'>
              Your current state is automatically saved before restoring a version.
            </p>
            {/* Newest first */}
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
                        month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
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
                    <RotateCcw className='h-3 w-3 mr-1' /> Restore
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm restore dialog */}
      <AlertDialog
        open={confirmIndex !== null}
        onOpenChange={(open) => { if (!open) setConfirmIndex(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this version?</AlertDialogTitle>
            <AlertDialogDescription>
              Your current resume content will be saved as a new version before
              restoring, so you won't lose any work. The builder will reload
              with the restored content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleRestore(confirmIndex)}
              disabled={isPending}
            >
              {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Restore Version
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VersionHistory;
