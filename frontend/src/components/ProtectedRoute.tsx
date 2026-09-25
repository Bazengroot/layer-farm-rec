import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/Spinner';
import { PermissionGuard } from '@/components/PermissionGuard';

type Props = {
  children: JSX.Element;
  requiredPermission?: string;
};

export const ProtectedRoute: React.FC<Props> = ({ children, requiredPermission }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
        <Spinner size="lg" />
        <p className="mt-4 text-xs font-medium text-slate-500">Memuat sesi...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission) {
    return (
      <PermissionGuard permission={requiredPermission}>
        {children}
      </PermissionGuard>
    );
  }

  return children;
};

export default ProtectedRoute;
