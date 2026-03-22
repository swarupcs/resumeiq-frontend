import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Loader2, XCircle } from 'lucide-react';
import { setCredentials } from '@/features/authSlice.js';
import axiosInstance from '@/config/axiosConfig.js';
import { Link } from 'react-router-dom';

// Route: /oauth/callback
//
// After Google OAuth succeeds on the backend, the user is redirected here
// with ?success=true and the access+refresh token cookies already set.
//
// This page calls GET /user/me (which reads the cookie) to get the user object,
// then dispatches setCredentials to hydrate Redux, then navigates to /dashboard.
//
// This is the correct pattern for cookie-based OAuth — we can't read httpOnly
// cookies in JS, so we make an API call to get the user data from the server.

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const dispatch       = useDispatch();
  const [error, setError] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    const err     = searchParams.get('error');

    if (err || !success) {
      setError(true);
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get('/user/me');
        dispatch(
          setCredentials({
            success:    true,
            statusCode: 200,
            message:    'Logged in with Google',
            data:       { user: data.data.user },
          })
        );
        navigate('/dashboard', { replace: true });
      } catch {
        setError(true);
      }
    };

    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
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
            Something went wrong during Google authentication. Please try again.
          </p>
          <Link
            to='/login'
            className='inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.02]'
            style={{
              background: 'linear-gradient(135deg, var(--primary), oklch(0.65 0.28 305))',
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        <div className='relative'>
          <div className='absolute inset-0 rounded-full bg-primary/15 blur-xl animate-pulse scale-150' />
          <Loader2 className='h-10 w-10 animate-spin text-primary relative z-10' />
        </div>
        <p className='text-sm text-muted-foreground animate-pulse'>
          Signing you in with Google…
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;
