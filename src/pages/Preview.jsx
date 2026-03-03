import { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  Loader2,
  FileX,
  Download,
  Share2,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Check,
  ExternalLink,
  Mail,
  Linkedin,
  Twitter,
  QrCode,
  Eye,
  Palette,
  Layout,
  ChevronDown,
} from 'lucide-react';
import ResumePreview from '@/components/builder/ResumePreview';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { usePublicResumeById } from '@/hooks/resume/usePublicResumeById.js';
import { useExportResumePdfPublic } from '@/hooks/resume/useExportResumePdfPublic.js';

const templates = [
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'minimal-image', name: 'Minimal Image' },
  { id: 'executive', name: 'Executive' },
  { id: 'creative', name: 'Creative' },
  { id: 'professional', name: 'Professional' },
];

const accentColors = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Indigo', value: '#6366F1' },
];

const Preview = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [zoom, setZoom] = useState(100);
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const [viewCount] = useState(() => Math.floor(Math.random() * 500) + 50);

  const previewRef = useRef(null);

  const { data: response, isLoading, isError } = usePublicResumeById(resumeId);
  const resumeData = response?.data?.resume ?? null;

  const { mutate: exportPdf, isPending: isDownloading } =
    useExportResumePdfPublic();

  // Initialize template and color from server data on first load.
  // After that the user can override them via the dropdowns.
  // Using null as sentinel so we can detect "not yet initialized".
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewColor, setPreviewColor] = useState(null);

  // Resolved values — falls back to resume data or defaults until state is set
  const activeTemplate = previewTemplate ?? resumeData?.template ?? 'classic';
  const activeColor = previewColor ?? resumeData?.accent_color ?? '#3B82F6';

  const handleZoomIn = () => setZoom((p) => Math.min(p + 10, 150));
  const handleZoomOut = () => setZoom((p) => Math.max(p - 10, 50));
  const handleResetZoom = () => setZoom(100);
  const handlePrint = () => window.print();

  const handleDownload = () => {
    exportPdf({
      resumeId,
      fullName: resumeData?.personal_info?.full_name,
    });
  };

  const shareUrl = `${window.location.origin}/preview/${resumeId}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resumeData?.title || 'Resume',
          text: `Check out ${resumeData?.personal_info?.full_name}'s resume`,
          url: shareUrl,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(
      `${resumeData?.personal_info?.full_name}'s Resume`,
    );
    const body = encodeURIComponent(`Check out this resume: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleLinkedInShare = () =>
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
    );

  const handleTwitterShare = () => {
    const text = encodeURIComponent(
      `Check out ${resumeData?.personal_info?.full_name}'s resume!`,
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
    );
  };

  const handleFullscreen = () => {
    if (!previewRef.current) return;
    document.fullscreenElement
      ? document.exitFullscreen()
      : previewRef.current.requestFullscreen();
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-muted/30 flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='h-10 w-10 animate-spin text-primary' />
          <p className='text-muted-foreground'>Loading resume...</p>
        </div>
      </div>
    );
  }

  if (isError || !resumeData) {
    return (
      <div className='min-h-screen bg-background flex flex-col items-center justify-center px-4'>
        <div className='text-center'>
          <div className='w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6'>
            <FileX className='h-10 w-10 text-muted-foreground' />
          </div>
          <h1 className='text-4xl md:text-6xl font-bold text-muted-foreground mb-4'>
            Resume Not Found
          </h1>
          <p className='text-muted-foreground mb-8 max-w-md'>
            This resume may be private or doesn't exist. Please check the link
            and try again.
          </p>
          <Button asChild>
            <Link to='/'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Go to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-muted/30'>
      {/* Header hidden on PDF export */}
      <div
        data-hide-on-export
        className='bg-background border-b border-border sticky top-0 z-20'
      >
        <div className='max-w-7xl mx-auto px-4 py-3'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-4 min-w-0'>
              <Link
                to='/'
                className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors shrink-0'
              >
                <ArrowLeft className='size-4' />
                <span className='hidden sm:inline'>Home</span>
              </Link>
              <div className='min-w-0'>
                <h1 className='font-semibold text-foreground truncate'>
                  {resumeData.personal_info?.full_name || resumeData.title}
                </h1>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <span className='px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'>
                    Public
                  </span>
                  <span className='flex items-center gap-1'>
                    <Eye className='size-3' /> {viewCount} views
                  </span>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              {/* Template Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='hidden md:flex gap-2'
                  >
                    <Layout className='size-4' />
                    Template
                    <ChevronDown className='size-3' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  {templates.map((t) => (
                    <DropdownMenuItem
                      key={t.id}
                      onClick={() => setPreviewTemplate(t.id)}
                      className={activeTemplate === t.id ? 'bg-primary/10' : ''}
                    >
                      {t.name}
                      {activeTemplate === t.id && (
                        <Check className='size-4 ml-auto' />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Color Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='hidden md:flex gap-2'
                  >
                    <Palette className='size-4' />
                    <div
                      className='size-4 rounded-full border border-border'
                      style={{ backgroundColor: activeColor }}
                    />
                    <ChevronDown className='size-3' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <div className='grid grid-cols-4 gap-2 p-2'>
                    {accentColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setPreviewColor(color.value)}
                        className={`size-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          activeColor === color.value
                            ? 'border-foreground scale-110'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Share */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm' className='gap-2'>
                    <Share2 className='size-4' />
                    <span className='hidden sm:inline'>Share</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuItem onClick={handleCopyLink}>
                    {copied ? (
                      <Check className='size-4 mr-2' />
                    ) : (
                      <Copy className='size-4 mr-2' />
                    )}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}>
                    <ExternalLink className='size-4 mr-2' /> Share via...
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleEmailShare}>
                    <Mail className='size-4 mr-2' /> Share via Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLinkedInShare}>
                    <Linkedin className='size-4 mr-2' /> Share on LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleTwitterShare}>
                    <Twitter className='size-4 mr-2' /> Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowQRModal(true)}>
                    <QrCode className='size-4 mr-2' /> Show QR Code
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant='outline'
                size='sm'
                onClick={handlePrint}
                className='hidden sm:flex gap-2'
              >
                <Printer className='size-4' />
                <span className='hidden md:inline'>Print</span>
              </Button>

              <Button
                size='sm'
                onClick={handleDownload}
                disabled={isDownloading}
                className='gap-2'
              >
                {isDownloading ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  <Download className='size-4' />
                )}
                <span className='hidden sm:inline'>Download PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Controls hidden on PDF export */}
      <div
        data-hide-on-export
        className='fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-background/95 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg'
      >
        <Button
          variant='ghost'
          size='icon'
          onClick={handleZoomOut}
          disabled={zoom <= 50}
          className='size-8'
        >
          <ZoomOut className='size-4' />
        </Button>
        <button
          onClick={handleResetZoom}
          className='text-sm font-medium min-w-[4rem] text-center hover:text-primary transition-colors'
        >
          {zoom}%
        </button>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleZoomIn}
          disabled={zoom >= 150}
          className='size-8'
        >
          <ZoomIn className='size-4' />
        </Button>
        <div className='w-px h-6 bg-border mx-1' />
        <Button
          variant='ghost'
          size='icon'
          onClick={handleFullscreen}
          className='size-8'
        >
          <Maximize2 className='size-4' />
        </Button>
      </div>

      {/* Resume Preview */}
      <div className='py-10 px-4 flex justify-center'>
        <div
          ref={previewRef}
          data-resume-ready
          className='transition-transform duration-200 origin-top'
          style={{
            transform: `scale(${zoom / 100})`,
            width: '100%',
            maxWidth: '800px',
          }}
        >
          <ResumePreview
            data={resumeData}
            template={activeTemplate}
            accentColor={activeColor}
          />
        </div>
      </div>

      {/* CTA hidden on PDF export */}
      <div data-hide-on-export className='fixed bottom-6 right-6 z-10'>
        <Button onClick={() => navigate('/signup')} className='shadow-lg gap-2'>
          Create Your Resume
          <ArrowLeft className='size-4 rotate-180' />
        </Button>
      </div>

      {/* QR Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Share via QR Code</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col items-center gap-4 py-6'>
            <div className='bg-white p-6 rounded-xl shadow-sm'>
              <QRCodeSVG
                value={shareUrl}
                size={192}
                level='H'
                bgColor='#ffffff'
                fgColor='#000000'
              />
            </div>
            <p className='text-sm text-muted-foreground text-center max-w-xs'>
              Scan this QR code to view the resume on another device
            </p>
            <div className='flex items-center gap-2 w-full'>
              <input
                type='text'
                value={shareUrl}
                readOnly
                className='flex-1 text-sm bg-muted px-3 py-2 rounded-lg truncate'
              />
              <Button variant='outline' size='sm' onClick={handleCopyLink}>
                {copied ? (
                  <Check className='size-4' />
                ) : (
                  <Copy className='size-4' />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Preview;
