import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import Login from '../features/auth/Login';
import Signup from '../features/auth/Signup';
import FounderDashboard from '../features/founder/FounderDashboard';
import FounderProfile from '../features/founder/FounderProfile';
import ScoreForm from '../features/founder/ScoreForm';
import InvestorsList from '../features/founder/InvestorsList';
import InvestorDetail from '../features/founder/InvestorDetail';
import DealFeed from '../features/investor/DealFeed';
import SavedStartups from '../features/investor/SavedStartups';
import StartupDetails from '../features/investor/StartupDetails';
import InvestorProfile from '../features/investor/InvestorProfile';
import PublicProfile from '../features/public/PublicProfile';
import LandingPage from '../features/public/LandingPage';

const Placeholder = ({ title }) => (
  <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '480px', margin: '40px auto' }}>
    <div className="card-h">{title}</div>
    <p style={{ color: 'var(--ink-dim)', fontSize: '14px' }}>Coming soon.</p>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Flow */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Founder Flow */}
      <Route path="/founder" element={<DashboardLayout allowedRoles={['founder']} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<FounderDashboard />} />
        <Route path="onboarding" element={<ScoreForm />} />
        <Route path="profile" element={<FounderProfile />} />
        <Route path="investors" element={<InvestorsList />} />
        <Route path="investors/:id" element={<InvestorDetail />} />
        <Route path="settings" element={<Placeholder title="Settings" />} />
      </Route>

      {/* Investor Flow */}
      <Route path="/investor" element={<DashboardLayout allowedRoles={['investor']} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DealFeed />} />
        <Route path="saved" element={<SavedStartups />} />
        <Route path="startup/:id" element={<StartupDetails />} />
        <Route path="profile" element={<InvestorProfile />} />
        <Route path="settings" element={<Placeholder title="Settings" />} />
      </Route>

      {/* Public profile — accessible without login */}
      <Route path="/profile/:role/:slug" element={<PublicProfile />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
