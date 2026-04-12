import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload, FileText, X, Info, TrendingUp, Eye, Download, Calendar } from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/brand-icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateResume, useDeleteResume, useUpdateResumeTitle } from '@/hooks/resume/index';
import { useUploadResume, useImportFromLinkedIn } from '@/hooks/ai';
import { format } from 'date-fns';
import type { ResumeListItem } from '@/types';
import * as pdfjsLib from 'pdfjs-dist';
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker as string;

// ── CreateResumeModal ─────────────────────────────────────────────────────────
export const CreateResumeModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const { mutate: createResume, isPending } = useCreateResume();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createResume(title.trim(), { onSuccess: (data) => { setTitle(''); onClose(); if (data.data?.resume._id) navigate(`/app/builder/${data.data.resume._id}`); } });
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Create New Resume</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label htmlFor="title">Resume Title</Label><Input id="title" placeholder="e.g., Software Engineer Resume" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isPending} /></div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
            <Button type="submit" disabled={!title.trim() || isPending}>{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ── DeleteConfirmDialog ───────────────────────────────────────────────────────
export const DeleteConfirmDialog = ({ open, resume, onClose }: { open: boolean; resume: ResumeListItem | null; onClose: () => void }) => {
  const { mutate: deleteResume, isPending } = useDeleteResume();
  if (!resume) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Resume</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{resume.title}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" disabled={isPending} onClick={onClose}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => deleteResume(resume._id, { onSuccess: () => onClose() })}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── EditResumeModal ───────────────────────────────────────────────────────────
const EditForm = ({ resume, onClose }: { resume: ResumeListItem; onClose: () => void }) => {
  const [title, setTitle] = useState(resume.title);
  const { mutate: updateTitle, isPending } = useUpdateResumeTitle();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    updateTitle({ id: resume._id, title: title.trim() }, { onSuccess: () => onClose() });
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4"><div className="space-y-2"><Label htmlFor="edit-title">Resume Title</Label><Input id="edit-title" placeholder="Enter resume title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isPending} /></div></div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
        <Button type="submit" disabled={!title.trim() || isPending}>{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Changes</Button>
      </DialogFooter>
    </form>
  );
};
export const EditResumeModal = ({ open, resume, onClose }: { open: boolean; resume: ResumeListItem | null; onClose: () => void }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader><DialogTitle>Edit Resume Title</DialogTitle></DialogHeader>
      {resume && <EditForm key={resume._id} resume={resume} onClose={onClose} />}
    </DialogContent>
  </Dialog>
);

// ── UploadResumeModal ─────────────────────────────────────────────────────────
export const UploadResumeModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const { mutate: uploadResume, isPending } = useUploadResume();
  const handleDrag = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f?.type === 'application/pdf') setFile(f); }, []);
  const extractText = async (pdfFile: File): Promise<string> => {
    const ab = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
    const pages = await Promise.all(Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1).then((p) => p.getTextContent())));
    return pages.flatMap((c) => c.items.map((item) => ('str' in item ? item.str : ''))).join(' ');
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !file) return;
    const resumeText = await extractText(file);
    uploadResume({ title: title.trim(), resumeText }, { onSuccess: (data) => { setTitle(''); setFile(null); onClose(); if (data.data?.resumeId) navigate(`/app/builder/${data.data.resumeId}`); } });
  };
  return (
    <Dialog open={open} onOpenChange={() => { setTitle(''); setFile(null); onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Upload Existing Resume</DialogTitle></DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label htmlFor="upload-title">Resume Title</Label><Input id="upload-title" placeholder="e.g., My Professional Resume" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isPending} /></div>
            <div className="space-y-2">
              <Label>PDF File</Label>
              <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="text-left"><p className="font-medium text-foreground">{file.name}</p><p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p></div>
                    <button type="button" onClick={() => setFile(null)} className="p-1 rounded hover:bg-muted"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-foreground font-medium">Drag & drop your PDF here</p>
                    <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                    <input type="file" accept=".pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isPending} />
                  </>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
            <Button type="submit" disabled={!title.trim() || !file || isPending}>{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Upload</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ── LinkedInImportModal ───────────────────────────────────────────────────────
export const LinkedInImportModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const [linkedInText, setLinkedInText] = useState('');
  const { mutate: importLinkedIn, isPending } = useImportFromLinkedIn();
  const reset = () => { setTitle(''); setLinkedInText(''); onClose(); };
  const isReady = title.trim().length > 0 && linkedInText.length >= 50;
  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><LinkedinIcon className="h-5 w-5 text-[#0077B5]" />Import from LinkedIn</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); if (!isReady) return; importLinkedIn({ title: title.trim(), linkedInText }, { onSuccess: reset }); }}>
          <div className="space-y-4 py-4">
            <div className="flex gap-2.5 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground leading-relaxed">Go to your LinkedIn profile, select all text (Ctrl+A), copy it, and paste it below. Include About, Experience, Education, and Skills sections.</div>
            </div>
            <div className="space-y-2"><Label htmlFor="li-title">Resume Title</Label><Input id="li-title" placeholder="e.g., My LinkedIn Resume" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isPending} /></div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="li-text">LinkedIn Profile Text</Label>
                <span className={`text-xs ${linkedInText.length < 50 ? 'text-muted-foreground' : 'text-green-500'}`}>{linkedInText.length} chars {linkedInText.length < 50 ? `(need ${50 - linkedInText.length} more)` : '✓'}</span>
              </div>
              <textarea id="li-text" rows={10} value={linkedInText} onChange={(e) => setLinkedInText(e.target.value)} disabled={isPending} placeholder="Paste your LinkedIn profile text here…" className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-colors resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={reset} disabled={isPending}>Cancel</Button>
            <Button type="submit" disabled={!isReady || isPending}>{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isPending ? 'Importing…' : 'Import Profile'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ── ResumeAnalyticsModal ──────────────────────────────────────────────────────
export const ResumeAnalyticsModal = ({ open, resume, onClose }: { open: boolean; resume: ResumeListItem | null; onClose: () => void }) => {
  if (!resume) return null;
  const views = resume.views ?? 0, downloads = resume.downloads ?? 0;
  const total = views + downloads, rate = views > 0 ? Math.round((downloads / views) * 100) : 0;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Resume Analytics</DialogTitle></DialogHeader>
        <div className="py-4 space-y-4">
          <div className="px-1"><p className="text-sm font-semibold text-foreground truncate">{resume.title}</p><p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5"><Calendar className="h-3 w-3" />Last updated {format(new Date(resume.updatedAt), 'MMM d, yyyy')}</p></div>
          <div className="grid grid-cols-2 gap-3">
            {[{ icon: Eye, label: 'Total Views', value: views, color: 'bg-blue-500/10 text-blue-500' }, { icon: Download, label: 'Downloads', value: downloads, color: 'bg-green-500/10 text-green-500' }].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}><Icon className="h-6 w-6" /></div>
                <div><p className="text-2xl font-black font-display text-foreground">{value.toLocaleString()}</p><p className="text-xs text-muted-foreground font-medium">{label}</p></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[{ label: 'Total interactions', value: total }, { label: 'Download rate', value: `${rate}%` }].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl bg-secondary/50 border border-border text-center"><p className="text-lg font-bold text-foreground">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
            ))}
          </div>
          {!resume.isPublic && <div className="flex gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20"><TrendingUp className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" /><p className="text-xs text-muted-foreground">This resume is private. Make it public to start tracking views from shared links.</p></div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
