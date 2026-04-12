import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import GoogleAuthButton from '@/components/GoogleAuthButton';
import { useSignin } from '@/hooks/auth/useSignin';
import type { SigninPayload } from '@/types';

export const Login = () => {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState<SigninPayload>({
    emailId: '',
    password: '',
  });
  const navigate = useNavigate();
  const { mutate: signin, isPending } = useSignin();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signin(form, { onSuccess: () => navigate('/dashboard') });
  };
  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-background flex pt-16 overflow-hidden'>
        <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-purple-600/15' />
          <div className='absolute inset-0 bg-mesh opacity-30' />
          <div className='relative z-10 flex flex-col justify-center px-12 xl:px-16'>
            <Link to='/' className='flex items-center gap-2.5 mb-14'>
              <div className='relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-primary to-purple-600' />
                <Sparkles className='h-5 w-5 text-white relative z-10' />
              </div>
              <span className='font-display text-xl font-bold text-foreground'>
                Resume<span className='text-gradient'>IQ</span>
              </span>
            </Link>
            <h1 className='text-4xl xl:text-5xl font-display font-black text-foreground mb-5 leading-tight'>
              Welcome back to
              <br />
              <span className='text-gradient'>your career hub</span>
            </h1>
            <p className='text-base text-muted-foreground max-w-sm mb-10 leading-relaxed'>
              Sign in to continue building stunning resumes that get you hired.
            </p>
            <div className='flex gap-6'>
              {[
                { val: '50K+', label: 'Resumes' },
                { val: '95%', label: 'Success Rate' },
                { val: '< 2min', label: 'To Create' },
              ].map((s) => (
                <div
                  key={s.label}
                  className='text-center px-5 py-3 rounded-2xl border border-border bg-card/40 backdrop-blur-sm'
                >
                  <div className='font-display font-black text-xl text-gradient'>
                    {s.val}
                  </div>
                  <div className='text-xs text-muted-foreground mt-0.5'>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='w-full lg:w-1/2 flex items-center justify-center px-6 py-12'>
          <div className='w-full max-w-md'>
            <div className='mb-8'>
              <h2 className='font-display text-3xl font-black text-foreground mb-2 tracking-tight'>
                Sign in
              </h2>
              <p className='text-muted-foreground'>
                New here?{' '}
                <Link
                  to='/signup'
                  className='text-primary hover:text-primary/80 font-semibold transition-colors'
                >
                  Create a free account
                </Link>
              </p>
            </div>
            <GoogleAuthButton label='Continue with Google' className='mb-4' />
            <div className='relative flex items-center gap-3 mb-6'>
              <div className='flex-1 h-px bg-border' />
              <span className='text-xs text-muted-foreground font-medium px-1'>
                or sign in with email
              </span>
              <div className='flex-1 h-px bg-border' />
            </div>
            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='space-y-1.5'>
                <Label htmlFor='emailId'>Email Address</Label>
                <Input
                  id='emailId'
                  name='emailId'
                  type='email'
                  placeholder='john@example.com'
                  value={form.emailId}
                  onChange={handleChange}
                  required
                  className='h-12 bg-secondary/50 rounded-xl'
                />
              </div>
              <div className='space-y-1.5'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='password'>Password</Label>
                  <Link
                    to='/forgot-password'
                    className='text-xs text-primary hover:text-primary/80 font-medium'
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className='relative'>
                  <Input
                    id='password'
                    name='password'
                    type={showPw ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={form.password}
                    onChange={handleChange}
                    required
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
              </div>
              <button
                type='submit'
                disabled={isPending}
                className='group w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-display font-bold text-base text-white transition-all hover:scale-[1.01] disabled:opacity-60'
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--primary)), hsl(271 76% 53%))',
                  boxShadow: '0 4px 20px hsl(var(--primary) / 0.35)',
                }}
              >
                {isPending ? (
                  <>
                    <Loader2 className='w-5 h-5 animate-spin' />
                    Signing In…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-0.5' />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
