import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';

const ForgotPassword = () => {
  const [email, setEmail]   = useState('');
  const [sent, setSent]     = useState(false);
  const { mutate: sendReset, isPending } = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    sendReset(email.trim(), {
      onSuccess: () => setSent(true),
    });
  };

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-background flex items-center justify-center px-4 pt-16'>
        <div className='w-full max-w-md'>

          {/* Brand */}
          <Link to='/' className='flex items-center gap-2.5 mb-8'>
            <div className='relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary to-purple-600' />
              <Sparkles className='h-4.5 w-4.5 text-white relative z-10' />
            </div>
            <span className='font-display text-xl font-bold text-foreground'>
              Resume<span className='text-gradient'>IQ</span>
            </span>
          </Link>

          {!sent ? (
            <>
              <div className='mb-8'>
                <h2 className='font-display text-3xl font-black text-foreground mb-2 tracking-tight'>
                  Forgot your password?
                </h2>
                <p className='text-muted-foreground'>
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='space-y-1.5'>
                  <Label htmlFor='email' className='text-sm font-medium text-foreground'>
                    Email Address
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='john@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isPending}
                    className='h-12 bg-secondary/50 border-border focus:border-primary/60 rounded-xl text-sm'
                  />
                </div>

                <button
                  type='submit'
                  disabled={isPending || !email.trim()}
                  className='w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-display font-bold text-base text-white transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:scale-100'
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), oklch(0.65 0.28 305))',
                    boxShadow: '0 4px 20px oklch(0.72 0.22 280 / 0.35)',
                  }}
                >
                  {isPending
                    ? <><Loader2 className='w-5 h-5 animate-spin' /> Sending…</>
                    : <><Mail className='w-5 h-5' /> Send Reset Link</>
                  }
                </button>
              </form>

              <p className='mt-6 text-center text-sm text-muted-foreground'>
                Remember your password?{' '}
                <Link to='/login' className='text-primary hover:text-primary/80 font-semibold transition-colors'>
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            /* Success state */
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
                The link expires in 1 hour. If you don't see the email, check your spam folder.
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
                  className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
                >
                  <ArrowLeft className='h-4 w-4' /> Back to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
