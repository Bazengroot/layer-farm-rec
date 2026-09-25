import { supabase } from '@/services/supabaseClient';
import { useAuth } from '@/context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  // This is a simplified implementation. 
  // In a real scenario, permissions should be fetched from the backend/database 
  // based on the user's role and organization.
  const checkPermission = async (permissionCode: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('has_permission')
        .eq('user_id', user.id)
        .eq('permission_code', permissionCode)
        .single();

      if (error || !data) return false;
      return data.has_permission;
    } catch {
      return false;
    }
  };

  return { checkPermission };
};
