import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Eye, EyeOff, Loader2, Sparkles, ArrowRight, ShieldCheck,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useSignin } from '../hooks/auth/useSignin.js';
import GoogleAuthButton from '@/components/GoogleAuthButton.jsx';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ emailId: '', password: '' });
  const navigate = useNavigate();
  const { mutate: signin, isPending } = useSignin();

  const handleSubmit = (e) => {
    e.preventDefault();
    signin(formData, { onSuccess: () => navigate('/dashboard') });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-background flex pt-16 overflow-hidden'>
        {/* Left - Brand panel */}
        <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-purple-600/15' />
          <div className='absolute inset-0 bg-mesh opacity-30' />
          <div className='absolute top-20 left-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-float' />
          <div className='absolute bottom-20 right-10 w-60 h-60 rounded-full bg-purple-600/10 blur-3xl animate-float-slow' />
          <div
            className='absolute inset-0 opacity-[0.025]'
            style={{
              backgroundImage: 'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div className='relative z-10 flex flex-col justify-center px-12 xl:px-16'>
            <Link to='/' className='flex items-center gap-2.5 mb-14'>
              <div className='relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-primary to-purple-600' />
                <Sparkles className='h-5 w-5 text-white relative z-10' />
              </div>
              <span className='font-display text-xl font-bold text-foreground'>
                Resume<span className='text-gradient'>AI</span>
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
                { val: '95%',  label: 'Success Rate' },
                { val: '< 2min', label: 'To Create' },
              ].map((s) => (
                <div key={s.label} className='text-center px-5 py-3 rounded-2xl border border-border bg-card/40 backdrop-blur-sm'>
                  <div className='font-display font-black text-xl text-gradient'>{s.val}</div>
                  <div className='text-xs text-muted-foreground mt-0.5'>{s.label}</div>
                </div>
              ))}
            </div>
            <div className='mt-10 flex items-center gap-2.5 text-sm text-muted-foreground'>
              <ShieldCheck className='h-4.5 w-4.5 text-green-500' />
              <span>256-bit SSL encrypted · SOC 2 compliant</span>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className='w-full lg:w-1/2 flex items-center justify-center px-6 py-12'>
          <div className='w-full max-w-md'>
            {/* Mobile logo */}
            <Link to='/' className='flex items-center gap-2.5 mb-8 lg:hidden'>
              <div className='relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-primary to-purple-600' />
                <Sparkles className='h-4.5 w-4.5 text-white relative z-10' />
              </div>
              <span className='font-display text-xl font-bold text-foreground'>
                Resume<span className='text-gradient'>AI</span>
              </span>
            </Link>

            <div className='mb-8'>
              <h2 className='font-display text-3xl font-black text-foreground mb-2 tracking-tight'>
                Sign in
              </h2>
              <p className='text-muted-foreground'>
                New here?{' '}
                <Link to='/signup' className='text-primary hover:text-primary/80 font-semibold transition-colors'>
                  Create a free account
                </Link>
              </p>
            </div>

            {/* Google OAuth button */}
            <GoogleAuthButton label='Continue with Google' className='mb-4' />

            {/* Divider */}
            <div className='relative flex items-center gap-3 mb-6'>
              <div className='flex-1 h-px bg-border' />
              <span className='text-xs text-muted-foreground font-medium px-1'>or sign in with email</span>
              <div className='flex-1 h-px bg-border' />
            </div>

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='space-y-1.5'>
                <Label htmlFor='emailId' className='text-sm font-medium text-foreground'>
                  Email Address
                </Label>
                <Input
                  id='emailId' name='emailId' type='email'
                  placeholder='john@example.com'
                  value={formData.emailId}
                  onChange={handleChange}
                  required
                  className='h-12 bg-secondary/50 border-border focus:border-primary/60 rounded-xl text-sm transition-all'
                />
              </div>

              <div className='space-y-1.5'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='password' className='text-sm font-medium text-foreground'>
                    Password
                  </Label>
                  {/* Fixed: was pointing to /forgot-password which was a dead route */}
                  <Link
                    to='/forgot-password'
                    className='text-xs text-primary hover:text-primary/80 font-medium transition-colors'
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className='relative'>
                  <Input
                    id='password' name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className='h-12 bg-secondary/50 border-border focus:border-primary/60 rounded-xl text-sm pr-12 transition-all'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {showPassword ? <EyeOff className='w-4.5 h-4.5' /> : <Eye className='w-4.5 h-4.5' />}
                  </button>
                </div>
              </div>

              <button
                type='submit'
                disabled={isPending}
                className='group w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-display font-bold text-base text-white transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:scale-100'
                style={{
                  background: 'linear-gradient(135deg, var(--primary), oklch(0.65 0.28 305))',
                  boxShadow: '0 4px 20px oklch(0.72 0.22 280 / 0.35)',
                }}
              >
                {isPending
                  ? <><Loader2 className='w-5 h-5 animate-spin' /> Signing In…</>
                  : <>Sign In <ArrowRight className='w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5' /></>
                }
              </button>
            </form>

            <p className='mt-8 text-center text-sm text-muted-foreground'>
              Don't have an account?{' '}
              <Link to='/signup' className='text-primary hover:text-primary/80 font-semibold transition-colors'>
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
