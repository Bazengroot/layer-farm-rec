import React, { useEffect, useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';

type Props = {
  children: React.ReactNode;
  permission: string;
};

export const PermissionGuard: React.FC<Props> = ({ children, permission }) => {
  const { checkPermission } = usePermissions();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      const result = await checkPermission(permission);
      setHasPermission(result);
    };
    verify();
  }, [permission, checkPermission]);

  if (hasPermission === null) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <Spinner size="sm" />
      </div>
    );
  }

  if (!hasPermission) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PermissionGuard;
