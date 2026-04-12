import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useResendVerification } from '@/hooks/auth/useEmailVerification';
import { toast } from 'sonner';
import { BrandLink } from '@/components/BrandLink';

export const VerifyEmail = () => {
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? '';
  const [cooldown, setCooldown] = useState(0);
  const [resent, setResent] = useState(false);
  const { mutate: resend, isPending } = useResendVerification();
  
  const startCooldown = () => {
    setCooldown(60);
    const id = setInterval(
      () =>
        setCooldown((p) => {
          if (p <= 1) {
            clearInterval(id);
            return 0;
          }
          return p - 1;
        }),
      1000,
    );
  };
  
  const handleResend = () => {
    if (!email || cooldown > 0) return;
    resend(email, {
      onSuccess: () => {
        setResent(true);
        startCooldown();
        toast.success('Verification email sent!');
      },
      onError: () => toast.error('Failed to resend.'),
    });
  };
  
  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-background flex items-center justify-center px-4 pt-16'>
        <div className='w-full max-w-md text-center'>
          <BrandLink />
          <div className='w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6'>
            <Mail className='h-10 w-10 text-primary' />
          </div>
          <h2 className='font-display text-2xl font-black text-foreground mb-3'>
            Check your inbox
          </h2>
          <p className='text-muted-foreground mb-2'>
            We sent a verification link to
          </p>
          {email && (
            <p className='font-semibold text-foreground mb-6'>{email}</p>
          )}
          <p className='text-sm text-muted-foreground mb-8 max-w-sm mx-auto'>
            Click the link in the email to verify your account. The link expires
            in 24 hours.
          </p>
          {resent && (
            <div className='flex items-center justify-center gap-2 text-sm text-green-500 mb-4'>
              <CheckCircle2 className='h-4 w-4' />
              Email sent! Check your inbox.
            </div>
          )}
          <button
            onClick={handleResend}
            disabled={isPending || cooldown > 0 || !email}
            className='inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isPending ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <RefreshCw className='h-4 w-4' />
            )}
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : isPending
                ? 'Sending…'
                : 'Resend verification email'}
          </button>
          <div className='mt-8 pt-6 border-t border-border'>
            <p className='text-sm text-muted-foreground'>
              Already verified?{' '}
              <Link
                to='/login'
                className='text-primary hover:text-primary/80 font-semibold'
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
