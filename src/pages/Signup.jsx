import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Eye,
  EyeOff,
  Sparkles,
  Check,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useSignup } from '../hooks/auth/useSignup.js';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
  });
  const navigate = useNavigate();
  const { mutate: signup, isPending } = useSignup();

  // FIX: These requirements now match backend validateSignUpData rules exactly.
  // Previously the UI showed a password strength widget but never blocked submission
  // on a weak password — the backend would reject it with a 400, but the UX was poor.
  const passwordRequirements = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(formData.password) },
    { label: 'Contains uppercase', met: /[A-Z]/.test(formData.password) },
  ];

  const allRequirementsMet = passwordRequirements.every((r) => r.met);

  const passwordStrength = passwordRequirements.filter((r) => r.met).length;
  const strengthColors = [
    'bg-destructive',
    'bg-amber-500',
    'bg-primary',
    'bg-green-500',
  ];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  const handleSubmit = (e) => {
    e.preventDefault();

    // FIX: Client-side guard — prevents the API call entirely if the password
    // doesn't meet requirements. Previously the form could be submitted with
    // any password and the backend would return a 400.
    if (!allRequirementsMet) return;

    signup(formData, { onSuccess: () => navigate('/dashboard') });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const features = [
    'AI-powered content suggestions',
    'ATS-optimized templates',
    'Real-time live preview',
    'Export to PDF instantly',
    '7 professional templates',
    'Background removal for photos',
  ];

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-background flex pt-16 overflow-hidden'>
        {/* Left - Brand */}
        <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-purple-600/15 via-background to-primary/15' />
          <div className='absolute inset-0 bg-mesh opacity-30' />
          <div className='absolute top-32 right-10 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl animate-float' />
          <div className='absolute bottom-20 left-20 w-60 h-60 rounded-full bg-primary/8 blur-3xl animate-float-slow' />

          <div
            className='absolute inset-0 opacity-[0.025]'
            style={{
              backgroundImage:
                'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
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
              Start your journey to
              <br />
              <span className='text-gradient'>career success</span>
            </h1>

            <p className='text-base text-muted-foreground max-w-sm mb-10 leading-relaxed'>
              Create a professional resume in minutes with AI-powered tools and
              expert templates.
            </p>

            <div className='space-y-3'>
              {features.map((feature, i) => (
                <div key={i} className='flex items-center gap-3'>
                  <div className='flex items-center justify-center w-6 h-6 rounded-lg bg-primary/15 border border-primary/25 flex-shrink-0'>
                    <Check className='w-3.5 h-3.5 text-primary' />
                  </div>
                  <span className='text-sm text-foreground/80 font-medium'>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className='mt-10 px-5 py-4 rounded-2xl border border-border bg-card/40 backdrop-blur-sm'>
              <p className='text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider'>
                Free forever includes
              </p>
              <p className='text-sm text-foreground font-semibold'>
                3 resumes · All templates · PDF export · AI enhancements
              </p>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className='w-full lg:w-1/2 flex items-center justify-center px-6 py-12'>
          <div className='w-full max-w-md'>
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
                Create your account
              </h2>
              <p className='text-muted-foreground'>
                Already have one?{' '}
                <Link
                  to='/login'
                  className='text-primary hover:text-primary/80 font-semibold transition-colors'
                >
                  Sign in instead
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-1.5'>
                  <Label htmlFor='firstName' className='text-sm font-medium'>
                    First Name
                  </Label>
                  <Input
                    id='firstName'
                    name='firstName'
                    type='text'
                    placeholder='John'
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className='h-12 bg-secondary/50 border-border focus:border-primary/60 rounded-xl text-sm'
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='lastName' className='text-sm font-medium'>
                    Last Name
                  </Label>
                  <Input
                    id='lastName'
                    name='lastName'
                    type='text'
                    placeholder='Doe'
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className='h-12 bg-secondary/50 border-border focus:border-primary/60 rounded-xl text-sm'
                  />
                </div>
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='emailId' className='text-sm font-medium'>
                  Email Address
                </Label>
                <Input
                  id='emailId'
                  name='emailId'
                  type='email'
                  placeholder='john@example.com'
                  value={formData.emailId}
                  onChange={handleChange}
                  required
                  className='h-12 bg-secondary/50 border-border focus:border-primary/60 rounded-xl text-sm'
                />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='password' className='text-sm font-medium'>
                  Password
                </Label>
                <div className='relative'>
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Create a strong password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className='h-12 bg-secondary/50 border-border focus:border-primary/60 rounded-xl text-sm pr-12'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {showPassword ? (
                      <EyeOff className='w-4.5 h-4.5' />
                    ) : (
                      <Eye className='w-4.5 h-4.5' />
                    )}
                  </button>
                </div>

                {/* Password strength */}
                {formData.password && (
                  <div className='mt-3 space-y-2'>
                    <div className='flex gap-1.5'>
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength
                              ? strengthColors[passwordStrength]
                              : 'bg-secondary'
                          }`}
                        />
                      ))}
                      {passwordStrength > 0 && (
                        <span
                          className={`text-xs font-medium ml-1 ${
                            passwordStrength === 3
                              ? 'text-green-500'
                              : passwordStrength === 2
                                ? 'text-primary'
                                : 'text-amber-500'
                          }`}
                        >
                          {strengthLabels[passwordStrength]}
                        </span>
                      )}
                    </div>

                    <div className='space-y-1.5'>
                      {passwordRequirements.map((req, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 text-xs transition-colors ${req.met ? 'text-primary' : 'text-muted-foreground'}`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${req.met ? 'bg-primary/15 border border-primary/30' : 'bg-secondary'}`}
                          >
                            {req.met && <Check className='w-2.5 h-2.5' />}
                          </div>
                          {req.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* FIX: Button is disabled until all password requirements are met.
                  Previously it only disabled on isPending — a weak password
                  would trigger the API call and get a 400 back from the backend. */}
              <button
                type='submit'
                disabled={isPending || !allRequirementsMet}
                className='group w-full flex items-center justify-center gap-2.5 px-6 py-3.5 mt-2 rounded-xl font-display font-bold text-base text-white transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed'
                style={{
                  background:
                    'linear-gradient(135deg, var(--primary), oklch(0.65 0.28 305))',
                  boxShadow: '0 4px 20px oklch(0.72 0.22 280 / 0.35)',
                }}
              >
                {isPending ? (
                  <>
                    <Loader2 className='w-5 h-5 animate-spin' /> Creating
                    Account...
                  </>
                ) : (
                  <>
                    Create Free Account{' '}
                    <ArrowRight className='w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5' />
                  </>
                )}
              </button>
            </form>

            <p className='mt-5 text-center text-xs text-muted-foreground'>
              By signing up, you agree to our{' '}
              <Link to='/terms' className='text-primary hover:underline'>
                Terms
              </Link>{' '}
              and{' '}
              <Link to='/privacy' className='text-primary hover:underline'>
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
