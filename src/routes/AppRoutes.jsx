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

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path='/' element={<LandingPage />} />
      <Route path='/view/:resumeId' element={<Navigate to='/preview/:resumeId' replace />} />
      <Route path='/preview/:resumeId' element={<Preview />} />
      <Route path='/render' element={<Render />} />

      {/* Guest only */}
      <Route element={<GuestRoute />}>
        <Route path='/login'  element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Route>

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path='/dashboard'                    element={<Dashboard />} />
        <Route path='/app/builder/:resumeId'        element={<ResumeBuilder />} />
        {/* Phase 5 — Feature 4: Cover letter generator */}
        <Route path='/app/cover-letter/:resumeId'   element={<CoverLetter />} />
      </Route>

      {/* 404 */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
