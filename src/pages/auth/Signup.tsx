import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import GoogleAuthButton from '@/components/GoogleAuthButton';
import { useSignup } from '@/hooks/auth/useSignup';
import type { SignupPayload } from '@/types';

export const Signup = () => {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState<SignupPayload>({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
  });
  const navigate = useNavigate();
  const { mutate: signup, isPending } = useSignup();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const requirements = [
    { label: 'At least 8 characters', met: form.password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(form.password) },
    { label: 'Contains uppercase', met: /[A-Z]/.test(form.password) },
  ];
  const allMet = requirements.every((r) => r.met);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allMet) return;
    signup(form, {
      onSuccess: () =>
        navigate('/verify-email', { state: { email: form.emailId } }),
    });
  };
  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-background flex pt-16 overflow-hidden'>
        <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-purple-600/15 via-background to-primary/15' />
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
              Start your journey to
              <br />
              <span className='text-gradient'>career success</span>
            </h1>
            <div className='space-y-3'>
              {[
                'AI-powered content suggestions',
                'ATS-optimized templates',
                'Real-time live preview',
                'Export to PDF instantly',
                '4 professional templates',
                'Background removal for photos',
              ].map((f, i) => (
                <div key={i} className='flex items-center gap-3'>
                  <div className='flex items-center justify-center w-6 h-6 rounded-lg bg-primary/15 border border-primary/25 flex-shrink-0'>
                    <Check className='w-3.5 h-3.5 text-primary' />
                  </div>
                  <span className='text-sm text-foreground/80 font-medium'>
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='w-full lg:w-1/2 flex items-center justify-center px-6 py-12'>
          <div className='w-full max-w-md'>
            <div className='mb-6'>
              <h2 className='font-display text-3xl font-black text-foreground mb-2 tracking-tight'>
                Create your account
              </h2>
              <p className='text-muted-foreground'>
                Already have one?{' '}
                <Link
                  to='/login'
                  className='text-primary hover:text-primary/80 font-semibold'
                >
                  Sign in instead
                </Link>
              </p>
            </div>
            <GoogleAuthButton label='Sign up with Google' className='mb-4' />
            <div className='relative flex items-center gap-3 mb-5'>
              <div className='flex-1 h-px bg-border' />
              <span className='text-xs text-muted-foreground font-medium px-1'>
                or sign up with email
              </span>
              <div className='flex-1 h-px bg-border' />
            </div>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-1.5'>
                  <Label htmlFor='firstName'>First Name</Label>
                  <Input
                    id='firstName'
                    name='firstName'
                    type='text'
                    placeholder='John'
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className='h-12 bg-secondary/50 rounded-xl'
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='lastName'>Last Name</Label>
                  <Input
                    id='lastName'
                    name='lastName'
                    type='text'
                    placeholder='Doe'
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className='h-12 bg-secondary/50 rounded-xl'
                  />
                </div>
              </div>
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
                <Label htmlFor='password'>Password</Label>
                <div className='relative'>
                  <Input
                    id='password'
                    name='password'
                    type={showPw ? 'text' : 'password'}
                    placeholder='Create a strong password'
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
                {form.password && (
                  <div className='mt-2 space-y-1.5'>
                    {requirements.map((req, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 text-xs transition-colors ${req.met ? 'text-primary' : 'text-muted-foreground'}`}
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
              <button
                type='submit'
                disabled={isPending || !allMet}
                className='group w-full flex items-center justify-center gap-2.5 px-6 py-3.5 mt-2 rounded-xl font-display font-bold text-base text-white transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed'
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--primary)), hsl(271 76% 53%))',
                  boxShadow: '0 4px 20px hsl(var(--primary) / 0.35)',
                }}
              >
                {isPending ? (
                  <>
                    <Loader2 className='w-5 h-5 animate-spin' />
                    Creating Account…
                  </>
                ) : (
                  <>
                    Create Free Account
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
