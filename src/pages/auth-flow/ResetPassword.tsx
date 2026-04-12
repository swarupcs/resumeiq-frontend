import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { useResetPassword } from '@/hooks/auth/usePasswordReset';
import { toast } from 'sonner';
import { BrandLink } from '@/components/BrandLink';

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
