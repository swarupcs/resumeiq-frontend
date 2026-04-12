import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useVerifyEmail } from '@/hooks/auth/useEmailVerification';
import { BrandLink } from '@/components/BrandLink';

export const EmailVerified = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [errorMsg, setErrorMsg] = useState('');
  const { mutate: verifyEmail } = useVerifyEmail();
  
  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        setStatus('error');
        setErrorMsg('No verification token found in the URL.');
      }, 0);
      return;
    }
    verifyEmail(token, {
      onSuccess: () => setStatus('success'),
      onError: (err) => {
        setStatus('error');
        setErrorMsg(
          err.message || 'Verification link is invalid or has expired.',
        );
      },
    });
  }, [token, verifyEmail]);
  
  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-background flex items-center justify-center px-4 pt-16'>
        <div className='w-full max-w-md text-center'>
          <BrandLink />
          {status === 'loading' && (
            <>
              <div className='w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6'>
                <Loader2 className='h-10 w-10 text-primary animate-spin' />
              </div>
              <h2 className='font-display text-2xl font-black text-foreground mb-2'>
                Verifying your email…
              </h2>
              <p className='text-muted-foreground'>Please wait a moment.</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className='w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6'>
                <CheckCircle2 className='h-10 w-10 text-green-500' />
              </div>
              <h2 className='font-display text-2xl font-black text-foreground mb-3'>
                Email verified!
              </h2>
              <p className='text-muted-foreground mb-8'>
                Your account is now active. You can sign in and start building
                your resume.
              </p>
              <button
                onClick={() => navigate('/login')}
                className='inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.02]'
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--primary)), hsl(271 76% 53%))',
                }}
              >
                Go to Login
              </button>
            </>
          )}
          {status === 'error' && (
            <>
              <div className='w-20 h-20 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-6'>
                <XCircle className='h-10 w-10 text-destructive' />
              </div>
              <h2 className='font-display text-2xl font-black text-foreground mb-3'>
                Verification failed
              </h2>
              <p className='text-muted-foreground mb-6'>{errorMsg}</p>
              <Link
                to='/login'
                className='inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-border bg-secondary/60 text-sm font-medium text-foreground mr-3'
              >
                Back to Login
              </Link>
              <Link
                to='/verify-email'
                className='inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-white text-sm'
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--primary)), hsl(271 76% 53%))',
                }}
              >
                Resend Verification
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};
