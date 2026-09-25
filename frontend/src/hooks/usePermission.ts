import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook to check if the current user has a given permission code.
 * In Phase 0 this queries the user's roles from the profile stored in auth context.
 * In later phases this will be backed by a dedicated API endpoint with caching.
 *
 * @returns `hasPermission(code)` — synchronous check, false when permissions not loaded
 */
export function usePermission() {
  const { user } = useAuth();

  const hasPermission = useCallback(
    (_code: string): boolean => {
      // Phase 0: If user is authenticated, grant basic access.
      // Full RBAC permission check will be implemented in Phase 1
      // when the profiles and role_permissions tables are queried.
      if (!user) return false;
      return true; // placeholder — scoped per-route in later phases
    },
    [user],
  );

  const isAuthenticated = !!user;

  return { hasPermission, isAuthenticated };
}
