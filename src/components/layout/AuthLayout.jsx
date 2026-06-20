import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const AuthLayout = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    // Redirect to respective dashboard if already logged in
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return (
    <Outlet />
  );
};

export default AuthLayout;
