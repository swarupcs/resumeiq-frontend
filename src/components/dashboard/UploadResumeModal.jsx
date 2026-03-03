import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, FileText, X } from 'lucide-react';
import { useUploadResume } from '@/hooks/ai/useUploadResume.js';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';

// ✅ Use the bundled worker that Vite can resolve locally — avoids CDN fetch
// issues with pdfjs-dist v5 which changed the worker module format.
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker;

export const UploadResumeModal = ({ open, onClose }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const { mutate: uploadResume, isPending } = useUploadResume();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped?.type === 'application/pdf') setFile(dropped);
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const extractTextFromPdf = async (pdfFile) => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = await Promise.all(
      Array.from({ length: pdf.numPages }, (_, i) =>
        pdf.getPage(i + 1).then((page) => page.getTextContent()),
      ),
    );
    return pages
      .flatMap((content) => content.items.map((item) => item.str))
      .join(' ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !file) return;

    const resumeText = await extractTextFromPdf(file);

    uploadResume(
      { title: title.trim(), resumeText },
      {
        onSuccess: (data) => {
          resetAndClose();
          navigate(`/app/builder/${data.data.resumeId}`);
        },
      },
    );
  };

  const resetAndClose = () => {
    setTitle('');
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Upload Existing Resume</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='upload-title'>Resume Title</Label>
              <Input
                id='upload-title'
                placeholder='e.g., My Professional Resume'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className='space-y-2'>
              <Label>PDF File</Label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {file ? (
                  <div className='flex items-center justify-center gap-3'>
                    <FileText className='h-8 w-8 text-primary' />
                    <div className='text-left'>
                      <p className='font-medium text-foreground'>{file.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type='button'
                      onClick={() => setFile(null)}
                      className='p-1 rounded hover:bg-muted'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className='h-10 w-10 text-muted-foreground mx-auto mb-3' />
                    <p className='text-foreground font-medium'>
                      Drag & drop your PDF here
                    </p>
                    <p className='text-sm text-muted-foreground mt-1'>
                      or click to browse
                    </p>
                    <input
                      type='file'
                      accept='.pdf'
                      onChange={handleFileChange}
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                      disabled={isPending}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={resetAndClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={!title.trim() || !file || isPending}
            >
              {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Upload
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
