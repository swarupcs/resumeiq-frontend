import { Pencil, Trash2, FileText, Share2, Download, Eye, Globe, Lock, MoreVertical, Calendar, Edit3, Copy, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown';
import { Badge } from '@/components/ui/primitives';
import type { ResumeListItem } from '@/types';

interface ResumeCardProps {
  resume: ResumeListItem;
  onEdit: (r: ResumeListItem) => void;
  onRename: (r: ResumeListItem) => void;
  onDelete: (r: ResumeListItem) => void;
  onClick: (r: ResumeListItem) => void;
  onShare: (r: ResumeListItem) => void;
  onDownload: (r: ResumeListItem) => void;
  onPreview: (r: ResumeListItem) => void;
  onToggleVisibility: (r: ResumeListItem) => void;
  onDuplicate: (r: ResumeListItem) => void;
  onAnalytics: (r: ResumeListItem) => void;
}

export const ResumeCard = ({ resume, onEdit, onRename, onDelete, onClick, onShare, onDownload, onPreview, onToggleVisibility, onDuplicate, onAnalytics }: ResumeCardProps) => (
  <div onClick={() => onClick(resume)} className="group relative rounded-2xl border border-border bg-card cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-transparent overflow-hidden shine">
    <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(271 76% 53%))', opacity: 0.6 }} />
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <Badge variant={resume.isPublic ? 'default' : 'secondary'} className={`text-xs gap-1 rounded-lg px-2.5 py-1 font-medium ${resume.isPublic ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-secondary text-muted-foreground border border-border'}`}>
          {resume.isPublic ? <><Globe className="h-3 w-3" />Public</> : <><Lock className="h-3 w-3" />Private</>}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary opacity-0 group-hover:opacity-100 transition-all duration-200"><MoreVertical className="h-4 w-4" /></button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => onEdit(resume)} className="gap-2 font-medium"><Edit3 className="h-4 w-4" />Edit Resume</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPreview(resume)} className="gap-2"><Eye className="h-4 w-4" />Preview</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRename(resume)} className="gap-2"><Pencil className="h-4 w-4" />Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(resume)} className="gap-2"><Copy className="h-4 w-4" />Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAnalytics(resume)} className="gap-2"><BarChart2 className="h-4 w-4" />Analytics</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDownload(resume)} className="gap-2"><Download className="h-4 w-4" />Download PDF</DropdownMenuItem>
            {resume.isPublic && <DropdownMenuItem onClick={() => onShare(resume)} className="gap-2"><Share2 className="h-4 w-4" />Share Link</DropdownMenuItem>}
            <DropdownMenuItem onClick={() => onToggleVisibility(resume)} className="gap-2">
              {resume.isPublic ? <><Lock className="h-4 w-4" />Make Private</> : <><Globe className="h-4 w-4" />Make Public</>}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(resume)} className="text-destructive focus:text-destructive gap-2"><Trash2 className="h-4 w-4" />Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/15">
        <FileText className="h-6 w-6 text-primary" />
        {resume.accent_color && <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card shadow-sm" style={{ backgroundColor: resume.accent_color }} />}
      </div>
      <h3 className="font-display font-bold text-foreground mb-1 line-clamp-1 text-base">{resume.title}</h3>
      {resume.template && <p className="text-xs text-muted-foreground mb-1 capitalize font-medium">{resume.template} template</p>}
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{(resume.views ?? 0).toLocaleString()}</span>
        <span className="flex items-center gap-1"><Download className="h-3 w-3" />{(resume.downloads ?? 0).toLocaleString()}</span>
        <span className="flex items-center gap-1 ml-auto"><Calendar className="h-3 w-3" />{format(new Date(resume.updatedAt), 'MMM d')}</span>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
        <button onClick={(e) => { e.stopPropagation(); onEdit(resume); }} className="flex-1 py-2 px-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-primary/20"><Edit3 className="h-3.5 w-3.5" />Edit</button>
        <button onClick={(e) => { e.stopPropagation(); onPreview(resume); }} className="flex-1 py-2 px-3 rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary text-xs font-medium text-foreground transition-colors flex items-center justify-center gap-1.5 border border-border"><Eye className="h-3.5 w-3.5" />Preview</button>
      </div>
    </div>
  </div>
);
