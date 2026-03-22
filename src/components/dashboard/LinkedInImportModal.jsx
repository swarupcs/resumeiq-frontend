import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Linkedin, Info } from 'lucide-react';
import { useImportFromLinkedIn } from '@/hooks/ai/useImportFromLinkedIn.js';

// Phase 5 — Feature 1: LinkedIn import modal.
// User pastes their LinkedIn profile text (copy from the LinkedIn page or
// the "Save to PDF" export text). AI extracts it into the resume schema.
//
// How to get LinkedIn text:
//   1. Go to your LinkedIn profile
//   2. Select all text on the page (Ctrl+A) and copy, OR
//   3. Use LinkedIn's "Save to PDF" and paste the PDF text

export const LinkedInImportModal = ({ open, onClose }) => {
  const [title, setTitle]             = useState('');
  const [linkedInText, setLinkedInText] = useState('');
  const { mutate: importLinkedIn, isPending } = useImportFromLinkedIn();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !linkedInText.trim()) return;
    importLinkedIn(
      { title: title.trim(), linkedInText },
      { onSuccess: () => resetAndClose() }
    );
  };

  const resetAndClose = () => {
    setTitle('');
    setLinkedInText('');
    onClose();
  };

  const charCount = linkedInText.length;
  const isReady   = title.trim().length > 0 && charCount >= 50;

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Linkedin className='h-5 w-5 text-[#0077B5]' />
            Import from LinkedIn
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className='space-y-4 py-4'>
            {/* How-to hint */}
            <div className='flex gap-2.5 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20'>
              <Info className='h-4 w-4 text-blue-500 shrink-0 mt-0.5' />
              <div className='text-xs text-muted-foreground leading-relaxed'>
                Go to your LinkedIn profile, select all text on the page
                (Ctrl+A / Cmd+A), copy it, and paste it below. Include your
                About, Experience, Education, and Skills sections for best results.
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='li-title'>Resume Title</Label>
              <Input
                id='li-title'
                placeholder='e.g., My LinkedIn Resume'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='li-text'>LinkedIn Profile Text</Label>
                <span className={`text-xs ${charCount < 50 ? 'text-muted-foreground' : 'text-green-500'}`}>
                  {charCount} chars {charCount < 50 ? `(need ${50 - charCount} more)` : '✓'}
                </span>
              </div>
              <textarea
                id='li-text'
                rows={10}
                value={linkedInText}
                onChange={(e) => setLinkedInText(e.target.value)}
                disabled={isPending}
                placeholder='Paste your LinkedIn profile text here…'
                className='w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-colors resize-none'
              />
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={resetAndClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type='submit' disabled={!isReady || isPending}>
              {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {isPending ? 'Importing…' : 'Import Profile'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
