import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const AuthLayout = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    // Redirect to respective dashboard if already logged in
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-base">
      <div className="w-100 p-4" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-5">
          <h1 className="h2 fw-bold score-gradient mb-1">InvestScore</h1>
          <p className="text-secondary">The platform matching elite startups with top investors.</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
