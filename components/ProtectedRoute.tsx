import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-primary-600" size={48} />
        </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};