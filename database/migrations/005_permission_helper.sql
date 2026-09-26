-- ============================================================================
-- Layer Farm Recording & Management System (LFRMS)
-- Migration: 004b_permission_helper.sql
-- Description: Core RBAC helper function for RLS policies
-- ============================================================================

CREATE OR REPLACE FUNCTION public.has_permission(
    user_id UUID,
    permission_code TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    has_perm BOOLEAN;
BEGIN
    -- Check if the user has the permission through any of their assigned roles
    SELECT EXISTS (
        SELECT 1
        FROM public.user_role_assignments ura
        JOIN public.role_permission_assignments rpa ON ura.role_id = rpa.role_id
        WHERE ura.user_id = user_id
        AND rpa.permission_code = permission_code
    ) INTO has_perm;

    RETURN has_perm;
END;
$$;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION public.has_permission(UUID, TEXT) TO authenticated;
