import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { resumeService } from '@/services/resume.service';
import type { UpdateResumePayload, ResumeData } from '@/types';

// ── useResumeById ─────────────────────────────────────────────────────────────
export const useResumeById = (resumeId: string) =>
  useQuery({
    queryKey: ['resume', resumeId],
    queryFn: () => resumeService.getResumeById(resumeId),
    enabled: !!resumeId,
  });

// ── usePublicResumeById ───────────────────────────────────────────────────────
export const usePublicResumeById = (resumeId: string) =>
  useQuery({
    queryKey: ['resume', 'public', resumeId],
    queryFn: () => resumeService.getPublicResumeById(resumeId),
    enabled: !!resumeId,
    staleTime: 1000 * 60 * 5,
  });

// ── useCreateResume ───────────────────────────────────────────────────────────
export const useCreateResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title: string) => resumeService.createResume(title),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['userResume'] });
      toast.success('Resume created successfully');
    },
    onError: () => toast.error('Failed to create resume'),
  });
};

// ── useUpdateResume ───────────────────────────────────────────────────────────
export const useUpdateResume = (resumeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateResumePayload) =>
      resumeService.updateResume(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
    },
    onError: () => toast.error('Failed to save resume'),
  });
};

// ── useDeleteResume ───────────────────────────────────────────────────────────
export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resumeId: string) => resumeService.deleteResume(resumeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['userResume'] });
      toast.success('Resume deleted successfully');
    },
    onError: () => toast.error('Failed to delete resume'),
  });
};

// ── useUpdateResumeTitle ──────────────────────────────────────────────────────
export const useUpdateResumeTitle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      resumeService.updateResumeTitle(id, title),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['userResume'] });
      toast.success('Title updated successfully');
    },
    onError: () => toast.error('Failed to update title'),
  });
};

// ── useToggleResumeVisibility ─────────────────────────────────────────────────
export const useToggleResumeVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resumeId: string) =>
      resumeService.toggleResumeVisibility(resumeId),
    onSuccess: (data, resumeId) => {
      void queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
      void queryClient.invalidateQueries({ queryKey: ['userResume'] });
      const isPublic = data.data?.resume.isPublic;
      toast.success(
        isPublic ? 'Resume is now public' : 'Resume is now private',
      );
    },
    onError: () => toast.error('Failed to toggle visibility'),
  });
};

// ── useExportResumePdf ────────────────────────────────────────────────────────
interface ExportPdfPayload {
  resumeId: string;
  fullName: string;
  resumeData: ResumeData;
}

export const useExportResumePdf = () =>
  useMutation({
    mutationFn: ({ resumeId, fullName, resumeData }: ExportPdfPayload) =>
      resumeService.exportResumePdf(resumeId, fullName, resumeData),
    onMutate: () => toast.loading('Generating PDF...', { id: 'pdf-export' }),
    onSuccess: () => toast.success('PDF downloaded!', { id: 'pdf-export' }),
    onError: () => toast.error('Failed to generate PDF', { id: 'pdf-export' }),
  });

// ── useExportResumePdfPublic ──────────────────────────────────────────────────
export const useExportResumePdfPublic = () =>
  useMutation({
    mutationFn: ({
      resumeId,
      fullName,
    }: {
      resumeId: string;
      fullName: string;
    }) => resumeService.exportResumePdfPublic(resumeId, fullName),
    onMutate: () => toast.loading('Generating PDF...', { id: 'pdf-export' }),
    onSuccess: () => toast.success('PDF downloaded!', { id: 'pdf-export' }),
    onError: () => toast.error('Failed to generate PDF', { id: 'pdf-export' }),
  });

// ── useDuplicateResume ────────────────────────────────────────────────────────
export const useDuplicateResume = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (resumeId: string) => resumeService.duplicateResume(resumeId),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ['userResume'] });
      toast.success('Resume duplicated successfully');
      if (data.data?.resume._id)
        navigate(`/app/builder/${data.data.resume._id}`);
    },
    onError: () => toast.error('Failed to duplicate resume'),
  });
};

// ── useRestoreVersion ─────────────────────────────────────────────────────────
export const useRestoreVersion = (resumeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (versionIndex: number) =>
      resumeService.restoreVersion(resumeId, versionIndex),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
      toast.success('Version restored successfully');
    },
    onError: () => toast.error('Failed to restore version'),
  });
};
