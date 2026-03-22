import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import LandingPage from '@/pages/LandingPage.jsx';
import Login from '@/pages/Login.jsx';
import Signup from '@/pages/Signup.jsx';
import Dashboard from '@/pages/Dashboard.jsx';
import ResumeBuilder from '@/pages/ResumeBuilder.jsx';
import Preview from '@/pages/Preview.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';
import Render from '@/pages/Render.jsx';
import CoverLetter from '@/pages/CoverLetter.jsx';

// Auth feature pages
import ForgotPassword from '@/pages/ForgotPassword.jsx';
import ResetPassword  from '@/pages/ResetPassword.jsx';
import VerifyEmail    from '@/pages/VerifyEmail.jsx';
import EmailVerified  from '@/pages/EmailVerified.jsx';
import OAuthCallback  from '@/pages/OAuthCallback.jsx';

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path='/' element={<LandingPage />} />
      <Route path='/view/:resumeId'    element={<Navigate to='/preview/:resumeId' replace />} />
      <Route path='/preview/:resumeId' element={<Preview />} />
      <Route path='/render'            element={<Render />} />

      {/* Auth flows — public, accessible without login */}
      <Route path='/forgot-password'       element={<ForgotPassword />} />
      <Route path='/reset-password/:token' element={<ResetPassword />} />
      <Route path='/verify-email'          element={<VerifyEmail />} />
      <Route path='/email-verified'        element={<EmailVerified />} />
      {/* Google OAuth callback — must be public, not inside GuestRoute,
          because the user's cookies are being set for the first time here */}
      <Route path='/oauth/callback'        element={<OAuthCallback />} />

      {/* Guest only — redirect to /dashboard if already logged in */}
      <Route element={<GuestRoute />}>
        <Route path='/login'  element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Route>

      {/* Protected — redirect to /login if not authenticated */}
      <Route element={<ProtectedRoute />}>
        <Route path='/dashboard'                  element={<Dashboard />} />
        <Route path='/app/builder/:resumeId'      element={<ResumeBuilder />} />
        <Route path='/app/cover-letter/:resumeId' element={<CoverLetter />} />
      </Route>

      {/* 404 */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
