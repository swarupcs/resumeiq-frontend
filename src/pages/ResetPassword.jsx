import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle2, Check, Sparkles, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { useResetPassword } from '@/hooks/auth/useResetPassword';
import { toast } from 'sonner';

const ResetPassword = () => {
  const { token }    = useParams();
  const navigate     = useNavigate();
  const [password, setPassword]         = useState('');
  const [confirm, setConfirm]           = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone]                 = useState(false);
  const { mutate: resetPw, isPending }  = useResetPassword();

  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number',     met: /\d/.test(password) },
    { label: 'Contains uppercase',    met: /[A-Z]/.test(password) },
  ];
  const allMet   = requirements.every((r) => r.met);
  const matches  = password === confirm && confirm.length > 0;
  const canSubmit = allMet && matches;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    resetPw(
      { token, password },
      {
        onSuccess: () => setDone(true),
        onError:   (err) => toast.error(err.message || 'Reset link may have expired'),
      }
    );
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

          {!done ? (
            <>
              <div className='mb-8'>
                <h2 className='font-display text-3xl font-black text-foreground mb-2 tracking-tight'>
                  Choose a new password
                </h2>
                <p className='text-muted-foreground'>
                  Make it strong — you won't need to change it again anytime soon.
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='space-y-1.5'>
                  <Label htmlFor='password' className='text-sm font-medium text-foreground'>
                    New Password
                  </Label>
                  <div className='relative'>
                    <Input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Create a strong password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isPending}
                      className='h-12 bg-secondary/50 border-border focus:border-primary/60 rounded-xl text-sm pr-12'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                    >
                      {showPassword ? <EyeOff className='w-4.5 h-4.5' /> : <Eye className='w-4.5 h-4.5' />}
                    </button>
                  </div>

                  {/* Requirements */}
                  {password && (
                    <div className='mt-2 space-y-1.5'>
                      {requirements.map((req, i) => (
                        <div key={i} className={`flex items-center gap-2 text-xs transition-colors ${req.met ? 'text-primary' : 'text-muted-foreground'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${req.met ? 'bg-primary/15 border border-primary/30' : 'bg-secondary'}`}>
                            {req.met && <Check className='w-2.5 h-2.5' />}
                          </div>
                          {req.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='confirm' className='text-sm font-medium text-foreground'>
                    Confirm Password
                  </Label>
                  <Input
                    id='confirm'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Repeat your new password'
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    disabled={isPending}
                    className={`h-12 bg-secondary/50 border-border focus:border-primary/60 rounded-xl text-sm ${
                      confirm && !matches ? 'border-destructive focus:border-destructive' : ''
                    }`}
                  />
                  {confirm && !matches && (
                    <p className='text-xs text-destructive mt-1'>Passwords don't match</p>
                  )}
                </div>

                <button
                  type='submit'
                  disabled={isPending || !canSubmit}
                  className='w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-display font-bold text-base text-white transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed'
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), oklch(0.65 0.28 305))',
                    boxShadow: '0 4px 20px oklch(0.72 0.22 280 / 0.35)',
                  }}
                >
                  {isPending
                    ? <><Loader2 className='w-5 h-5 animate-spin' /> Resetting…</>
                    : <><Lock className='w-5 h-5' /> Reset Password</>
                  }
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div className='text-center'>
              <div className='w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6'>
                <CheckCircle2 className='h-10 w-10 text-green-500' />
              </div>
              <h2 className='font-display text-2xl font-black text-foreground mb-3'>
                Password reset!
              </h2>
              <p className='text-muted-foreground mb-8'>
                Your password has been changed successfully. You can now log in with your new password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className='inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.02]'
                style={{
                  background: 'linear-gradient(135deg, var(--primary), oklch(0.65 0.28 305))',
                  boxShadow: '0 4px 20px oklch(0.72 0.22 280 / 0.35)',
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

export default ResetPassword;
