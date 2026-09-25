import { Request, Response, NextFunction } from 'express';
import { supabase } from '../repositories/db';
import { logger } from '../utils/logger';

/**
 * Permission checking middleware factory.
 * Usage: `router.post('/path', authMiddleware, checkPermission('create_recording'), handler)`
 */
export function checkPermission(permissionCode: string): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export function checkPermission(req: Request, permissionCode: string): Promise<void>;
export function checkPermission(arg1: any, arg2?: string): any {
  // Middleware Factory Usage: checkPermission('health:view')
  if (typeof arg1 === 'string' && arg2 === undefined) {
    const permissionCode = arg1;
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await verifyUserPermission(req, permissionCode);
        next();
      } catch (err: any) {
        logger.error('Error in checkPermission middleware:', err);
        res.status(err.status || 403).json({
          success: false,
          error: { code: err.code || 'PERMISSION_EVAL_ERROR', message: err.message || 'Failed to verify permissions' },
        });
      }
    };
  }

  // Direct Assertion Usage: await checkPermission(req, 'health:view')
  const req = arg1 as Request;
  const permissionCode = arg2 as string;
  return verifyUserPermission(req, permissionCode);
}

/**
 * Internal helper to actually query Supabase and verify permission.
 * Throws AppError on failure.
 */
async function verifyUserPermission(req: Request, permissionCode: string): Promise<void> {
  const user = req.user;
  if (!user || !user.uid) {
    throw { status: 401, code: 'UNAUTHENTICATED', message: 'Authentication required' };
  }

  if (user.role === 'superadmin' || user.role === 'service_role') {
    return;
  }

  const { data: profile, error: profErr } = await supabase
    .from('profiles')
    .select('id, organization_id')
    .eq('auth_uid', user.uid)
    .maybeSingle();

  if (profErr || !profile) {
    logger.warn(`Permission check: profile not found for uid ${user.uid}`);
    throw { status: 403, code: 'PROFILE_NOT_FOUND', message: 'User profile not found' };
  }

  const orgId = profile.organization_id;

  const { data: userRoles, error: roleErr } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', profile.id);

  if (roleErr || !userRoles || userRoles.length === 0) {
    throw { status: 403, code: 'NO_ROLES', message: 'No operational roles assigned to user' };
  }

  const roleIds = userRoles.map((r: any) => r.role_id);

  const { data: perm, error: permLookupErr } = await supabase
    .from('permissions')
    .select('id')
    .eq('code', permissionCode)
    .maybeSingle();

  if (permLookupErr || !perm) {
    logger.warn(`Permission check: unknown permission code '${permissionCode}'`);
    throw { status: 403, code: 'INVALID_PERMISSION', message: `Unknown permission: ${permissionCode}` };
  }

  const { data: permMatch, error: permMatchErr } = await supabase
    .from('role_permissions')
    .select('role_id')
    .in('role_id', roleIds)
    .eq('permission_id', perm.id);

  if (permMatchErr || !permMatch || permMatch.length === 0) {
    throw { status: 403, code: 'INSUFFICIENT_PERMISSION', message: `Missing permission: ${permissionCode}` };
  }

  const targetOrgId = (req.body?.organization_id || req.query?.organization_id) as string | undefined;
  if (targetOrgId && targetOrgId !== orgId) {
    throw { status: 403, code: 'CROSS_ORG_DENIED', message: 'Cross-organization access denied' };
  }
}
