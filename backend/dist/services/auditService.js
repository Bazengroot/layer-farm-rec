"use strict";
// backend/src/services/auditService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditService = exports.AuditService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
class AuditService {
    async log(payload) {
        try {
            await supabaseAdmin_1.supabaseAdmin.from('audit_logs').insert([payload]);
        }
        catch (err) {
            console.error('Failed to record audit log entry:', err);
        }
    }
    async getLogs(entityType, limit = 50) {
        let query = supabaseAdmin_1.supabaseAdmin
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
        if (entityType)
            query = query.eq('entity_type', entityType);
        const { data, error } = await query;
        if (error)
            throw error;
        return data;
    }
}
exports.AuditService = AuditService;
exports.auditService = new AuditService();
//# sourceMappingURL=auditService.js.map