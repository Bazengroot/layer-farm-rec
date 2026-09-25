"use strict";
// backend/src/services/workflowService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowService = exports.WorkflowService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
const auditService_1 = require("./auditService");
class WorkflowService {
    async submitApprovalRequest(payload) {
        const { data: request, error } = await supabaseAdmin_1.supabaseAdmin
            .from('approval_requests')
            .insert([{
                record_type: payload.record_type,
                record_id: payload.record_id,
                submitter_id: payload.submitter_id,
                status: 'Submitted',
                notes: payload.notes,
            }])
            .select()
            .single();
        if (error)
            throw error;
        await supabaseAdmin_1.supabaseAdmin.from('approval_history').insert([{
                request_id: request.id,
                reviewer_id: payload.submitter_id,
                action: 'Submitted',
                notes: payload.notes,
            }]);
        await auditService_1.auditService.log({
            action_type: 'SUBMIT',
            entity_type: payload.record_type,
            entity_id: payload.record_id,
            user_id: payload.submitter_id,
            changes_json: { status: 'Submitted' },
        });
        return request;
    }
    async reviewApprovalRequest(payload) {
        const { data: request, error: reqErr } = await supabaseAdmin_1.supabaseAdmin
            .from('approval_requests')
            .select('*')
            .eq('id', payload.request_id)
            .single();
        if (reqErr || !request)
            throw new Error('Approval request not found');
        const { data: updatedReq, error: updateErr } = await supabaseAdmin_1.supabaseAdmin
            .from('approval_requests')
            .update({
            status: payload.action,
            updated_at: new Date().toISOString(),
        })
            .eq('id', payload.request_id)
            .select()
            .single();
        if (updateErr)
            throw updateErr;
        await supabaseAdmin_1.supabaseAdmin.from('approval_history').insert([{
                request_id: payload.request_id,
                reviewer_id: payload.reviewer_id,
                action: payload.action,
                notes: payload.notes,
            }]);
        await auditService_1.auditService.log({
            action_type: payload.action.toUpperCase().replace(/\s+/g, '_'),
            entity_type: request.record_type,
            entity_id: request.record_id,
            user_id: payload.reviewer_id,
            changes_json: { status: payload.action, notes: payload.notes },
        });
        return updatedReq;
    }
    async getPendingApprovals() {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('approval_requests')
            .select('*, approval_history(*)')
            .in('status', ['Submitted', 'Under Review', 'Correction Requested'])
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data;
    }
}
exports.WorkflowService = WorkflowService;
exports.workflowService = new WorkflowService();
//# sourceMappingURL=workflowService.js.map