import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import Login from '../features/auth/Login';
import FounderDashboard from '../features/founder/FounderDashboard';
import ScoreForm from '../features/founder/ScoreForm';
import DealFeed from '../features/investor/DealFeed';
import SavedStartups from '../features/investor/SavedStartups';
import StartupDetails from '../features/investor/StartupDetails';

// Placeholder components for flows
const Placeholder = ({ title }) => (
  <div className="card border-0 shadow-sm p-5 text-center mt-4 mx-auto" style={{maxWidth: '600px'}}>
    <h2 className="text-muted fw-bold">{title}</h2>
    <p>This page is currently under construction.</p>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      
      {/* Auth Flow */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        {/* <Route path="register" element={<Register />} /> */}
      </Route>

      {/* Founder Flow */}
      <Route path="/founder" element={<DashboardLayout allowedRoles={['founder']} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<FounderDashboard />} />
        <Route path="onboarding" element={<ScoreForm />} />
        <Route path="profile" element={<Placeholder title="Public Startup Profile" />} />
        <Route path="settings" element={<Placeholder title="Founder Settings" />} />
      </Route>

      {/* Investor Flow */}
      <Route path="/investor" element={<DashboardLayout allowedRoles={['investor']} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DealFeed />} />
        <Route path="saved" element={<SavedStartups />} />
        <Route path="startup/:id" element={<StartupDetails />} />
        <Route path="profile" element={<Placeholder title="Investor Profile" />} />
        <Route path="settings" element={<Placeholder title="Investor Settings" />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
