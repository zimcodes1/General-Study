import { Navigate } from 'react-router-dom';
import { auth } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    const user = auth.getUser();
    if (!user || !user.is_staff) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}

