import { Route, Routes } from 'react-router-dom';
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

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path='/' element={<LandingPage />} />
      <Route path='/view/:resumeId' element={<Preview />} />
      <Route path='/preview/:resumeId' element={<Preview />} />
      <Route path='/render' element={<Render />} />

      {/* Guest only */}
      <Route element={<GuestRoute />}>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Route>

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/app/builder/:resumeId' element={<ResumeBuilder />} />
      </Route>

      {/* 404 */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
