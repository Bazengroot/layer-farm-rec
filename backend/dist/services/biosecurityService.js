"use strict";
// backend/src/services/biosecurityService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.biosecurityService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
const uuid_1 = require("uuid");
/** Service for CRUD on biosecurity checklist records */
exports.biosecurityService = {
    /** List all biosecurity checklist records for an organization */
    async list(orgId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('biosecurity_checklist_records')
            .select('*')
            .eq('organization_id', orgId);
        if (error)
            throw error;
        return data;
    },
    /** Create a new biosecurity checklist record */
    async create(orgId, payload) {
        const { error } = await supabaseAdmin_1.supabaseAdmin
            .from('biosecurity_checklist_records')
            .insert({
            id: (0, uuid_1.v4)(),
            organization_id: orgId,
            ...payload,
        });
        if (error)
            throw error;
    },
    /** Update an existing biosecurity checklist record */
    async update(id, payload) {
        const { error } = await supabaseAdmin_1.supabaseAdmin
            .from('biosecurity_checklist_records')
            .update(payload)
            .eq('id', id);
        if (error)
            throw error;
    },
    /** Delete a biosecurity checklist record */
    async delete(id) {
        const { error } = await supabaseAdmin_1.supabaseAdmin
            .from('biosecurity_checklist_records')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
    },
};
//# sourceMappingURL=biosecurityService.js.map