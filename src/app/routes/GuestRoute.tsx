import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/features/auth/useAuth';

export function GuestRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dragons" replace />;
  }

  return <Outlet />;
}
