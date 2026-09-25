"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = checkPermission;
const db_1 = require("../repositories/db");
const logger_1 = require("../utils/logger");
function checkPermission(arg1, arg2) {
    // Middleware Factory Usage: checkPermission('health:view')
    if (typeof arg1 === 'string' && arg2 === undefined) {
        const permissionCode = arg1;
        return async (req, res, next) => {
            try {
                await verifyUserPermission(req, permissionCode);
                next();
            }
            catch (err) {
                logger_1.logger.error('Error in checkPermission middleware:', err);
                res.status(err.status || 403).json({
                    success: false,
                    error: { code: err.code || 'PERMISSION_EVAL_ERROR', message: err.message || 'Failed to verify permissions' },
                });
            }
        };
    }
    // Direct Assertion Usage: await checkPermission(req, 'health:view')
    const req = arg1;
    const permissionCode = arg2;
    return verifyUserPermission(req, permissionCode);
}
/**
 * Internal helper to actually query Supabase and verify permission.
 * Throws AppError on failure.
 */
async function verifyUserPermission(req, permissionCode) {
    const user = req.user;
    if (!user || !user.uid) {
        throw { status: 401, code: 'UNAUTHENTICATED', message: 'Authentication required' };
    }
    if (user.role === 'superadmin' || user.role === 'service_role') {
        return;
    }
    const { data: profile, error: profErr } = await db_1.supabase
        .from('profiles')
        .select('id, organization_id')
        .eq('auth_uid', user.uid)
        .maybeSingle();
    if (profErr || !profile) {
        logger_1.logger.warn(`Permission check: profile not found for uid ${user.uid}`);
        throw { status: 403, code: 'PROFILE_NOT_FOUND', message: 'User profile not found' };
    }
    const orgId = profile.organization_id;
    const { data: userRoles, error: roleErr } = await db_1.supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', profile.id);
    if (roleErr || !userRoles || userRoles.length === 0) {
        throw { status: 403, code: 'NO_ROLES', message: 'No operational roles assigned to user' };
    }
    const roleIds = userRoles.map((r) => r.role_id);
    const { data: perm, error: permLookupErr } = await db_1.supabase
        .from('permissions')
        .select('id')
        .eq('code', permissionCode)
        .maybeSingle();
    if (permLookupErr || !perm) {
        logger_1.logger.warn(`Permission check: unknown permission code '${permissionCode}'`);
        throw { status: 403, code: 'INVALID_PERMISSION', message: `Unknown permission: ${permissionCode}` };
    }
    const { data: permMatch, error: permMatchErr } = await db_1.supabase
        .from('role_permissions')
        .select('role_id')
        .in('role_id', roleIds)
        .eq('permission_id', perm.id);
    if (permMatchErr || !permMatch || permMatch.length === 0) {
        throw { status: 403, code: 'INSUFFICIENT_PERMISSION', message: `Missing permission: ${permissionCode}` };
    }
    const targetOrgId = (req.body?.organization_id || req.query?.organization_id);
    if (targetOrgId && targetOrgId !== orgId) {
        throw { status: 403, code: 'CROSS_ORG_DENIED', message: 'Cross-organization access denied' };
    }
}
//# sourceMappingURL=permissionMiddleware.js.map