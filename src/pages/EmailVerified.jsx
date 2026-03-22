import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useVerifyEmail } from '@/hooks/auth/useEmailVerification';

// Shown when user clicks the email verification link.
// URL: /email-verified?token=<raw_token>
// Calls GET /auth/verify-email/:token on mount.

const EmailVerified = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const token          = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const { mutate: verifyEmail } = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('No verification token found in the URL.');
      return;
    }

    verifyEmail(token, {
      onSuccess: () => setStatus('success'),
      onError:   (err) => {
        setStatus('error');
        setErrorMsg(err.message || 'Verification link is invalid or has expired.');
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-background flex items-center justify-center px-4 pt-16'>
        <div className='w-full max-w-md text-center'>

          {/* Brand */}
          <Link to='/' className='inline-flex items-center gap-2.5 mb-8'>
            <div className='relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary to-purple-600' />
              <Sparkles className='h-4.5 w-4.5 text-white relative z-10' />
            </div>
            <span className='font-display text-xl font-bold text-foreground'>
              Resume<span className='text-gradient'>IQ</span>
            </span>
          </Link>

          {/* Loading */}
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

          {/* Success */}
          {status === 'success' && (
            <>
              <div className='w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6'>
                <CheckCircle2 className='h-10 w-10 text-green-500' />
              </div>
              <h2 className='font-display text-2xl font-black text-foreground mb-3'>
                Email verified!
              </h2>
              <p className='text-muted-foreground mb-8'>
                Your account is now active. You can sign in and start building your resume.
              </p>
              <button
                onClick={() => navigate('/login')}
                className='inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.02]'
                style={{
                  background: 'linear-gradient(135deg, var(--primary), oklch(0.65 0.28 305))',
                  boxShadow: '0 4px 20px oklch(0.72 0.22 280 / 0.35)',
                }}
              >
                Go to Login
              </button>
            </>
          )}

          {/* Error */}
          {status === 'error' && (
            <>
              <div className='w-20 h-20 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-6'>
                <XCircle className='h-10 w-10 text-destructive' />
              </div>
              <h2 className='font-display text-2xl font-black text-foreground mb-3'>
                Verification failed
              </h2>
              <p className='text-muted-foreground mb-6'>{errorMsg}</p>
              <p className='text-sm text-muted-foreground mb-6'>
                Verification links expire after 24 hours. Request a new one from the login page.
              </p>
              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <Link
                  to='/login'
                  className='inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-border bg-secondary/60 hover:bg-secondary text-sm font-medium text-foreground transition-all'
                >
                  Back to Login
                </Link>
                <Link
                  to='/verify-email'
                  className='inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.02]'
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), oklch(0.65 0.28 305))',
                  }}
                >
                  Resend Verification
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EmailVerified;
