import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, XCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/features/authSlice';
import axiosInstance from '@/config/axiosConfig';

export const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const success = searchParams.get('success');
    if (!success) {
      setTimeout(() => setError(true), 0);
      return;
    }
    
    axiosInstance
      .get('/user/me')
      .then(({ data }) => {
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
  }, [dispatch, navigate, searchParams]);
  
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
