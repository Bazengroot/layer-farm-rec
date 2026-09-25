"use strict";
// backend/src/services/evidenceService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.evidenceService = exports.EvidenceService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
const AppError_1 = require("../utils/AppError");
const auditService_1 = require("./auditService");
class EvidenceService {
    /**
     * Register attachment metadata in database
     */
    async registerEvidence(payload) {
        if (payload.file_size > 10 * 1024 * 1024) {
            throw new AppError_1.AppError('File exceeds 10 MB limit', 400, 'FILE_TOO_LARGE');
        }
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('evidence_attachments')
            .insert([{
                entity_type: payload.entity_type,
                entity_id: payload.entity_id,
                bucket_name: payload.bucket_name || 'evidence-private',
                file_path: payload.file_path,
                file_name: payload.file_name,
                file_size: payload.file_size,
                mime_type: payload.mime_type,
                uploaded_by: payload.uploaded_by,
            }])
            .select()
            .single();
        if (error)
            throw error;
        await auditService_1.auditService.log({
            action_type: 'EVIDENCE_UPLOAD',
            entity_type: payload.entity_type,
            entity_id: payload.entity_id,
            user_id: payload.uploaded_by,
            changes_json: { file_name: payload.file_name, file_size: payload.file_size },
        });
        return data;
    }
    /**
     * Fetch attachments for an entity
     */
    async getEvidence(entityType, entityId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('evidence_attachments')
            .select('*')
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data;
    }
    /**
     * Delete evidence attachment
     */
    async deleteEvidence(evidenceId, userId) {
        const { data: evidence, error: fetchErr } = await supabaseAdmin_1.supabaseAdmin
            .from('evidence_attachments')
            .select('*')
            .eq('id', evidenceId)
            .single();
        if (fetchErr || !evidence)
            throw new Error('Evidence file not found');
        const { error: delErr } = await supabaseAdmin_1.supabaseAdmin
            .from('evidence_attachments')
            .delete()
            .eq('id', evidenceId);
        if (delErr)
            throw delErr;
        await auditService_1.auditService.log({
            action_type: 'EVIDENCE_DELETE',
            entity_type: evidence.entity_type,
            entity_id: evidence.entity_id,
            user_id: userId,
            changes_json: { file_name: evidence.file_name, file_path: evidence.file_path },
        });
        return { success: true };
    }
}
exports.EvidenceService = EvidenceService;
exports.evidenceService = new EvidenceService();
//# sourceMappingURL=evidenceService.js.map