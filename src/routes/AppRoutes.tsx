import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { selectCurrentUser, selectIsAuthenticated } from '@/features/authSlice';

// ── Lazy pages ────────────────────────────────────────────────────────────────
const LandingPage = lazy(() =>
  import('@/pages/OtherPages').then((m) => ({ default: m.LandingPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/OtherPages').then((m) => ({ default: m.NotFoundPage })),
);
const Preview = lazy(() =>
  import('@/pages/OtherPages').then((m) => ({ default: m.Preview })),
);
const Render = lazy(() =>
  import('@/pages/OtherPages').then((m) => ({ default: m.Render })),
);
const CoverLetter = lazy(() =>
  import('@/pages/OtherPages').then((m) => ({ default: m.CoverLetter })),
);

const Login = lazy(() =>
  import('@/pages/AuthPages').then((m) => ({ default: m.Login })),
);
const Signup = lazy(() =>
  import('@/pages/AuthPages').then((m) => ({ default: m.Signup })),
);

const ForgotPassword = lazy(() =>
  import('@/pages/AuthFlowPages').then((m) => ({ default: m.ForgotPassword })),
);
const ResetPassword = lazy(() =>
  import('@/pages/AuthFlowPages').then((m) => ({ default: m.ResetPassword })),
);
const VerifyEmail = lazy(() =>
  import('@/pages/AuthFlowPages').then((m) => ({ default: m.VerifyEmail })),
);
const EmailVerified = lazy(() =>
  import('@/pages/AuthFlowPages').then((m) => ({ default: m.EmailVerified })),
);
const OAuthCallback = lazy(() =>
  import('@/pages/AuthFlowPages').then((m) => ({ default: m.OAuthCallback })),
);

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ResumeBuilder = lazy(() => import('@/pages/ResumeBuilder'));

// ── Loading spinner ───────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className='min-h-screen bg-background flex items-center justify-center'>
    <Loader2 className='h-8 w-8 animate-spin text-primary' />
  </div>
);

// ── Guards ────────────────────────────────────────────────────────────────────
const ProtectedRoute = () => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  if (!user) return <Navigate to='/login' state={{ from: location }} replace />;
  return <Outlet />;
};

const GuestRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (isAuthenticated) return <Navigate to='/dashboard' replace />;
  return <Outlet />;
};

// ── App Routes ────────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Public */}
      <Route path='/' element={<LandingPage />} />
      <Route path='/preview/:resumeId' element={<Preview />} />
      <Route path='/render' element={<Render />} />

      {/* Auth flows — accessible without login */}
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password/:token' element={<ResetPassword />} />
      <Route path='/verify-email' element={<VerifyEmail />} />
      <Route path='/email-verified' element={<EmailVerified />} />
      <Route path='/oauth/callback' element={<OAuthCallback />} />

      {/* Guest only */}
      <Route element={<GuestRoute />}>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Route>

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/app/builder/:resumeId' element={<ResumeBuilder />} />
        <Route path='/app/cover-letter/:resumeId' element={<CoverLetter />} />
      </Route>

      {/* 404 */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
