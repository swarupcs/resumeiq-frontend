import { useState, useEffect } from 'react';
import {
  Link,
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Loader2,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Check,
  Sparkles,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import {
  useForgotPassword,
  useResetPassword,
} from '@/hooks/auth/usePasswordReset';
import {
  useVerifyEmail,
  useResendVerification,
} from '@/hooks/auth/useEmailVerification';
import { toast } from 'sonner';

const BrandLink = () => (
  <Link to='/' className='flex items-center gap-2.5 mb-8'>
    <div className='relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-primary to-purple-600' />
      <Sparkles className='h-4 w-4 text-white relative z-10' />
    </div>
    <span className='font-display text-xl font-bold text-foreground'>
      Resume<span className='text-gradient'>IQ</span>
    </span>
  </Link>
);

// ── ForgotPassword ────────────────────────────────────────────────────────────
export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { mutate: sendReset, isPending } = useForgotPassword();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    sendReset(email.trim(), { onSuccess: () => setSent(true) });
  };
  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-background flex items-center justify-center px-4 pt-16'>
        <div className='w-full max-w-md'>
          <BrandLink />
          {!sent ? (
            <>
              <div className='mb-8'>
                <h2 className='font-display text-3xl font-black text-foreground mb-2 tracking-tight'>
                  Forgot your password?
                </h2>
                <p className='text-muted-foreground'>
                  Enter your email and we'll send a reset link.
                </p>
              </div>
              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='space-y-1.5'>
                  <Label htmlFor='email'>Email Address</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='john@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isPending}
                    className='h-12 bg-secondary/50 rounded-xl'
                  />
                </div>
                <button
                  type='submit'
                  disabled={isPending || !email.trim()}
                  className='w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-display font-bold text-base text-white transition-all hover:scale-[1.01] disabled:opacity-60'
                  style={{
                    background:
                      'linear-gradient(135deg, hsl(var(--primary)), hsl(271 76% 53%))',
                  }}
                >
                  {isPending ? (
                    <>
                      <Loader2 className='w-5 h-5 animate-spin' />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Mail className='w-5 h-5' />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
              <p className='mt-6 text-center text-sm text-muted-foreground'>
                Remember your password?{' '}
                <Link
                  to='/login'
                  className='text-primary hover:text-primary/80 font-semibold'
                >
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <div className='text-center'>
              <div className='w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6'>
                <CheckCircle2 className='h-10 w-10 text-green-500' />
              </div>
              <h2 className='font-display text-2xl font-black text-foreground mb-3'>
                Check your inbox
              </h2>
              <p className='text-muted-foreground mb-2'>
                We've sent a password reset link to
              </p>
              <p className='font-semibold text-foreground mb-6'>{email}</p>
              <p className='text-sm text-muted-foreground mb-8'>
                The link expires in 1 hour. Check your spam folder if you don't
                see it.
              </p>
              <button
                onClick={() => setSent(false)}
                className='text-sm text-primary hover:text-primary/80 font-medium transition-colors'
              >
                Didn't receive it? Send again
              </button>
              <div className='mt-6'>
                <Link
                  to='/login'
                  className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'
                >
                  <ArrowLeft className='h-4 w-4' />
                  Back to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ── ResetPassword ─────────────────────────────────────────────────────────────
export const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);
  const { mutate: resetPw, isPending } = useResetPassword();
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Contains uppercase', met: /[A-Z]/.test(password) },
  ];
  const allMet = requirements.every((r) => r.met);
  const matches = password === confirm && confirm.length > 0;
  const canSubmit = allMet && matches;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !token) return;
    resetPw(
      { token, password },
      {
        onSuccess: () => setDone(true),
        onError: () => toast.error('Reset link may have expired'),
      },
    );
  };
  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-background flex items-center justify-center px-4 pt-16'>
        <div className='w-full max-w-md'>
          <BrandLink />
          {!done ? (
            <>
              <div className='mb-8'>
                <h2 className='font-display text-3xl font-black text-foreground mb-2 tracking-tight'>
                  Choose a new password
                </h2>
              </div>
              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='space-y-1.5'>
                  <Label htmlFor='password'>New Password</Label>
                  <div className='relative'>
                    <Input
                      id='password'
                      type={showPw ? 'text' : 'password'}
                      placeholder='Create a strong password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isPending}
                      className='h-12 bg-secondary/50 rounded-xl pr-12'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPw(!showPw)}
                      className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                    >
                      {showPw ? (
                        <EyeOff className='w-4 h-4' />
                      ) : (
                        <Eye className='w-4 h-4' />
                      )}
                    </button>
                  </div>
                  {password && (
                    <div className='mt-2 space-y-1.5'>
                      {requirements.map((req, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 text-xs ${req.met ? 'text-primary' : 'text-muted-foreground'}`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-primary/15 border border-primary/30' : 'bg-secondary'}`}
                          >
                            {req.met && <Check className='w-2.5 h-2.5' />}
                          </div>
                          {req.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='confirm'>Confirm Password</Label>
                  <Input
                    id='confirm'
                    type={showPw ? 'text' : 'password'}
                    placeholder='Repeat your new password'
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    disabled={isPending}
                    className={`h-12 bg-secondary/50 rounded-xl ${confirm && !matches ? 'border-destructive' : ''}`}
                  />
                  {confirm && !matches && (
                    <p className='text-xs text-destructive mt-1'>
                      Passwords don't match
                    </p>
                  )}
                </div>
                <button
                  type='submit'
                  disabled={isPending || !canSubmit}
                  className='w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-display font-bold text-base text-white transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed'
                  style={{
                    background:
                      'linear-gradient(135deg, hsl(var(--primary)), hsl(271 76% 53%))',
                  }}
                >
                  {isPending ? (
                    <>
                      <Loader2 className='w-5 h-5 animate-spin' />
                      Resetting…
                    </>
                  ) : (
                    <>
                      <Lock className='w-5 h-5' />
                      Reset Password
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className='text-center'>
              <div className='w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6'>
                <CheckCircle2 className='h-10 w-10 text-green-500' />
              </div>
              <h2 className='font-display text-2xl font-black text-foreground mb-3'>
                Password reset!
              </h2>
              <p className='text-muted-foreground mb-8'>
                You can now log in with your new password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className='inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.02]'
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--primary)), hsl(271 76% 53%))',
                }}
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ── VerifyEmail ───────────────────────────────────────────────────────────────
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

// ── EmailVerified ─────────────────────────────────────────────────────────────
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
      setStatus('error');
      setErrorMsg('No verification token found in the URL.');
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
  }, [token]);
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

// ── OAuthCallback ─────────────────────────────────────────────────────────────
export const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { useDispatch } = require('react-redux');
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  useEffect(() => {
    const success = searchParams.get('success');
    if (!success) {
      setError(true);
      return;
    }
    import('@/config/axiosConfig').then(({ default: axiosInstance }) => {
      axiosInstance
        .get('/user/me')
        .then(({ data }) => {
          const { setCredentials } = require('@/features/authSlice');
          dispatch(
            setCredentials({
              success: true,
              statusCode: 200,
              message: 'Logged in with Google',
              data: { user: (data as { data: { user: unknown } }).data.user },
            }),
          );
          navigate('/dashboard', { replace: true });
        })
        .catch(() => setError(true));
    });
  }, []);
  if (error)
    return (
      <div className='min-h-screen bg-background flex items-center justify-center px-4'>
        <div className='text-center max-w-sm'>
          <div className='w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-4'>
            <XCircle className='h-8 w-8 text-destructive' />
          </div>
          <h2 className='font-display text-xl font-black text-foreground mb-2'>
            Google sign-in failed
          </h2>
          <p className='text-sm text-muted-foreground mb-6'>
            Something went wrong. Please try again.
          </p>
          <Link
            to='/login'
            className='inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-white text-sm'
            style={{
              background:
                'linear-gradient(135deg, hsl(var(--primary)), hsl(271 76% 53%))',
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        <Loader2 className='h-10 w-10 animate-spin text-primary' />
        <p className='text-sm text-muted-foreground animate-pulse'>
          Signing you in with Google…
        </p>
      </div>
    </div>
  );
};
